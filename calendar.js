require('dotenv').config();

const { google } = require('googleapis');
const ical = require('node-ical');

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_KEY_FILE, // Путь к вашему JSON-файлу
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendarId = process.env.GOOGLE_CALENDAR_ID;
const icsCalendarUrl = process.env.YANDEX_ICS_URL;



// Функция для добавления события в Google Calendar
async function importEventToGoogleCalendar(calendar, eventData) {
    console.log(eventData.uid);
    const event = {
        iCalUID: eventData.uid, // Уникальный ID события из .ics
        summary: eventData.summary || 'Без названия',
        description: eventData.description || '',
        start: {
            dateTime: eventData.start.toISOString(),
            timeZone: eventData.start.tz || 'UTC',
        },
        end: {
            dateTime: eventData.end.toISOString(),
            timeZone: eventData.end.tz || 'UTC',
        },
        location: eventData.location || '',
    };

    try {
        const response = await calendar.events.import({
            calendarId: calendarId, // Замени на твой calendarId
            resource: event,
        });


        console.log(`Событие "${event.summary}" импортировано: ${response.data.htmlLink}`);
    } catch (error) {
        if (error.code === 409) {
            console.log(`Событие "${event.summary}" уже существует (iCalUID: ${event.iCalUID})`);
        } else {
            console.error(`Ошибка при импорте события "${event.summary}":`, error.message);
        }
    }
}

// Основная функция для обработки iCal и добавления событий
async function importYandexEvents() {
    const calendar = google.calendar({ version: 'v3', auth });
    const events = await ical.async.fromURL(icsCalendarUrl);

    let added = 0;
    let skipped = 0;
    let dateNow = new Date();

    // Проходим по всем событиям из .ics-файла
    for (const event of Object.values(events)) {
        if (event.type === 'VEVENT' && event.start > dateNow) { // Проверяем, что это событие

            const eventData = {
                uid: event.uid,
                summary: event.summary,
                description: event.description,
                start: event.start, // Дата начала (объект Date)
                end: event.end,    // Дата окончания (объект Date)
                location: event.location,
            };

            // Добавляем событие в Google Calendar
            await importEventToGoogleCalendar(calendar, eventData);
            eventData.uid ? added++ : skipped++; // Подсчёт добавленных и пропу
        }
    }

    console.log(`Импорт завершён. Добавлено: ${added}, Пропущено (дубликаты): ${skipped}`);
}

// Запуск и обработка ошибок
importYandexEvents().catch(console.error);
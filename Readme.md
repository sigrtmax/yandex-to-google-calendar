# Импорт событий из яндекс календаря в google календарь


## Настройка сервисного аккаунта для Google Calendar API

Следующие шаги описывают процесс создания сервисного аккаунта в Google Cloud Console и получения ключа для работы с Google Calendar API.

### Шаг 1: Регистрация в Google Cloud Console
1. Перейти на сайт [Google Cloud Console](https://console.cloud.google.com/).
2. Войти в Google-аккаунт (подходит любой Gmail).
3. Если проекта ещё нет, нажать на кнопку **"Create Project"** (или выбрать существующий проект в выпадающем меню вверху).

### Шаг 2: Создание нового проекта
1. Нажать **"New Project"** (вверху справа, в выпадающем меню проектов).
2. Задать имя проекту, например, `MyCalendarApp`.
3. Нажать **"Create"**. Google создаст проект, и он появится в списке.

### Шаг 3: Включение Google Calendar API
1. В левом меню выбрать **"APIs & Services"** → **"Library"**.
2. В поисковой строке ввести `Google Calendar API`.
3. Найти API в списке, нажать на карточку и выбрать **"Enable"**. Это активирует API для проекта.

### Шаг 4: Создание сервисного аккаунта
1. В левом меню перейти в **"APIs & Services"** → **"Credentials"**.
2. Нажать на кнопку **"Create Credentials"** (вверху) и выбрать **"Service account"**.
3. Заполнить поля:
    - **Service account name**: например, `calendar-service-account` (имя может быть любым).
    - **Service account ID**: автоматически сгенерируется на основе имени (например, `calendar-service-account@mycalendarapp.iam.gserviceaccount.com`).
    - **Service account description**: необязательно, можно указать, например, "Для работы с Google Calendar".
4. Нажать **"Create and Continue"**.

### Шаг 5: (Опционально) Назначение роли
На следующем экране Google предложит назначить роль сервисному аккаунту. Для работы с Google Calendar это не обязательно делать на данном этапе, так как доступ зависит от файла ключа и разрешений в календаре. Можно нажать **"Continue"** и пропустить этот шаг.

### Шаг 6: Создание ключа для сервисного аккаунта
1. На третьем шаге ("Grant users access to this service account") нажать **"Done"** — это тоже опционально.
2. Вернуться на страницу **"Credentials"**. В разделе **"Service Accounts"** найти новый аккаунт (например, `calendar-service-account`).
3. Нажать на него, чтобы открыть настройки.
4. Перейти во вкладку **"Keys"**.
5. Нажать **"Add Key"** → **"Create new key"**.
6. Выбрать формат **JSON** (стандартный выбор) и нажать **"Create"**.
7. Файл (например, `mycalendarapp-123456789.json`) автоматически скачается на компьютер.

### Шаг 7: Сохранение и использование ключа
Переместить скачанный JSON-файл в папку secrets Node.js-проекта, например, в корень проекта.

   

## Настройка приложения


### Для запуска в докер-контейнере с импортом каждый час

1. Создать файл .env и заполнить его своими значениями
```bash
cp .env.example .env
```
GOOGLE_KEY_FILE - это путь к файлу, который можно скачать из google cloud console для сервисного аккаунта. Процесс получения
файла описан выше

2. Собрать и запустить контейнер
```bash
docker build -t yandex-to-google-calendar . 
docker run -d --restart unless-stopped yandex-to-google-calendar
```


3. Если хочется запустить контейнер удаленно, можно сначала собрать его локально и затем загрузить из тарболла на сервере:
```bash
docker save -o yandex-to-google-calendar.tar  docker.io/library/yandex-to-google-calendar
docker load < yandex-to-google-calendar.tar
```

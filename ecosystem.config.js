module.exports = {
    apps: [
        {
            name: 'yandex-to-google',
            script: 'import-yandex-to-google.js',
            cron_restart: '*/30 * * * *',
            autorestart: false,
        },
    ],
};
module.exports = {
    apps: [
        {
            name: 'yandex-to-google',
            script: 'import-yandex-to-google.js',
            cron_restart: '* 1 * * *',
            autorestart: false,
        },
    ],
};
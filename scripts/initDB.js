const mongoose = require('mongoose');
const GlobalConfig = require('../models/GlobalConfig');
require('dotenv').config();

// DB Config (используем напрямую .env файл для этого скрипта)
const db = process.env.MONGODB_URI || 'mongodb+srv://root:12345@house-sales-portal.9f8zfag.mongodb.net/houses_db?retryWrites=true&w=majority';

// Инициализация базы данных
async function initDB() {
    try {
        // Подключаемся к MongoDB
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });

        console.log('MongoDB Connected');

        // Проверяем, существуют ли глобальные конфигурации
        const existingConfig = await GlobalConfig.findOne({ customId: 'default' });

        if (!existingConfig) {
            console.log('Создаем начальную глобальную конфигурацию...');

            const defaultConfig = new GlobalConfig({
                customId: 'default',
                development: {
                    database: {
                        uri: db
                    },
                    email: {
                        mailUser: 'your-email@example.com',
                        mailPassword: 'your-email-password',
                        mailService: 'gmail'
                    },
                    auth: {
                        secretOrKey: 'your-secret-key'
                    },
                    infinitScrollEnabled: false,
                    paginationEnabled: true,
                    showProductsPerPage: {
                        mobile: 4,
                        tablet: 8,
                        desktop: 12
                    },
                    minOrderValue: 0
                },
                production: {
                    database: {
                        uri: db
                    },
                    email: {
                        mailUser: 'your-email@example.com',
                        mailPassword: 'your-email-password',
                        mailService: 'gmail'
                    },
                    auth: {
                        secretOrKey: 'your-secret-key'
                    },
                    infinitScrollEnabled: false,
                    paginationEnabled: true,
                    showProductsPerPage: {
                        mobile: 4,
                        tablet: 8,
                        desktop: 12
                    },
                    minOrderValue: 0
                }
            });

            await defaultConfig.save();
            console.log('Начальная глобальная конфигурация создана');
        } else {
            console.log('Глобальная конфигурация уже существует');
        }

        console.log('База данных успешно инициализирована');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
    } finally {
        // Закрываем соединение
        mongoose.connection.close();
    }
}

// Запуск функции инициализации
initDB();
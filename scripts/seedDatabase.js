require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
const House = require('../models/House');

// Підключення до бази даних
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB підключено успішно');
        seedDatabase();
    })
    .catch(err => {
        console.error('Помилка підключення до MongoDB:', err);
        process.exit(1);
    });

async function seedDatabase() {
    try {
        // Очищення наявних даних
        await House.deleteMany({});
        console.log('Видалено існуючі дані будинків');

        // Завантаження даних з JSON файлу
        const housesData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../data/houses.json'), 'utf8')
        );

        // Додавання будинків до бази даних
        const insertedHouses = await House.insertMany(housesData);
        console.log(`Додано ${insertedHouses.length} будинків до бази даних`);

        mongoose.disconnect();
        console.log('Відключено від MongoDB');
    } catch (error) {
        console.error('Помилка при заповненні бази даних:', error);
        mongoose.disconnect();
        process.exit(1);
    }
}
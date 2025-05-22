const express = require('express');
const router = express.Router();
const House = require('../models/House');

// Получить все дома с фильтрацией
router.get('/', async (req, res) => {
  try {
    console.log('Получение домов с фильтрами:', req.query);

    // Создаем объект для фильтрации
    const filter = {};

    // Фильтрация по цене
    if (req.query.priceMin) {
      filter.price = { ...filter.price, $gte: Number(req.query.priceMin) };
    }

    if (req.query.priceMax) {
      filter.price = { ...filter.price, $lte: Number(req.query.priceMax) };
    }

    // Фильтрация по количеству комнат
    if (req.query.rooms) {
      if (req.query.rooms === '5+') {
        filter.bedrooms = { $gte: 5 };
      } else {
        filter.bedrooms = Number(req.query.rooms);
      }
    }

    // Фильтрация по этажности
    if (req.query.floors) {
      if (req.query.floors === '3+') {
        filter.floors = { $gte: 3 };
      } else {
        filter.floors = Number(req.query.floors);
      }
    }

    // Фильтрация по ремонту
    if (req.query.withRepair === 'true') {
      filter['condition.withRepair'] = true;
    }

    // Фильтрация по мебели
    if (req.query.withFurniture === 'true') {
      filter['condition.withFurniture'] = true;
    }

    console.log('Применяемые фильтры:', filter);

    const houses = await House.find(filter);
    console.log(`Найдено ${houses.length} домов`);
    res.json(houses);
  } catch (err) {
    console.error('Ошибка при получении домов:', err);
    res.status(500).json({ message: err.message });
  }
});

// Получить дом по ID
router.get('/:id', async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'Дом не найден' });
    }
    res.json(house);
  } catch (err) {
    console.error('Ошибка при получении дома по ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Добавить новый дом
router.post('/', async (req, res) => {
  const house = new House(req.body);
  try {
    const newHouse = await house.save();
    res.status(201).json(newHouse);
  } catch (err) {
    console.error('Ошибка при добавлении дома:', err);
    res.status(400).json({ message: err.message });
  }
});

// Обновить дом
router.put('/:id', async (req, res) => {
  try {
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedHouse) {
      return res.status(404).json({ message: 'Дом не найден' });
    }
    res.json(updatedHouse);
  } catch (err) {
    console.error('Ошибка при обновлении дома:', err);
    res.status(400).json({ message: err.message });
  }
});

// Удалить дом
router.delete('/:id', async (req, res) => {
  try {
    const house = await House.findByIdAndDelete(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'Дом не найден' });
    }
    res.json({ message: 'Дом успешно удален' });
  } catch (err) {
    console.error('Ошибка при удалении дома:', err);
    res.status(500).json({ message: err.message });
  }
});

// Тестовый маршрут для проверки API
router.get('/test/status', (req, res) => {
  res.status(200).json({
    message: 'API для домов работает',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

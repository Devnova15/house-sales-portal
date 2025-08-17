const express = require('express');
const router = express.Router();
const House = require('../models/House');
const path = require('path');
const fs = require('fs-extra');

// Получить все дома с фильтрацией и пагинацией
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

    // Параметры пагинации
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Получение общего количества домов для расчета пагинации
    const totalHouses = await House.countDocuments(filter);
    const totalPages = Math.ceil(totalHouses / limit);

    // Получение домов с пагинацией
    const houses = await House.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // сортировка по дате создания (новые сначала)

    console.log(`Найдено ${houses.length} домов на странице ${page} из ${totalPages}`);

    // Отправляем данные с метаинформацией о пагинации
    res.json({
      houses,
      pagination: {
        currentPage: page,
        totalPages,
        totalHouses,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
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

    // Check if there are images in the default folder that need to be moved
    if (newHouse.images && newHouse.images.length > 0) {
      const defaultFolderImages = newHouse.images.filter(imagePath => 
        imagePath.includes('/images/houses/default/'));

      if (defaultFolderImages.length > 0) {
        // Create directory for the house's images if it doesn't exist
        const houseImagesDir = path.join(__dirname, '../client/public/images/houses', newHouse._id.toString());
        await fs.ensureDir(houseImagesDir);

        // Move each image from default folder to the house's folder
        const updatedImagePaths = [];

        for (const imagePath of newHouse.images) {
          if (imagePath.includes('/images/houses/default/')) {
            // Extract the filename from the path
            const filename = path.basename(imagePath);

            // Source and destination paths
            const sourcePath = path.join(__dirname, '../client/public', imagePath);
            const destPath = path.join(houseImagesDir, filename);

            // Check if source file exists
            if (fs.existsSync(sourcePath)) {
              // Move the file
              await fs.move(sourcePath, destPath, { overwrite: true });

              // Update the image path
              const newImagePath = `/images/houses/${newHouse._id}/${filename}`;
              updatedImagePaths.push(newImagePath);
            } else {
              // If source file doesn't exist, keep the original path
              updatedImagePaths.push(imagePath);
            }
          } else {
            // If not in default folder, keep the original path
            updatedImagePaths.push(imagePath);
          }
        }

        // Update the house document with the new image paths
        newHouse.images = updatedImagePaths;
        await newHouse.save();
      }
    }

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
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: 'Дом не найден' });
    }

    // Delete the house from the database
    await House.findByIdAndDelete(req.params.id);

    // Delete the house's image folder
    const imageFolderPath = path.join(__dirname, '../client/public/images/houses', req.params.id);

    // Check if the folder exists before attempting to delete it
    if (fs.existsSync(imageFolderPath)) {
      try {
        // Remove the entire folder and its contents
        await fs.remove(imageFolderPath);
        console.log(`Удалена папка с изображениями: ${imageFolderPath}`);
      } catch (error) {
        console.error(`Ошибка при удалении папки с изображениями: ${error.message}`);
        // Continue with the response even if folder deletion fails
      }
    }

    res.json({ 
      message: 'Дом успешно удален',
      imagesDeleted: fs.existsSync(imageFolderPath) ? false : true
    });
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

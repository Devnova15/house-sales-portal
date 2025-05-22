// src/utils/imageUtils.js
export const processImagePath = (imagePath) => {
  if (!imagePath) return '/images/placeholder-house.jpg';

  // Если путь уже начинается с /, оставляем как есть
  if (imagePath.startsWith('/')) return imagePath;

  // Если указан только имя файла, добавляем полный путь
  if (!imagePath.includes('/')) return `/images/houses/house_1/${imagePath}`;

  // Если указан относительный путь с папкой, но без /, добавляем /
  if (imagePath.startsWith('images/')) return `/${imagePath}`;

  // В остальных случаях добавляем полный путь
  return `/images/houses/${imagePath}`;
};

export const processImages = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return ['/images/placeholder-house.jpg'];
  }

  return images.map(processImagePath);
};

export const formatPrice = (price) => {
  if (!price) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
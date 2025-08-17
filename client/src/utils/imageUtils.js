// src/utils/imageUtils.js
export const processImagePath = (imagePath) => {
  if (!imagePath) return '/images/placeholder-house.jpg';

  // If path already starts with /, return it as is (it's already a full path)
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // If only filename is provided (no slashes), assume it's in the default folder
  if (!imagePath.includes('/')) {
    return `/images/houses/default/${imagePath}`;
  }

  // If path starts with 'images/' but no leading slash, add the slash
  if (imagePath.startsWith('images/')) {
    return `/${imagePath}`;
  }

  // For all other cases, add the leading slash to make it a full path
  return `/${imagePath}`;
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

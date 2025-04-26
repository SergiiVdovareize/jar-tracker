export const saveToLocalStorage = (key, value, suffix = '') => {
  try {
    const serializedValue = JSON.stringify(value);
    const fullKey = suffix ? `${key}-${suffix}` : key;
    localStorage.setItem(fullKey, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const readFromLocalStorage = (key, suffix = '') => {
  try {
    const fullKey = suffix ? `${key}-${suffix}` : key;
    const serializedValue = localStorage.getItem(fullKey);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key, suffix = '') => {
  try {
    const fullKey = suffix ? `${key}-${suffix}` : key;
    localStorage.removeItem(fullKey);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
import { useState } from 'react';

type ApiKeyProvider = 'claude' | 'open-ai' | 'gemini';
type ApiKeyStorage = Partial<Record<ApiKeyProvider, string>>;

const API_KEY_STORAGE_KEY = 'api_key_storage';

function useLocalStorage() {
  const readValue = (): ApiKeyStorage => {
    if (typeof window === 'undefined') {
      return {};
    }
    try {
      const item = window.localStorage.getItem(API_KEY_STORAGE_KEY);
      return item ? (JSON.parse(item) as ApiKeyStorage) : {};
    } catch (error) {
      console.warn(`Error reading localStorage key “${API_KEY_STORAGE_KEY}”:`, error);
      return {};
    }
  };

  const [storedValue, setStoredValue] = useState<ApiKeyStorage>(readValue);

  const setValue = (value: ApiKeyStorage | ((prev: ApiKeyStorage) => ApiKeyStorage)) => {
    const newValue = value instanceof Function ? value(storedValue) : value;
    setStoredValue(newValue);
    if (Object.keys(newValue).length === 0) {
      window.localStorage.removeItem(API_KEY_STORAGE_KEY);
    } else {
      window.localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(newValue));
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
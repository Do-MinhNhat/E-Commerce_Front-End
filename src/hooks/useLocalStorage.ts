import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
            }
        } catch (error) {
            console.error(`Error reading from localStorage (key: ${key}):`, error);
        } finally {
            setIsLoaded(true);
        }
    }, [key]);

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(`Error writing to localStorage (key: ${key}):`, error);
        }
    };

    return [storedValue, setValue];
}

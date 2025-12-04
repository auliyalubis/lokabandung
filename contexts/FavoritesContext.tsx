import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of a favorited item
export interface FavoriteItem {
  id: string;
  name: string;
  type: 'location' | 'promotion'; // Differentiate between types of favorites
  imageUrl?: string;
  description?: string;
  story?: string;
}

// Define the shape of the context
interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  updateFavorite: (id: string, updatedItem: Partial<FavoriteItem>) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const FAVORITES_STORAGE_KEY = '@lokabandung_favorites';

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites from storage', error);
      }
    };
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites to storage', error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const addFavorite = async (item: FavoriteItem) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(fav => fav.id === item.id)) {
        return [...prevFavorites, item];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = async (id: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
  };

  const updateFavorite = async (id: string, updatedItem: Partial<FavoriteItem>) => {
    setFavorites(prevFavorites =>
      prevFavorites.map(fav =>
        fav.id === id ? { ...fav, ...updatedItem } : fav
      )
    );
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, updateFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

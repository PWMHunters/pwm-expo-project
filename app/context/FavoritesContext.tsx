import React, { createContext, useState, ReactNode } from 'react';

interface Dog {
  id?: string;
  url?: string;
  breeds?: { name: string }[];
}

interface FavoritesContextType {
  favoritos: Dog[];
  addFavorite: (dog: Dog) => void;
  removeFavorite: (dogId?: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favoritos: [],
  addFavorite: () => {},
  removeFavorite: () => {},
});

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<Dog[]>([]);

  const addFavorite = (dog: Dog) => {
    if (!dog.id || favoritos.find((d) => d.id === dog.id)) return;
    setFavoritos((prev) => [...prev, dog]);
  };

  const removeFavorite = (dogId?: string) => {
    if (!dogId) return;
    setFavoritos((prev) => prev.filter((d) => d.id !== dogId));
  };

  return (
    <FavoritesContext.Provider value={{ favoritos, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

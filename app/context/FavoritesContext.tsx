import React, { createContext, useState, ReactNode } from 'react';

export interface Dog {
  id: string;
  url?: string;
  image?: { 
  url: string;
  };
  name?: string;
  
  breeds?: { 
    name: string;
    temperament?: string;
    life_span?: string;
    breed_group?: string;
    bred_for?: string;
    origin?: string;
    weight?: { metric: string; imperial: string };
    height?: { metric: string; imperial: string };
  }[];

  temperament?: string;
  life_span?: string;
  weight?: { metric: string; imperial: string };
  height?: { metric: string; imperial: string };
  breed_group?: string;
  bred_for?: string;
  origin?: string;
}

interface FavoritesContextType {
  favoritos: Dog[];
  addFavorite: (dog: Dog) => void;
  removeFavorite: (dogId?: string | number) => void;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favoritos: [],
  addFavorite: () => {},
  removeFavorite: () => {},
});

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<Dog[]>([]);

  const addFavorite = (dog: Dog) => {
    if (!dog.id || favoritos.find((d) => String(d.id) === String(dog.id))) return;
    setFavoritos((prev) => [...prev, dog]);
  };

  const removeFavorite = (dogId?: string | number) => {
    if (!dogId) return;
    setFavoritos((prev) => prev.filter((d) => String(d.id) !== String(dogId)));
  };

  return (
    <FavoritesContext.Provider value={{ favoritos, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
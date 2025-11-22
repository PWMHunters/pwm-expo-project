import * as eva from '@eva-design/eva';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider } from '@ui-kitten/components';
import { Stack } from 'expo-router';
import React from 'react';
import { FavoritesProvider } from './context/FavoritesContext'; // <-- import do contexto

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          {/* Aqui está a mudança: Definimos as telas explicitamente */}
          <Stack screenOptions={{ headerShown: false }}>
            
            {/* 1. O Porteiro (Auth Check) - Carrega primeiro */}
            <Stack.Screen name="index" />

            {/* 2. Tela de Login */}
            <Stack.Screen name="login" options={{ animation: "fade" }} />

            {/* 3. O App Principal (Abas) */}
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
            
            {/* 4. Tela de Catálogo (Detalhes) se houver */}
            <Stack.Screen name="catalog/[category]" />
          </Stack>
        </FavoritesProvider>
      </QueryClientProvider>
    </ApplicationProvider>
  );
}

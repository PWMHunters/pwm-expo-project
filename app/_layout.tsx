import * as eva from '@eva-design/eva';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { FavoritesProvider } from './context/FavoritesContext';

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      {/* OBRIGATÓRIO: Registra os ícones para o UI Kitten usar (search-outline, etc) */}
      <IconRegistry icons={EvaIconsPack} />

      <ApplicationProvider {...eva} theme={eva.light}>
        <QueryClientProvider client={queryClient}>
          <FavoritesProvider>
            
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
    </>
  );
}
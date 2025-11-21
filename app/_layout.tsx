import * as eva from '@eva-design/eva';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { FavoritesProvider } from './context/FavoritesContext';

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      
      <ApplicationProvider {...eva} theme={eva.light}>
        <QueryClientProvider client={queryClient}>
          <FavoritesProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </FavoritesProvider>
        </QueryClientProvider>
      </ApplicationProvider>
    </>
  );
}
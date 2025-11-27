import * as eva from '@eva-design/eva';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider } from '@ui-kitten/components';
import { Stack } from 'expo-router';
import React from 'react';
import '../src/services/config';
import { FavoritesProvider } from './context/FavoritesContext';


const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>     
      <ApplicationProvider {...eva} theme={eva.light}>
        <QueryClientProvider client={queryClient}>
          <FavoritesProvider>
            
            <Stack screenOptions={{ headerShown: false }}>
              
              <Stack.Screen name="index" />

              <Stack.Screen name="login" options={{ animation: "fade" }} />

              <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
                            
              
            </Stack>

          </FavoritesProvider>
        </QueryClientProvider>
      </ApplicationProvider>
    </>
  );
}
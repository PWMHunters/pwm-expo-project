import * as eva from '@eva-design/eva';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider } from '@ui-kitten/components';
import { Stack } from 'expo-router';
import React from 'react';

const queryClient = new QueryClient();
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <QueryClientProvider client={queryClient}>
        <Stack>
        </Stack>
      </QueryClientProvider>
    </ApplicationProvider>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@ui-kitten/components';
import { Tabs } from 'expo-router';
import React from 'react';

const TabIcon = ({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) => (
  <Ionicons
    name={focused ? name : `${name}-outline` as keyof typeof Ionicons.glyphMap}
    size={24}
    color={color}
  />
);

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme['color-primary-500'],
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 80,
          paddingBottom: 30,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 10,
          backgroundColor: '#fff',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => <TabIcon name="search" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, focused }) => <TabIcon name="heart" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="abrigo"
        options={{
          title: 'Abrigos',
          tabBarIcon: ({ color, focused }) => <TabIcon name="paw" color={color} focused={focused} />, 
        }}
      />
      <Tabs.Screen
        name="membros"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, focused }) => <TabIcon name="information-circle" color={color} focused={focused} />, 
        }}
      />
      
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <TabIcon name="person" color={color} focused={focused} />, 
        }}
      />

      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="[id]" options={{ href: null }} />
    </Tabs>
  );
}
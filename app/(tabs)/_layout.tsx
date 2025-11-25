import React from 'react';
import { Tabs } from 'expo-router';
import { Icon, useTheme } from '@ui-kitten/components';

const TabIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => (
  <Icon
    style={{ width: 24, height: 24, tintColor: color }}
    fill={color}
    name={focused ? name : `${name}-outline`}
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
          height: 60,
          paddingBottom: 10,
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
          tabBarIcon: ({ color, focused }) => <Icon style={{ width: 24, height: 24, tintColor: color }} name='npm-outline' fill={color} />, 
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}
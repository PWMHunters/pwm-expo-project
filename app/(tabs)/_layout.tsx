import { Icon, useTheme } from '@ui-kitten/components';
import { Tabs } from 'expo-router';
import React from 'react';

interface Props {
  name: string;
  color: string;
  focused: boolean;
}

const TabIcon = ({ name, color, focused }: Props) => (
  <Icon
    name={focused ? name : `${name}-outline`}
    style={{ width: 24, height: 24, tintColor: color }}
    fill={color}
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
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <TabIcon name="person" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
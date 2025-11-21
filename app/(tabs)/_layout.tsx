import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ICON_MAP: Record<
  string,
  {
    active: React.ComponentProps<typeof Ionicons>['name'];
    inactive: React.ComponentProps<typeof Ionicons>['name'];
  }
> = {
  home: { active: 'home', inactive: 'home-outline' },
  explorar: { active: 'search', inactive: 'search-outline' },
  favoritos: { active: 'heart', inactive: 'heart-outline' },
  abrigo: { active: 'paw', inactive: 'paw-outline' },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const key = route.name;
        const map = ICON_MAP[key] ?? {
          active: 'ellipse',
          inactive: 'ellipse-outline',
        };

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,

          tabBarIcon: ({ focused }) => {
            const name = focused ? map.active : map.inactive;

            return (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={name}
                  size={focused ? 28 : 24}
                  color={focused ? '#2563EB' : '#94A3B8'}
                />
                {focused && <View style={styles.indicator} />}
              </View>
            );
          },
        };
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="explorar" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="abrigo" options={{ title: 'Abrigos' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  indicator: {
    position: 'absolute',
    bottom: -6,
    width: 6,
    height: 6,
    borderRadius: 50,
    backgroundColor: '#2563EB',
  },
});

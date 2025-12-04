import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="mahasiswa"
        options={{
          title: 'Gamifikasi',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="lokasi"
        options={{
          title: 'Lokasi',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="location.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="mappin.and.ellipse.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gmap"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <IconSymbol
            size={28}
            name="map.fill"
            color={color}
          />,
        }}
      />
    </Tabs>
  );
}
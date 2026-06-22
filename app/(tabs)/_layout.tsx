import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { TAB_ROUTES } from '@/navigation/tabRoutes';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
        tabBarStyle: {
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: 18,
          minHeight: 68,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(148, 163, 184, 0.34)',
          borderRadius: 28,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#0f172a',
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        },
      }}
    >
      <Tabs.Screen name="backup" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="settings" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="categories" options={{ href: null }} />
      <Tabs.Screen name="accounts" options={{ href: null }} />
      {TAB_ROUTES.map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={{
            title: route.title,
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>{route.icon}</Text>,
          }}
        />
      ))}
    </Tabs>
  );
}

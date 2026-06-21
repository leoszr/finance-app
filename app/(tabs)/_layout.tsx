import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { TAB_ROUTES } from './routes';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
        tabBarStyle: { minHeight: 64, paddingBottom: 8, paddingTop: 8 },
      }}
    >
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

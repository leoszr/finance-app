import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { TAB_ROUTES } from '@/navigation/tabRoutes';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="backup" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="settings" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="categories" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="accounts" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      {TAB_ROUTES.slice(0, 2).map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={{
            title: route.title,
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{route.icon}</Text>,
          }}
        />
      ))}
      <Tabs.Screen
        name="new-transaction"
        options={{
          title: 'Novo',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.addIcon, focused && styles.addIconFocused]}>
              <Text style={styles.addIconText}>+</Text>
            </View>
          ),
        }}
      />
      {TAB_ROUTES.slice(2).map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={{
            title: route.title,
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{route.icon}</Text>,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    minHeight: 72,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.16)',
    borderRadius: 30,
    backgroundColor: 'rgba(248, 250, 252, 0.96)',
    paddingBottom: 10,
    paddingTop: 10,
    ...Platform.select({
      web: { boxShadow: '0 18px 44px rgba(15, 23, 42, 0.16)' },
      default: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.16,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 14 },
        elevation: 7,
      },
    }),
  },
  tabItem: { borderRadius: 22 },
  tabLabel: { fontSize: 11, fontWeight: '800' },
  tabIcon: { fontSize: 18, lineHeight: 22 },
  addIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.55)',
    backgroundColor: '#0f766e',
    ...Platform.select({
      web: { boxShadow: '0 14px 34px rgba(15, 118, 110, 0.34)' },
      default: {
        shadowColor: '#0f766e',
        shadowOpacity: 0.3,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      },
    }),
  },
  addIconFocused: { backgroundColor: '#115e59' },
  addIconText: { marginTop: -3, color: '#f8fafc', fontSize: 34, fontWeight: '900', lineHeight: 38 },
});

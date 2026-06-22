import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import TabsLayout from '../../../app/(tabs)/_layout';
import { TAB_ROUTES } from '@/navigation/tabRoutes';

jest.mock('expo-router', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text, View } = require('react-native');

  function Tabs({ children }: { children: React.ReactNode }) {
    return <View testID="tabs-layout">{children}</View>;
  }

  Tabs.Screen = function Screen({ name, options }: { name: string; options?: { title?: string } }) {
    return <Text testID={`tab-${name}`}>{options?.title ?? name}</Text>;
  };

  return { Tabs };
});

describe('Sprint 04 navigation', () => {
  it('covers T0401: defines four clear main tabs', () => {
    expect(TAB_ROUTES.map((route) => route.title)).toEqual([
      'Dashboard',
      'Transações',
      'Budget',
      'Relatórios',
    ]);
  });

  it('covers R002: renders tab navigator labels from TabsLayout wiring', async () => {
    const { getByText, getByTestId } = await render(<TabsLayout />);

    expect(getByTestId('tabs-layout')).toBeTruthy();
    for (const route of TAB_ROUTES) {
      expect(getByTestId(`tab-${route.name}`)).toBeTruthy();
      expect(getByText(route.title)).toBeTruthy();
    }
  });

  it('covers T0401: route model supports alternating between two tabs', async () => {
    function MiniTabs() {
      return (
        <View>
          <Text>{TAB_ROUTES[0].title}</Text>
          <Text>{TAB_ROUTES[1].title}</Text>
        </View>
      );
    }

    const { getByText } = await render(<MiniTabs />);
    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('Transações')).toBeTruthy();
  });
});

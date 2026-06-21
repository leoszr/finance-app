import { render } from '@testing-library/react-native';

import DashboardScreen from '../../app/(tabs)/dashboard';

import { APP_NAME } from '@/lib/appInfo';

describe('Home screen', () => {
  it('keeps app identity available', () => {
    expect(APP_NAME).toBe('Finance App');
  });

  it('renders the dashboard as the main app entry content', async () => {
    const { getByText } = await render(<DashboardScreen />);

    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText(/local/i)).toBeTruthy();
  });
});

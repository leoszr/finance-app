import { render } from '@testing-library/react-native';

import HomeScreen from '../../app/index';

import { APP_NAME } from '@/lib/appInfo';

describe('Home screen', () => {
  it('covers T0005: shows the app name', async () => {
    const { getByText } = await render(<HomeScreen />);

    expect(getByText(APP_NAME)).toBeTruthy();
  });

  it('states that the app is local-first', async () => {
    const { getAllByText } = await render(<HomeScreen />);

    expect(getAllByText(/local-first/i).length).toBeGreaterThan(0);
  });
});

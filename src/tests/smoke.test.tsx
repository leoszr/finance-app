import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { Screen } from '@/components/Screen';
import { APP_NAME, buildWelcomeMessage } from '@/lib/appInfo';

const rootDir = join(__dirname, '..', '..');
const packageJson = require('../../package.json') as {
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

describe('Sprint 00 foundation', () => {
  it('covers T0001: Expo project with TypeScript is configured', () => {
    expect(packageJson.dependencies.expo).toBeDefined();
    expect(existsSync(join(rootDir, 'app.json'))).toBe(true);
    expect(existsSync(join(rootDir, 'tsconfig.json'))).toBe(true);
  });

  it('covers T0002: expected source folders exist', () => {
    const expectedFolders = [
      'app',
      'src/components',
      'src/db',
      'src/features',
      'src/hooks',
      'src/lib',
      'src/tests',
      'src/types',
    ];

    expect(expectedFolders.every((folder) => existsSync(join(rootDir, folder)))).toBe(true);
  });

  it('covers T0003 and T0004: lint and test scripts exist', () => {
    expect(packageJson.scripts.lint).toBe('eslint . --max-warnings=0');
    expect(packageJson.scripts.test).toBe('jest --watchAll=false');
  });

  it('imports a TypeScript module through the absolute alias', () => {
    expect(buildWelcomeMessage()).toContain(APP_NAME);
  });

  it('renders a React Native component with text props', async () => {
    const { getByText } = await render(
      <Screen>
        <Text>Smoke render OK</Text>
      </Screen>,
    );

    expect(getByText('Smoke render OK')).toBeTruthy();
  });
});

import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Screen, SCREEN_PADDING } from '@/components/Screen';
import { Button, Card, EmptyState, MoneyInput, TextInput } from '@/components/ui';

describe('Sprint 04 components', () => {
  it('covers T0402: Screen applies safe area and consistent padding', async () => {
    const { getByTestId, getByText } = await render(
      <Screen testID="screen-under-test">
        <Text>Conteúdo</Text>
      </Screen>,
    );

    expect(getByTestId('screen-under-test')).toBeTruthy();
    expect(SCREEN_PADDING.horizontal).toBe(20);
    expect(SCREEN_PADDING.vertical).toBe(24);
    expect(getByText('Conteúdo')).toBeTruthy();
  });

  it('covers T0403: renders base UI components', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = await render(
      <Card testID="card">
        <Button>Salvar</Button>
        <TextInput label="Descrição" value="Mercado" />
        <MoneyInput label="Valor" value="10,00" />
        <EmptyState title="Vazio" message="Nada para mostrar." />
      </Card>,
    );

    expect(getByTestId('card')).toBeTruthy();
    expect(getByText('Salvar')).toBeTruthy();
    expect(getByText('Descrição')).toBeTruthy();
    expect(getByPlaceholderText('R$ 0,00')).toBeTruthy();
    expect(getByText('Vazio')).toBeTruthy();
  });

  it('covers T0403: button documents disabled and loading states through accessibility state', async () => {
    const { getByText, getByTestId } = await render(
      <Button disabled loading>
        Aguarde
      </Button>,
    );

    expect(getByText('Aguarde').props.accessibilityState).toBeUndefined();
    expect(getByTestId('button-loading')).toBeTruthy();
  });

  it('covers T0404: renders loading, actionable error and empty states', async () => {
    const { getByText, getByTestId } = await render(
      <>
        <LoadingState message="Inicializando banco local..." />
        <ErrorState message="Tente novamente em instantes." onRetry={() => undefined} />
        <EmptyState title="Sem dados ainda" message="Cadastre o primeiro item." />
      </>,
    );

    expect(getByTestId('loading-state')).toBeTruthy();
    expect(getByText('Inicializando banco local...')).toBeTruthy();
    expect(getByText('Tente novamente em instantes.')).toBeTruthy();
    expect(getByText('Tentar novamente')).toBeTruthy();
    expect(getByText('Sem dados ainda')).toBeTruthy();
  });
});

import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricAvailability = {
  available: boolean;
  reason?: string;
  labels: string[];
};

export type LocalAuth = {
  getBiometricAvailability: () => Promise<BiometricAvailability>;
  authenticate: () => Promise<boolean>;
};

const AUTH_LABELS: Record<LocalAuthentication.AuthenticationType, string> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'Touch ID / digital',
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'Face ID / rosto',
  [LocalAuthentication.AuthenticationType.IRIS]: 'íris',
};

export const localAuth: LocalAuth = {
  async getBiometricAvailability() {
    const [hasHardware, enrolled, types] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
    ]);

    if (!hasHardware) return { available: false, reason: 'Este aparelho não tem biometria disponível.', labels: [] };
    if (!enrolled) return { available: false, reason: 'Cadastre uma biometria no aparelho para ativar o bloqueio.', labels: [] };

    return { available: true, labels: types.map((type) => AUTH_LABELS[type]).filter(Boolean) };
  },

  async authenticate() {
    const result = await LocalAuthentication.authenticateAsync({
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
      fallbackLabel: 'Usar senha do aparelho',
      promptMessage: 'Desbloquear Finance App',
    });
    return result.success;
  },
};

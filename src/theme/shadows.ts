import { Platform } from 'react-native';

/** Internal elevation recipes for opaque surfaces. */
export const shadows = {
  card: Platform.select({
    web: { boxShadow: '0 16px 42px rgba(0, 0, 0, 0.08)' },
    default: {
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 3,
    },
  }),
  button: Platform.select({
    web: { boxShadow: '0 8px 18px rgba(15, 118, 110, 0.2)' },
    default: {
      shadowColor: '#0f766e',
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 2,
    },
  }),
} as const;

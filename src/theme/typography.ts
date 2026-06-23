/** Stable typography tokens using platform system fonts. */
export const typography = {
  size: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  lineHeight: {
    sm: 18,
    md: 22,
    lg: 24,
    xl: 30,
  },
  weight: {
    regular: '400',
    medium: '600',
    semibold: '700',
    bold: '800',
    heavy: '900',
  },
} as const;

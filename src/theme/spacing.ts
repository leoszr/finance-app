/** Stable spacing scale. Component-specific combinations are internal. */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const layout = {
  screenPaddingHorizontal: 20,
  screenPaddingVertical: spacing.xl,
  screenBottomPadding: 132,
  maxContentWidth: 720,
} as const;

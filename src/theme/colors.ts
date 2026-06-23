/**
 * Stable semantic color tokens for the app UI.
 * Internal component tokens may change while the semantic names stay stable.
 */
export const primitiveColors = {
  white: '#ffffff',
  black: '#000000',
  canvas: '#f5f5f7',
  canvasRaised: '#fbfbfd',
  ink: '#1d1d1f',
  mutedInk: '#6e6e73',
  separator: '#d2d2d7',
  teal: '#0f766e',
  tealPressed: '#0b5f59',
  blue: '#2563eb',
  green: '#047857',
  amber: '#b45309',
  red: '#b91c1c',
} as const;

export const colors = {
  background: {
    app: primitiveColors.canvas,
    surface: primitiveColors.white,
    subtle: primitiveColors.canvasRaised,
  },
  text: {
    primary: primitiveColors.ink,
    secondary: primitiveColors.mutedInk,
    inverse: primitiveColors.white,
    danger: primitiveColors.red,
  },
  border: {
    default: 'rgba(0, 0, 0, 0.08)',
    strong: primitiveColors.separator,
    focus: primitiveColors.teal,
    danger: primitiveColors.red,
  },
  action: {
    primary: primitiveColors.teal,
    primaryPressed: primitiveColors.tealPressed,
    disabled: '#86868b',
  },
  feedback: {
    loading: primitiveColors.blue,
    success: primitiveColors.green,
    warning: primitiveColors.amber,
    danger: primitiveColors.red,
  },
  component: {
    cardBackground: primitiveColors.white,
    inputBackground: primitiveColors.white,
    emptyStateBackground: primitiveColors.canvasRaised,
  },
} as const;

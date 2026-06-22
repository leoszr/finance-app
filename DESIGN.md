# Design

## Style

Product UI mobile-first, inspirado em Apple Liquid Glass e no formato DESIGN.md do repositório VoltAgent/awesome-design-md. O efeito de vidro é funcional: navegação, botões de ação, feedback e pequenas superfícies. Conteúdo financeiro fica em superfícies legíveis e sólidas.

## Colors

- Canvas dark: `#0b1220`
- Surface: `#f8fafc`
- Surface muted: `#e2e8f0`
- Hairline: `#dbe4f0`
- Ink: `#0f172a`
- Body: `#475569`
- On dark: `#f8fafc`
- Accent: `#0f766e`
- Accent light: `#5eead4`
- Info blue: `#0066cc`
- Error: `#b91c1c`
- Warning: `#b45309`

## Typography

Use system fonts through React Native. Product text should stay familiar and native. Body minimum 15px, primary body 16px to 17px, labels 14px bold, screen titles 30px to 34px. Prefer weight 700 to 900 for hierarchy already present in the app.

## Components

### Screen

Dark canvas, safe area, scrollable content, keyboard avoiding. Width must work at 375px. Horizontal padding can tighten on small screens.

### Cards

Readable financial content uses solid light surfaces with 1px hairline and 18px to 24px radius. Avoid nested cards. Use no heavy shadows on small screens.

### Liquid controls

Use translucent/tinted treatment only for controls or feedback: pill buttons, status bars, compact action groups. Must keep contrast AA and labels readable. On React Native, prefer simple tints and hairlines over expensive blur unless platform support is explicit.

### Buttons

Primary actions use teal accent, pill-ish radius, minimum height 48px, full width on narrow layouts when needed. Pressed state can reduce opacity/scale subtly. Disabled state must still read as disabled.

### Inputs

Inputs are 48px minimum height, rounded, solid white, high-contrast placeholder and accessible label. Money inputs open numeric keyboard and format by digits into cents.

### Empty states

Empty states teach the next action. Include one concise title, one useful sentence, and optional action. Avoid vague “nothing here”.

## Responsive Behavior

- 375px width is the baseline.
- Wrap horizontal action rows and allow buttons to grow instead of clipping.
- Forms stay scrollable and keyboard-safe.
- Avoid dense multi-column layouts on phone.
- Text should wrap naturally, not shrink below readable sizes.

## Accessibility

- Text contrast WCAG AA minimum.
- Important text not below 14px.
- Interactive controls include accessible labels when visual text is not enough.
- Touch targets at least 44px, preferably 48px.

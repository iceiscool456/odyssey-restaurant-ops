export const fontFamily = {
  display: 'Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif',
  sans: 'Segoe UI, system-ui, -apple-system, sans-serif',
  mono: 'Cascadia Code, ui-monospace, Consolas, monospace',
} as const;

export const fontSize = {
  caption: 12,
  body: 14,
  bodyLg: 16,
  heading: 20,
  title: 28,
  display: 40,
} as const;

export const lineHeight = {
  tight: 1.15,
  snug: 1.3,
  body: 1.5,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const letterSpacing = {
  label: 0.6,
  table: 0.5,
  badge: 0.3,
} as const;

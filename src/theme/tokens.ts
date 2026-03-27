// JS mirror of CSS custom properties for edge cases where JS needs color values
// Source of truth is styles/tokens.css — keep these in sync

export const COLORS = {
  bg: '#0a0e14',
  bgCard: '#111820',
  bgCardHover: '#161d28',
  bgAlt: '#1a2030',
  bgChrome: '#0d1117',
  border: '#1e2a3a',
  borderActive: '#2d6a4f',
  text: '#c8d6e5',
  textMuted: '#7a8a9a',
  textBright: '#e8f0f8',
  accent: '#2d6a4f',
  accentBright: '#40916c',
  accentDim: '#1b4332',
  warning: '#e6a817',
  warningDim: '#7a5a0a',
  danger: '#c44536',
  dangerDim: '#6b2520',
  dangerLight: '#ff6b6b',
  info: '#2589bd',
  infoDim: '#14475e',
  success: '#52b788',
  purple: '#7b68ee',
  purpleDim: '#3d346e',
  cmmcOrange: '#e07a5f',
} as const

export const FONTS = {
  mono: "var(--font-mono, 'JetBrains Mono Variable', monospace)",
  sans: "var(--font-sans, 'DM Sans Variable', system-ui, sans-serif)",
} as const

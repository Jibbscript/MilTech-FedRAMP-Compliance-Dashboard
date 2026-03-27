import { COLORS, FONTS } from '@/theme/tokens'
import type { BadgeProps } from '@/types/ui'

const colorMap = {
  accent: { bg: COLORS.accentDim, text: COLORS.accentBright, border: COLORS.accent },
  warning: { bg: COLORS.warningDim, text: COLORS.warning, border: '#8a6a1a' },
  danger: { bg: COLORS.dangerDim, text: COLORS.danger, border: '#8b3530' },
  info: { bg: COLORS.infoDim, text: COLORS.info, border: '#1a5a80' },
  purple: { bg: COLORS.purpleDim, text: COLORS.purple, border: '#5a4aaa' },
  muted: { bg: COLORS.bgAlt, text: COLORS.textMuted, border: COLORS.border },
} as const

export function Badge({ children, color = 'accent', size = 'sm' }: BadgeProps) {
  const c = colorMap[color] ?? colorMap.accent
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'xs' ? '1px 6px' : '2px 10px',
      fontSize: size === 'xs' ? 10 : 11,
      fontFamily: FONTS.mono, fontWeight: 600,
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-sm)', letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  )
}

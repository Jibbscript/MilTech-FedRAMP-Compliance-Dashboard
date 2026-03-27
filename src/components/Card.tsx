import { COLORS, FONTS } from '@/theme/tokens'
import type { CardProps } from '@/types/ui'

export function Card({ children, title, subtitle, accent, style = {} }: CardProps) {
  return (
    <div style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      borderRadius: 'var(--radius-lg)', padding: 'var(--dash-card-padding)', position: 'relative',
      borderTop: accent ? `2px solid ${accent}` : undefined,
      ...style,
    }}>
      {title && (
        <div style={{ marginBottom: subtitle ? 4 : 14 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 'var(--text-base)', fontWeight: 700, color: COLORS.textBright, letterSpacing: '0.01em', textTransform: 'uppercase' }}>
            {title}
          </div>
          {subtitle && <div style={{ fontFamily: FONTS.sans, fontSize: 'var(--text-sm)', color: COLORS.textMuted, marginTop: 2 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

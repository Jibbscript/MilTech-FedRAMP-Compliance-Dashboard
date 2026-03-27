import { COLORS, FONTS } from '@/theme/tokens'
import type { MetricBoxProps } from '@/types/ui'

export function MetricBox({ label, value, sub, trend, color = COLORS.accentBright }: MetricBoxProps) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 16px' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 28, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontFamily: FONTS.mono, fontSize: 'var(--text-xs)', color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
      <div style={{ fontFamily: FONTS.sans, fontSize: 'var(--text-xs)', color: COLORS.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {trend != null && <div style={{ fontFamily: FONTS.mono, fontSize: 'var(--text-xs)', color: trend > 0 ? COLORS.success : COLORS.danger, marginTop: 2 }}>{trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%</div>}
    </div>
  )
}

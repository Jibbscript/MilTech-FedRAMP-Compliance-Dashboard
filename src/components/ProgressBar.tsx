import { COLORS, FONTS } from '@/theme/tokens'
import type { ProgressBarProps } from '@/types/ui'

export function ProgressBar({ value, max = 100, color = COLORS.accentBright, height = 6, label }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: FONTS.sans, fontSize: 'var(--text-sm)', color: COLORS.text }}>{label}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 'var(--text-sm)', color }}>{value}/{max}</span>
        </div>
      )}
      <div style={{ height, background: COLORS.bgAlt, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 'var(--radius-sm)', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

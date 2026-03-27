import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import type { FlowDiagramItem, FlowDiagramProps } from '@/types/ui'
import styles from './FlowDiagram.module.css'

export function FlowDiagram<T extends FlowDiagramItem>({ items, renderExtra, arrow = '→' }: FlowDiagramProps<T>) {
  return (
    <div className={styles.container}>
      {items.map((item, i) => (
        <div key={item.name} className={styles.nodeWrapper}>
          <div className={styles.node} style={{
            background: alpha(item.color, 0.06),
            border: `1px solid ${alpha(item.color, 0.25)}`,
          }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 'var(--text-base)', fontWeight: 700, color: item.color }}>{item.name}</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 'var(--text-xs)', color: COLORS.textMuted, marginTop: 2 }}>{item.sub}</div>
            {renderExtra?.(item, i)}
          </div>
          {i < items.length - 1 && (
            <span className={styles.arrow} style={{ fontFamily: FONTS.mono, color: COLORS.textMuted }}>{arrow}</span>
          )}
        </div>
      ))}
    </div>
  )
}

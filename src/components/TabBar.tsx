import { COLORS, FONTS } from '@/theme/tokens'
import type { TabBarProps } from '@/types/ui'
import styles from './TabBar.module.css'

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div role="tablist" aria-label="Dashboard sections" className={styles.tabBar}>
      {tabs.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          aria-controls={`panel-${t.id}`}
          onClick={() => onChange(t.id)}
          className={styles.tab}
          style={{
            fontFamily: FONTS.sans, fontSize: 12, fontWeight: active === t.id ? 700 : 500,
            background: active === t.id ? COLORS.bgCard : 'transparent',
            color: active === t.id ? COLORS.textBright : COLORS.textMuted,
            borderBottom: active === t.id ? `2px solid ${COLORS.accent}` : '2px solid transparent',
          }}
        >{t.icon} {t.label}</button>
      ))}
    </div>
  )
}

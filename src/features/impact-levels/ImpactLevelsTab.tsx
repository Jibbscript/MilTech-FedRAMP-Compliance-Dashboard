import { Card } from '@/components/Card'
import { FlowDiagram } from '@/components/FlowDiagram'
import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import { impactLevels, capArchitecture } from './data'
import styles from './ImpactLevelsTab.module.css'

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
      <span style={{
        fontFamily: FONTS.sans,
        fontSize: 'var(--text-xs)',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        minWidth: 90,
        flexShrink: 0,
      }}>{label}</span>
      <span style={{
        fontFamily: FONTS.sans,
        fontSize: 'var(--text-sm)',
        color: COLORS.text,
      }}>{value}</span>
    </div>
  )
}

export function ImpactLevelsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-gap)' }}>
      {/* Impact Level Cards */}
      <Card title="DoD Impact Levels" subtitle="Data sensitivity classifications and infrastructure requirements">
        <div className={styles.ilGrid}>
          {impactLevels.map((il) => (
            <div key={il.il} style={{
              background: alpha(il.color, 0.06),
              border: `1px solid ${alpha(il.color, 0.2)}`,
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              {/* IL header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  fontWeight: 800,
                  color: il.color,
                  lineHeight: 1,
                }}>{il.il}</span>
                <span style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-sm)',
                  color: COLORS.textBright,
                  fontWeight: 600,
                }}>{il.label}</span>
              </div>

              {/* Fields */}
              <div>
                <FieldRow label="Baseline" value={il.baseline} />
                <FieldRow label="Infra" value={il.infra} />
                <FieldRow label="Connect" value={il.connectivity} />
                <FieldRow label="Personnel" value={il.personnel} />
              </div>

              {/* MilTech FedRAMP workloads */}
              <div style={{
                background: alpha(il.color, 0.08),
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                marginTop: 'auto',
              }}>
                <div style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-xs)',
                  color: il.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontWeight: 700,
                  marginBottom: 4,
                }}>MilTech FedRAMP Workloads</div>
                <div style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-xs)',
                  color: COLORS.text,
                  lineHeight: 1.5,
                }}>{il.miltech}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cloud Access Point Architecture */}
      <Card title="Cloud Access Point (CAP) Architecture" subtitle="IL4/IL5 traffic flow from GovCloud to DoD networks">
        <FlowDiagram
          items={capArchitecture}
          renderExtra={(item) => {
            const icon = (item as { icon?: string }).icon
            return icon ? (
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                fontWeight: 700,
                color: alpha(item.color, 0.6),
                marginTop: 4,
              }}>[{icon}]</div>
            ) : null
          }}
        />
        <div style={{
          marginTop: 14,
          fontFamily: FONTS.sans,
          fontSize: 'var(--text-xs)',
          color: COLORS.textMuted,
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}>
          Note: IL4+ workloads have no direct internet access. All traffic transits DISN CAP/BCAP
          boundary protection with IPS/IDS inspection, WAF filtering, and proxy-based content analysis
          before reaching NIPRNet.
        </div>
      </Card>
    </div>
  )
}

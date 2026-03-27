import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { MetricBox } from '@/components/MetricBox'
import { ProgressBar } from '@/components/ProgressBar'
import { FlowDiagram } from '@/components/FlowDiagram'
import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import { frameworkData, poamItems, frameworkHierarchyTop, frameworkHierarchyBottom } from './data'
import styles from './OverviewTab.module.css'

const riskColor: Record<string, string> = {
  High: COLORS.danger,
  Moderate: COLORS.warning,
  Low: COLORS.info,
  Critical: COLORS.dangerLight,
}

const statusBadgeColor: Record<string, 'accent' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  'In Progress': 'accent',
  'Scheduled': 'info',
  'Planning': 'purple',
  'Complete': 'accent',
  'Delayed': 'danger',
}

export function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-gap)' }}>
      {/* Top Metrics */}
      <div className={styles.metricsGrid}>
        <Card>
          <MetricBox label="SPRS Score" value={98} sub="/ 110" color={COLORS.accentBright} />
        </Card>
        <Card>
          <MetricBox label="Controls Assessed" value="1,189" sub="NIST 800-53r5" color={COLORS.info} />
        </Card>
        <Card>
          <MetricBox label="Open POA&Ms" value={4} sub="2 High / 2 Mod" color={COLORS.warning} />
        </Card>
        <Card>
          <MetricBox label="Inherited Controls" value="63%" sub="AWS GovCloud" color={COLORS.purple} />
        </Card>
        <Card>
          <MetricBox label="Continuous Mon." value="99.2%" sub="30-day uptime" color={COLORS.success} />
        </Card>
      </div>

      {/* Two-column layout: Framework Compliance + POA&M Table */}
      <div className={styles.twoCol}>
        {/* Framework Compliance */}
        <Card title="Framework Compliance">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {frameworkData.map((fw) => (
              <ProgressBar
                key={fw.name}
                label={fw.name}
                value={fw.implemented}
                max={fw.controls}
                color={fw.color}
              />
            ))}
          </div>
        </Card>

        {/* POA&M Items */}
        <Card title="Plan of Action & Milestones (POA&M)">
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: FONTS.mono,
              fontSize: 'var(--text-xs)',
            }}>
              <thead>
                <tr>
                  {['ID', 'Control', 'Description', 'Risk', 'Due', 'Status'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      color: COLORS.textMuted,
                      fontFamily: FONTS.sans,
                      fontSize: 'var(--text-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${COLORS.border}`,
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {poamItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${alpha(COLORS.border, 0.5)}` }}>
                    <td style={{ padding: '8px 10px', color: COLORS.textBright, whiteSpace: 'nowrap' }}>{item.id}</td>
                    <td style={{ padding: '8px 10px', color: COLORS.info, whiteSpace: 'nowrap' }}>{item.control}</td>
                    <td style={{ padding: '8px 10px', color: COLORS.text }}>{item.desc}</td>
                    <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: riskColor[item.risk] ?? COLORS.textMuted, fontWeight: 600 }}>{item.risk}</span>
                    </td>
                    <td style={{ padding: '8px 10px', color: COLORS.textMuted, whiteSpace: 'nowrap' }}>{item.due}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <Badge color={statusBadgeColor[item.status] ?? 'muted'} size="xs">{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Framework Hierarchy */}
      <Card title="Framework Hierarchy" subtitle="How NIST 800-53 flows into DoD compliance frameworks">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FlowDiagram
            items={frameworkHierarchyTop}
            renderExtra={(item) => (
              item.count ? (
                <div style={{ fontFamily: FONTS.mono, fontSize: 'var(--text-xs)', color: COLORS.textMuted, marginTop: 4 }}>
                  {(item as { count?: string }).count}
                </div>
              ) : null
            )}
          />
          <FlowDiagram
            items={frameworkHierarchyBottom}
            renderExtra={(item) => (
              item.count ? (
                <div style={{ fontFamily: FONTS.mono, fontSize: 'var(--text-xs)', color: COLORS.textMuted, marginTop: 4 }}>
                  {(item as { count?: string }).count}
                </div>
              ) : null
            )}
            arrow="↓"
          />
        </div>
      </Card>
    </div>
  )
}

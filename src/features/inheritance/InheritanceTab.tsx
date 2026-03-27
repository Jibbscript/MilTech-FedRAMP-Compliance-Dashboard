import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import { inheritanceLayers, controlResponsibilityMatrix } from './data'
import styles from './InheritanceTab.module.css'

const respColors = {
  provider: COLORS.info,
  shared: COLORS.purple,
  customer: COLORS.warning,
}

export function InheritanceTab() {
  const totalInherited = inheritanceLayers.reduce((s, l) => s + l.inherited, 0)
  const totalControls = inheritanceLayers.reduce((s, l) => s + l.total, 0)
  const inheritancePct = Math.round((totalInherited / totalControls) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-gap)' }}>
      {/* Layer Cards */}
      <div className={styles.twoCol}>
        {inheritanceLayers.map((layer) => (
          <Card key={layer.provider} title={layer.provider} accent={layer.color}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge color={layer.color === COLORS.warning ? 'warning' : 'accent'} size="xs">
                  {layer.level}
                </Badge>
                <span style={{
                  fontFamily: FONTS.mono,
                  fontSize: 'var(--text-xs)',
                  color: COLORS.textMuted,
                }}>
                  {layer.authId}
                </span>
              </div>

              <ProgressBar
                label="Controls Covered"
                value={layer.inherited > 0 ? layer.inherited : layer.total}
                max={layer.total}
                color={layer.color}
              />

              <div>
                <div style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-xs)',
                  color: COLORS.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 6,
                }}>
                  Control Families
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {layer.families.map((fam) => (
                    <Badge key={fam} color="muted" size="xs">{fam}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Control Responsibility Matrix */}
      <Card title="Control Responsibility Matrix (CRM)" subtitle="Provider / Shared / Customer allocation per family">
        <div className={styles.tableScroll}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: FONTS.mono,
            fontSize: 'var(--text-xs)',
          }}>
            <thead>
              <tr>
                {['Family', 'Provider', 'Shared', 'Customer', 'Total', 'Distribution'].map((h) => (
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
              {controlResponsibilityMatrix.map((row) => {
                const provPct = (row.provider / row.total) * 100
                const sharedPct = (row.shared / row.total) * 100
                const custPct = (row.customer / row.total) * 100
                return (
                  <tr key={row.family} style={{ borderBottom: `1px solid ${alpha(COLORS.border, 0.5)}` }}>
                    <td style={{ padding: '8px 10px', color: COLORS.textBright, whiteSpace: 'nowrap' }}>
                      {row.family}
                    </td>
                    <td style={{ padding: '8px 10px', color: respColors.provider }}>{row.provider}</td>
                    <td style={{ padding: '8px 10px', color: respColors.shared }}>{row.shared}</td>
                    <td style={{ padding: '8px 10px', color: respColors.customer }}>{row.customer}</td>
                    <td style={{ padding: '8px 10px', color: COLORS.text }}>{row.total}</td>
                    <td style={{ padding: '8px 10px', minWidth: 160 }}>
                      <div style={{
                        display: 'flex',
                        height: 8,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                      }}>
                        {provPct > 0 && (
                          <div style={{ width: `${provPct}%`, background: respColors.provider }} />
                        )}
                        {sharedPct > 0 && (
                          <div style={{ width: `${sharedPct}%`, background: respColors.shared }} />
                        )}
                        {custPct > 0 && (
                          <div style={{ width: `${custPct}%`, background: respColors.customer }} />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 10,
            paddingLeft: 10,
          }}>
            {(['provider', 'shared', 'customer'] as const).map((key) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: respColors[key],
                }} />
                <span style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-xs)',
                  color: COLORS.textMuted,
                  textTransform: 'capitalize',
                }}>
                  {key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Inheritance Efficiency Callout */}
      <Card>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          padding: '12px 0',
        }}>
          <div style={{
            fontFamily: FONTS.sans,
            fontSize: 'var(--text-xs)',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Inheritance Efficiency
          </div>
          <div style={{
            fontFamily: FONTS.mono,
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.accentBright,
          }}>
            {inheritancePct}%
          </div>
          <div style={{
            fontFamily: FONTS.sans,
            fontSize: 'var(--text-sm)',
            color: COLORS.textMuted,
            textAlign: 'center',
            maxWidth: 480,
          }}>
            {totalInherited} of {totalControls} total controls are inherited from AWS GovCloud,
            leaving {totalControls - totalInherited} controls requiring system-specific implementation
            for IL5 authorization.
          </div>
        </div>
      </Card>
    </div>
  )
}

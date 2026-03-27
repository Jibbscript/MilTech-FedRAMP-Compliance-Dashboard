import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { MetricBox } from '@/components/MetricBox'
import { ProgressBar } from '@/components/ProgressBar'
import { FlowDiagram } from '@/components/FlowDiagram'
import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import { cspAssessments, gapAnalysis, boeDocuments, baselineProgression } from './data'
import styles from './EquivalencyTab.module.css'

const severityColor: Record<string, string> = {
  Critical: COLORS.dangerLight,
  High: COLORS.danger,
  Moderate: COLORS.warning,
  Low: COLORS.info,
}

const severityBadge: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  Critical: 'danger',
  High: 'danger',
  Moderate: 'warning',
  Low: 'info',
}

const statusBadge: Record<string, 'accent' | 'warning' | 'muted'> = {
  'Authorized': 'accent',
  'In Progress': 'warning',
  'Not Started': 'muted',
  'Complete': 'accent',
}

const boeComplete = boeDocuments.filter((d) => d.status === 'Complete').length
const totalGap = gapAnalysis.reduce((s, g) => s + g.gapCount, 0)

export function EquivalencyTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-gap)' }}>

      {/* === OVERVIEW SECTION === */}

      {/* CSP Assessment Cards */}
      <div className={styles.metricsGrid}>
        {cspAssessments.map((csp) => {
          const pct = Math.round((csp.controlsCovered / csp.totalRequired) * 100)
          return (
            <Card
              key={csp.cspName}
              title={csp.cspName}
              accent={csp.status === 'Authorized' ? COLORS.accentBright : COLORS.warning}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Badge color={statusBadge[csp.status] ?? 'muted'} size="xs">
                    {csp.status}
                  </Badge>
                  <Badge color="info" size="xs">{csp.level}</Badge>
                </div>

                <div style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-xs)',
                  color: COLORS.textMuted,
                  lineHeight: 1.4,
                }}>
                  {csp.authorizationType}
                </div>

                <ProgressBar
                  label="Controls Covered"
                  value={csp.controlsCovered}
                  max={csp.totalRequired}
                  color={csp.status === 'Authorized' ? COLORS.accentBright : COLORS.warning}
                />

                <div style={{
                  fontFamily: FONTS.mono,
                  fontSize: 'var(--text-xs)',
                  color: COLORS.textMuted,
                  textAlign: 'right',
                }}>
                  {pct}% coverage
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Equivalency Requirements + Reference */}
      <div className={styles.twoCol}>
        <Card title="Equivalency Requirements" subtitle="Per DoD CIO memo, Jan 2024">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {[
              { label: 'FedRAMP High (or equiv.) authorization', met: true },
              { label: '3PAO assessment against IL baselines', met: false },
              { label: 'Zero open POA&Ms at time of equivalency', met: false },
              { label: 'Complete Body of Evidence (BoE) package', met: false },
            ].map((req) => (
              <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${req.met ? COLORS.accentBright : COLORS.border}`,
                  background: req.met ? alpha(COLORS.accentBright, 0.15) : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  color: req.met ? COLORS.accentBright : COLORS.textMuted,
                }}>
                  {req.met ? '\u2713' : ''}
                </div>
                <span style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-sm)',
                  color: req.met ? COLORS.text : COLORS.textMuted,
                }}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            fontFamily: FONTS.sans,
            fontSize: 'var(--text-sm)',
            color: COLORS.warning,
            marginTop: 16,
            padding: '8px 10px',
            background: alpha(COLORS.warning, 0.06),
            border: `1px solid ${alpha(COLORS.warning, 0.2)}`,
            borderRadius: 'var(--radius-sm)',
            lineHeight: 1.5,
          }}>
            Equivalency is stricter than FedRAMP authorization -- zero open POA&Ms required.
          </div>
        </Card>

        <Card title="Policy Reference">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            <div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}>
                Governing Memo
              </div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-sm)',
                color: COLORS.textBright,
                lineHeight: 1.4,
              }}>
                DoD CIO Memo, January 2024: "FedRAMP Equivalency for Cloud Services
                Processing Controlled Unclassified Information (CUI)"
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}>
                Baseline Source
              </div>
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 'var(--text-sm)',
                color: COLORS.text,
              }}>
                DoD Cloud Computing SRG v1R3 (July 2025)
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}>
                Target Impact Level
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Badge color="danger" size="xs">IL5</Badge>
                <span style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-sm)',
                  color: COLORS.text,
                }}>
                  National Security Systems (NSS) designation
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* === GAP ANALYSIS SECTION === */}

      {/* Baseline Progression */}
      <Card title="Control Baseline Progression" subtitle="FedRAMP Moderate through IL5 -- cumulative control requirements">
        <FlowDiagram
          items={baselineProgression}
          renderExtra={(item) => (
            item.count ? (
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                marginTop: 4,
              }}>
                {(item as { count?: string }).count}
              </div>
            ) : null
          )}
        />
      </Card>

      {/* Gap Analysis Table */}
      <Card
        title="Gap Analysis by Control Family"
        subtitle={`${totalGap} additional controls required beyond FedRAMP High for IL5`}
      >
        <div className={styles.tableScroll}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: FONTS.mono,
            fontSize: 'var(--text-xs)',
          }}>
            <thead>
              <tr>
                {['Family', 'Name', 'FedRAMP High', 'IL5 Required', 'Gap', 'Severity'].map((h) => (
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
              {gapAnalysis.map((row) => (
                <tr key={row.family} style={{ borderBottom: `1px solid ${alpha(COLORS.border, 0.5)}` }}>
                  <td style={{
                    padding: '8px 10px',
                    color: COLORS.info,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {row.family}
                  </td>
                  <td style={{ padding: '8px 10px', color: COLORS.text }}>
                    {row.familyName}
                  </td>
                  <td style={{ padding: '8px 10px', color: COLORS.textMuted, textAlign: 'center' }}>
                    {row.fedRampHighCount}
                  </td>
                  <td style={{ padding: '8px 10px', color: COLORS.textBright, textAlign: 'center' }}>
                    {row.il5RequiredCount}
                  </td>
                  <td style={{
                    padding: '8px 10px',
                    color: severityColor[row.severity] ?? COLORS.textMuted,
                    fontWeight: 700,
                    textAlign: 'center',
                  }}>
                    +{row.gapCount}
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <Badge color={severityBadge[row.severity] ?? 'muted'} size="xs">
                      {row.severity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          marginTop: 14,
          padding: '10px 12px',
          background: alpha(COLORS.danger, 0.06),
          border: `1px solid ${alpha(COLORS.danger, 0.2)}`,
          borderRadius: 'var(--radius-sm)',
        }}>
          <div style={{
            fontFamily: FONTS.sans,
            fontSize: 'var(--text-sm)',
            color: COLORS.textMuted,
            lineHeight: 1.5,
          }}>
            <span style={{ color: COLORS.textBright, fontWeight: 600 }}>Heaviest gaps:</span>{' '}
            <span style={{ color: COLORS.dangerLight }}>SC (+28)</span>,{' '}
            <span style={{ color: COLORS.danger }}>SI (+18)</span>,{' '}
            <span style={{ color: COLORS.danger }}>AC (+14)</span>{' '}
            -- these three families account for{' '}
            <span style={{ fontFamily: FONTS.mono, color: COLORS.textBright }}>
              {Math.round(((28 + 18 + 14) / totalGap) * 100)}%
            </span>{' '}
            of the total gap.
          </div>
        </div>
      </Card>

      {/* === BODY OF EVIDENCE TRACKER === */}

      <Card title="Body of Evidence (BoE) Tracker" subtitle="Required documentation for equivalency package">
        <div className={styles.tableScroll}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: FONTS.mono,
            fontSize: 'var(--text-xs)',
          }}>
            <thead>
              <tr>
                {['Document', 'Abbr.', 'Status', 'Last Updated'].map((h) => (
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
              {boeDocuments.map((doc) => (
                <tr key={doc.abbreviation} style={{ borderBottom: `1px solid ${alpha(COLORS.border, 0.5)}` }}>
                  <td style={{ padding: '8px 10px', color: COLORS.textBright }}>
                    {doc.name}
                  </td>
                  <td style={{ padding: '8px 10px', color: COLORS.info, fontWeight: 600 }}>
                    {doc.abbreviation}
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <Badge color={statusBadge[doc.status] ?? 'muted'} size="xs">
                      {doc.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '8px 10px', color: COLORS.textMuted }}>
                    {doc.lastUpdated ?? '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 14 }}>
          <ProgressBar
            label="BoE Completeness"
            value={boeComplete}
            max={boeDocuments.length}
            color={boeComplete === boeDocuments.length ? COLORS.accentBright : COLORS.warning}
          />
        </div>
      </Card>

      {/* SRG v1R3 Info Callout */}
      <Card>
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '4px 0',
          alignItems: 'flex-start',
        }}>
          <div style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            lineHeight: 1,
            color: COLORS.info,
            flexShrink: 0,
            marginTop: 1,
          }}>
            i
          </div>
          <div style={{
            fontFamily: FONTS.sans,
            fontSize: 'var(--text-sm)',
            color: COLORS.textMuted,
            lineHeight: 1.6,
          }}>
            <span style={{ color: COLORS.textBright, fontWeight: 600 }}>SRG v1R3 Impact:</span>{' '}
            As of July 2025, SRG v1R3 reclassified IL5 as NSS-only, adding 170 CNSSI 1253 overlay
            controls. This significantly expanded the gap between FedRAMP High and IL5, making
            equivalency assessments substantially more complex. Organizations must now address
            cryptographic, personnel, and physical security controls previously reserved for IL6+.
          </div>
        </div>
      </Card>
    </div>
  )
}

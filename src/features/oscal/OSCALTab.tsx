import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { MetricBox } from '@/components/MetricBox'
import { ProgressBar } from '@/components/ProgressBar'
import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import { oscalData } from './data'
import styles from './OSCALTab.module.css'

const statusBadgeColor = {
  'complete': 'accent',
  'in-draft': 'warning',
  'not-started': 'muted',
} as const

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function OSCALTab() {
  const completeDocs = oscalData.documents.filter((d) => d.status === 'complete').length
  const totalErrors = oscalData.documents.reduce((s, d) => s + d.errors, 0)
  const daysLeft = daysUntil(oscalData.rfc0024Deadline)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-gap)' }}>
      {/* Top Metrics */}
      <div className={styles.metricsGrid}>
        <Card>
          <MetricBox
            label="Overall Readiness"
            value={`${oscalData.overallReadiness}%`}
            sub="OSCAL integration"
            color={oscalData.overallReadiness < 50 ? COLORS.warning : COLORS.accentBright}
          />
        </Card>
        <Card>
          <MetricBox
            label="Documents Complete"
            value={`${completeDocs}/${oscalData.documents.length}`}
            sub="OSCAL models"
            color={COLORS.info}
          />
        </Card>
        <Card>
          <MetricBox
            label="Validation Errors"
            value={totalErrors}
            sub="across all docs"
            color={totalErrors > 0 ? COLORS.danger : COLORS.accentBright}
          />
        </Card>
        <Card>
          <MetricBox
            label="Days to RFC-0024"
            value={daysLeft}
            sub="Sep 30, 2026"
            color={daysLeft < 180 ? COLORS.warning : COLORS.info}
          />
        </Card>
      </div>

      {/* Document Readiness Timeline */}
      <Card title="Document Readiness Timeline" subtitle="OSCAL model completion status for FedRAMP package">
        <div className={styles.timeline}>
          {oscalData.documents.map((doc) => (
            <div key={doc.modelType} className={styles.timelineItem}>
              {/* Status indicator dot */}
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                marginTop: 5,
                flexShrink: 0,
                background: doc.status === 'complete'
                  ? COLORS.accentBright
                  : doc.status === 'in-draft'
                    ? COLORS.warning
                    : COLORS.textMuted,
                boxShadow: doc.status === 'complete'
                  ? `0 0 8px ${alpha(COLORS.accentBright, 0.4)}`
                  : undefined,
              }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: FONTS.sans,
                    fontSize: 'var(--text-base)',
                    fontWeight: 600,
                    color: COLORS.textBright,
                  }}>
                    {doc.label}
                  </span>
                  <Badge color={statusBadgeColor[doc.status]} size="xs">
                    {doc.status}
                  </Badge>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 6,
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontFamily: FONTS.mono,
                    fontSize: 'var(--text-xs)',
                    color: COLORS.textMuted,
                  }}>
                    {doc.modelType}
                  </span>

                  {doc.version && (
                    <span style={{
                      fontFamily: FONTS.mono,
                      fontSize: 'var(--text-xs)',
                      color: COLORS.textMuted,
                    }}>
                      v{doc.version}
                    </span>
                  )}

                  {doc.lastValidated && (
                    <span style={{
                      fontFamily: FONTS.sans,
                      fontSize: 'var(--text-xs)',
                      color: COLORS.textMuted,
                    }}>
                      Validated {formatDate(doc.lastValidated)}
                    </span>
                  )}

                  {/* Format badges */}
                  {doc.format.length > 0 && (
                    <span style={{ display: 'inline-flex', gap: 4 }}>
                      {doc.format.map((f) => (
                        <Badge key={f} color="info" size="xs">{f.toUpperCase()}</Badge>
                      ))}
                    </span>
                  )}
                </div>

                {/* Error / Warning counts */}
                {(doc.errors > 0 || doc.warnings > 0) && (
                  <div style={{
                    display: 'flex',
                    gap: 12,
                    marginTop: 6,
                  }}>
                    {doc.errors > 0 && (
                      <span style={{
                        fontFamily: FONTS.mono,
                        fontSize: 'var(--text-xs)',
                        color: COLORS.danger,
                        fontWeight: 600,
                      }}>
                        {doc.errors} error{doc.errors !== 1 ? 's' : ''}
                      </span>
                    )}
                    {doc.warnings > 0 && (
                      <span style={{
                        fontFamily: FONTS.mono,
                        fontSize: 'var(--text-xs)',
                        color: COLORS.warning,
                      }}>
                        {doc.warnings} warning{doc.warnings !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Catalog & Baseline + RFC-0024 */}
      <div className={styles.twoCol}>
        {/* Catalog & Baseline Versions */}
        <Card title="Catalog & Baseline Versions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}>
                Catalog Version
              </div>
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 'var(--text-base)',
                color: COLORS.textBright,
              }}>
                {oscalData.catalogVersion}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}>
                FedRAMP Baselines
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {oscalData.fedRampBaselines.map((b) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: COLORS.accentBright,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: FONTS.mono,
                      fontSize: 'var(--text-sm)',
                      color: COLORS.text,
                    }}>
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* RFC-0024 Compliance */}
        <Card title="RFC-0024 Compliance" accent={COLORS.warning}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Deadline
              </span>
              <span style={{
                fontFamily: FONTS.mono,
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                color: COLORS.warning,
              }}>
                September 30, 2026
              </span>
            </div>

            <ProgressBar
              label="OSCAL Readiness"
              value={oscalData.overallReadiness}
              max={100}
              color={oscalData.overallReadiness < 50 ? COLORS.warning : COLORS.accentBright}
            />

            <div style={{
              fontFamily: FONTS.sans,
              fontSize: 'var(--text-sm)',
              color: COLORS.textMuted,
              lineHeight: 1.5,
            }}>
              RFC-0024 mandates that all FedRAMP authorization packages must be submitted
              in OSCAL format starting September 2026. Current readiness at{' '}
              <span style={{ color: COLORS.warning, fontWeight: 600 }}>{oscalData.overallReadiness}%</span>{' '}
              requires significant acceleration across SSP, SAP, and SAR documents.
            </div>

            <div style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}>
              <Badge color="warning" size="xs">{daysLeft} days remaining</Badge>
              <Badge color="muted" size="xs">{oscalData.documents.length - completeDocs} docs pending</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* OSCAL Adoption Callout */}
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
            <span style={{ color: COLORS.textBright, fontWeight: 600 }}>OSCAL Adoption Context:</span>{' '}
            As of 2025, FedRAMP processed 100+ Rev5 authorizations with zero OSCAL submissions.
            RFC-0024 changes this. Beginning September 2026, all new and significant-change authorization
            packages must use machine-readable OSCAL format. Organizations that invest early in OSCAL
            tooling will have a structural advantage in authorization velocity.
          </div>
        </div>
      </Card>
    </div>
  )
}

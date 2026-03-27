import React from 'react'
import type { NISTControl } from '@/types/compliance'
import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { FlowDiagram } from '@/components/FlowDiagram'
import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import { cmmcPhases } from './data'
import styles from './SPRSTab.module.css'

interface SPRSTabProps {
  controls: NISTControl[]
  score: number
  totalDeduction: number
  gapCount: number
  toggleControl: (id: string) => void
  reset: () => void
}

const familyColor: Record<string, 'accent' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  AC: 'info',
  AT: 'muted',
  AU: 'purple',
  CA: 'warning',
  CM: 'accent',
  IA: 'danger',
  IR: 'warning',
  SC: 'info',
  SI: 'accent',
  SR: 'purple',
}

function scoreColor(score: number): string {
  if (score >= 100) return COLORS.success
  if (score >= 80) return COLORS.warning
  return COLORS.danger
}

function weightColor(weight: 1 | 3 | 5): string {
  if (weight === 5) return COLORS.danger
  if (weight === 3) return COLORS.warning
  return COLORS.textMuted
}

const ControlRow = React.memo(function ControlRow({
  control,
  onToggle,
}: {
  control: NISTControl
  onToggle: (id: string) => void
}) {
  return (
    <tr
      className={styles.controlRow}
      onClick={() => onToggle(control.id)}
    >
      <td style={{
        padding: '8px 10px',
        fontFamily: FONTS.mono,
        fontSize: 'var(--text-sm)',
        color: COLORS.textBright,
        whiteSpace: 'nowrap',
      }}>
        {control.id}
      </td>
      <td style={{
        padding: '8px 10px',
        fontFamily: FONTS.sans,
        fontSize: 'var(--text-sm)',
        color: COLORS.text,
      }}>
        {control.name}
      </td>
      <td style={{ padding: '8px 10px' }}>
        <Badge color={familyColor[control.family] ?? 'muted'} size="xs">{control.family}</Badge>
      </td>
      <td style={{
        padding: '8px 10px',
        fontFamily: FONTS.mono,
        fontSize: 'var(--text-sm)',
        fontWeight: 700,
        color: weightColor(control.weight),
        textAlign: 'center',
      }}>
        {control.weight}
      </td>
      <td style={{ padding: '8px 10px' }}>
        <Badge
          color={control.implemented ? 'accent' : 'danger'}
          size="xs"
        >
          {control.implemented ? 'MET' : 'GAP'}
        </Badge>
      </td>
    </tr>
  )
})

export function SPRSTab({ controls, score, totalDeduction, gapCount, toggleControl, reset }: SPRSTabProps) {
  const color = scoreColor(score)

  return (
    <div className={styles.layout}>
      {/* Score sidebar + Controls table */}
      <div className={styles.scoreLayout}>
        {/* Left sidebar: Score display */}
        <Card accent={color}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 56,
              fontWeight: 800,
              color,
              lineHeight: 1,
            }}>
              {score}
            </div>
            <div style={{
              fontFamily: FONTS.sans,
              fontSize: 'var(--text-sm)',
              color: COLORS.textMuted,
              marginTop: 4,
            }}>
              of 110
            </div>
          </div>

          <ProgressBar value={score} max={110} color={color} />

          {/* Gap count + Deduction grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 16,
          }}>
            <div style={{
              textAlign: 'center',
              padding: '10px 8px',
              background: alpha(COLORS.bgAlt, 0.5),
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${alpha(COLORS.border, 0.6)}`,
            }}>
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 22,
                fontWeight: 800,
                color: gapCount > 0 ? COLORS.danger : COLORS.success,
                lineHeight: 1.1,
              }}>
                {gapCount}
              </div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                marginTop: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Gaps
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '10px 8px',
              background: alpha(COLORS.bgAlt, 0.5),
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${alpha(COLORS.border, 0.6)}`,
            }}>
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 22,
                fontWeight: 800,
                color: totalDeduction > 0 ? COLORS.warning : COLORS.success,
                lineHeight: 1.1,
              }}>
                -{totalDeduction}
              </div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                marginTop: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Deduction
              </div>
            </div>
          </div>

          {/* Info box */}
          <div style={{
            marginTop: 16,
            padding: '10px 12px',
            background: alpha(COLORS.infoDim, 0.4),
            border: `1px solid ${alpha(COLORS.info, 0.25)}`,
            borderRadius: 'var(--radius-sm)',
          }}>
            <div style={{
              fontFamily: FONTS.sans,
              fontSize: 'var(--text-xs)',
              color: COLORS.info,
              lineHeight: 1.5,
            }}>
              CMMC Level 2 requires SPRS score submission to PIEE/SPRS.
              Score of 110 = full implementation. Negative scores indicate
              critical gaps requiring POA&M remediation.
            </div>
          </div>

          {/* Watermark */}
          <div className={styles.watermark}>What-If Simulation</div>

          {/* Reset button */}
          <button
            onClick={reset}
            style={{
              marginTop: 12,
              width: '100%',
              padding: '8px 16px',
              fontFamily: FONTS.mono,
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: COLORS.textMuted,
              background: alpha(COLORS.bgAlt, 0.5),
              border: `1px solid ${COLORS.border}`,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.bgAlt
              e.currentTarget.style.color = COLORS.textBright
              e.currentTarget.style.borderColor = COLORS.borderActive
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = alpha(COLORS.bgAlt, 0.5)
              e.currentTarget.style.color = COLORS.textMuted
              e.currentTarget.style.borderColor = COLORS.border
            }}
          >
            Reset All Controls
          </button>
        </Card>

        {/* Main area: Control status table */}
        <Card title="Control Status" subtitle="Click a row to toggle MET / GAP and see score impact">
          <div className={styles.tableScroll}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: FONTS.sans,
            }}>
              <thead>
                <tr style={{
                  position: 'sticky',
                  top: 0,
                  background: COLORS.bgCard,
                  zIndex: 1,
                }}>
                  <th style={{
                    padding: '8px 10px',
                    fontFamily: FONTS.mono,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    Req
                  </th>
                  <th style={{
                    padding: '8px 10px',
                    fontFamily: FONTS.mono,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    Description
                  </th>
                  <th style={{
                    padding: '8px 10px',
                    fontFamily: FONTS.mono,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    Family
                  </th>
                  <th style={{
                    padding: '8px 10px',
                    fontFamily: FONTS.mono,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    Wt
                  </th>
                  <th style={{
                    padding: '8px 10px',
                    fontFamily: FONTS.mono,
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {controls.map((control) => (
                  <ControlRow
                    key={control.id}
                    control={control}
                    onToggle={toggleControl}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* CMMC 2.0 Phase-In Timeline */}
      <Card title="CMMC 2.0 Phase-In Timeline" subtitle="DoD phased rollout of Cybersecurity Maturity Model Certification">
        <FlowDiagram
          items={cmmcPhases}
          renderExtra={(item) => {
            const phase = item as typeof cmmcPhases[number]
            return phase.desc ? (
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 'var(--text-xs)',
                color: COLORS.textMuted,
                marginTop: 6,
                lineHeight: 1.4,
                maxWidth: 180,
              }}>
                {phase.desc}
              </div>
            ) : null
          }}
        />
      </Card>
    </div>
  )
}

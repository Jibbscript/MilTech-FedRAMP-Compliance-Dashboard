import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { FlowDiagram } from '@/components/FlowDiagram'
import { COLORS, FONTS } from '@/theme/tokens'
import { alpha } from '@/lib/alpha'
import { preventiveControls, detectiveControls, pipelineStages } from './data'
import styles from './GuardrailsTab.module.css'

const statusColor: Record<string, 'accent' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  Active: 'accent',
  Tuned: 'info',
  Alert: 'warning',
  Disabled: 'muted',
}

const typeColor: Record<string, 'accent' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  SCP: 'purple',
  IAM: 'info',
  IaC: 'accent',
  'Policy-as-Code': 'warning',
  K8s: 'info',
  Detection: 'danger',
  Config: 'warning',
  Audit: 'purple',
  Compliance: 'accent',
}

const severityColor: Record<string, 'accent' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  Critical: 'danger',
  High: 'warning',
  Moderate: 'info',
  Low: 'muted',
}

export function GuardrailsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-gap)' }}>
      {/* Preventive + Detective two-col */}
      <div className={styles.twoCol}>
        {/* Preventive Controls */}
        <Card title="Preventive Controls" subtitle="Policy gates that block non-compliant actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {preventiveControls.map((ctrl) => (
              <div key={ctrl.name} style={{
                padding: '10px 12px',
                background: alpha(COLORS.bgAlt, 0.5),
                border: `1px solid ${alpha(COLORS.border, 0.6)}`,
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: COLORS.textBright,
                  marginBottom: 6,
                }}>
                  {ctrl.name}
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  <Badge color={typeColor[ctrl.type] ?? 'muted'} size="xs">{ctrl.type}</Badge>
                  <Badge color={statusColor[ctrl.status] ?? 'muted'} size="xs">{ctrl.status}</Badge>
                </div>

                <div style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-xs)',
                  color: COLORS.textMuted,
                  lineHeight: 1.4,
                  marginBottom: 8,
                }}>
                  {ctrl.desc}
                </div>

                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {ctrl.controls.map((c) => (
                    <Badge key={c} color="muted" size="xs">{c}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Detective Controls */}
        <Card title="Detective Controls" subtitle="Monitors and alerts for non-compliant state">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {detectiveControls.map((ctrl) => (
              <div key={ctrl.name} style={{
                padding: '10px 12px',
                background: alpha(COLORS.bgAlt, 0.5),
                border: `1px solid ${alpha(COLORS.border, 0.6)}`,
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{
                  fontFamily: FONTS.sans,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: COLORS.textBright,
                  marginBottom: 6,
                }}>
                  {ctrl.name}
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  <Badge color={typeColor[ctrl.type] ?? 'muted'} size="xs">{ctrl.type}</Badge>
                  <Badge color={severityColor[ctrl.severity] ?? 'muted'} size="xs">{ctrl.severity}</Badge>
                </div>

                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {ctrl.controls.map((c) => (
                    <Badge key={c} color="muted" size="xs">{c}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Automated Compliance Pipeline */}
      <Card title="Automated Compliance Pipeline" subtitle="IaC deploy pipeline with compliance gates at every stage">
        <FlowDiagram items={pipelineStages} />
      </Card>
    </div>
  )
}

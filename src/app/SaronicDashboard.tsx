import { useState } from 'react'
import { COLORS, FONTS } from '@/theme/tokens'
import { Badge } from '@/components/Badge'
import { TabBar } from '@/components/TabBar'
import { useSPRSSimulator } from '@/hooks/useSPRSSimulator'
import { sprsControls } from '@/features/sprs/data'
import { OverviewTab } from '@/features/overview/OverviewTab'
import { ImpactLevelsTab } from '@/features/impact-levels/ImpactLevelsTab'
import { InheritanceTab } from '@/features/inheritance/InheritanceTab'
import { SPRSTab } from '@/features/sprs/SPRSTab'
import { GuardrailsTab } from '@/features/guardrails/GuardrailsTab'
import { OSCALTab } from '@/features/oscal/OSCALTab'
import { EquivalencyTab } from '@/features/equivalency/EquivalencyTab'
import styles from './SaronicDashboard.module.css'

const tabs = [
  { id: 'overview', label: 'Overview', icon: '◉' },
  { id: 'impact', label: 'Impact Levels', icon: '◈' },
  { id: 'inheritance', label: 'Inheritance', icon: '◇' },
  { id: 'sprs', label: 'SPRS / CMMC', icon: '◆' },
  { id: 'guardrails', label: 'Guardrails', icon: '◊' },
  { id: 'oscal', label: 'OSCAL', icon: '⬡' },
  { id: 'equivalency', label: 'Equivalency', icon: '⬢' },
] as const

export function SaronicDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // SPRS state lifted to root so it survives tab switches
  const sprs = useSPRSSimulator(sprsControls)

  return (
    <div className={styles.root}>
      {/* Demo data banner */}
      <div className={styles.demoBanner}>
        DEMONSTRATION DATA ONLY — NOT DERIVED FROM PRODUCTION SYSTEMS
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 900, color: COLORS.textBright, letterSpacing: '-0.02em' }}>
            SARONIC<span style={{ color: COLORS.accent }}>//</span>COMPLIANCE
          </div>
          <div className={styles.headerBadges}>
            <Badge color="accent">AWS GovCloud</Badge>
            <Badge color="warning">IL5 Target</Badge>
            <Badge color="purple">CMMC L2</Badge>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted }}>
            Last scan: 2026-03-26T08:42:00Z
          </span>
          <div className={styles.statusDot} />
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.nav}>
        <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </nav>

      {/* Content */}
      <main className={styles.content}>
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'impact' && <ImpactLevelsTab />}
          {activeTab === 'inheritance' && <InheritanceTab />}
          {activeTab === 'sprs' && (
            <SPRSTab
              controls={sprs.controls}
              score={sprs.score}
              totalDeduction={sprs.totalDeduction}
              gapCount={sprs.gapCount}
              toggleControl={sprs.toggleControl}
              reset={sprs.reset}
            />
          )}
          {activeTab === 'guardrails' && <GuardrailsTab />}
          {activeTab === 'oscal' && <OSCALTab />}
          {activeTab === 'equivalency' && <EquivalencyTab />}
        </div>
      </main>
    </div>
  )
}

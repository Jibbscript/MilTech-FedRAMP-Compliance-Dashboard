import type { NISTControl, FlowNode } from '@/types/compliance'
import { COLORS } from '@/theme/tokens'

// Representative subset of NIST 800-171 Rev 2 controls with SPRS weights
// Weight distribution: 5 = critical (network exploitation), 3 = important (confined impact), 1 = baseline (limited effect)
export const sprsControls: NISTControl[] = [
  // AC - Access Control
  { id: "03.01.01", name: "Account Management", weight: 5, implemented: true, family: "AC" },
  { id: "03.01.02", name: "Access Enforcement", weight: 5, implemented: true, family: "AC" },
  { id: "03.01.03", name: "Information Flow Enforcement", weight: 5, implemented: true, family: "AC" },
  { id: "03.01.05", name: "Least Privilege", weight: 5, implemented: true, family: "AC" },
  { id: "03.01.12", name: "Remote Access", weight: 5, implemented: true, family: "AC" },
  { id: "03.01.13", name: "Remote Access Routing", weight: 1, implemented: true, family: "AC" },
  { id: "03.01.16", name: "Wireless Access", weight: 3, implemented: true, family: "AC" },
  { id: "03.01.20", name: "External Connections", weight: 3, implemented: true, family: "AC" },
  // AT - Awareness & Training
  { id: "03.02.01", name: "Security Awareness Training", weight: 1, implemented: true, family: "AT" },
  { id: "03.02.02", name: "Role-Based Training", weight: 1, implemented: true, family: "AT" },
  // AU - Audit
  { id: "03.03.01", name: "System Auditing", weight: 3, implemented: true, family: "AU" },
  { id: "03.03.02", name: "Audit Record Content", weight: 3, implemented: true, family: "AU" },
  // CM - Configuration Management
  { id: "03.04.01", name: "Configuration Baselines", weight: 5, implemented: true, family: "CM" },
  { id: "03.04.02", name: "Configuration Settings", weight: 3, implemented: true, family: "CM" },
  { id: "03.04.06", name: "Least Functionality", weight: 5, implemented: true, family: "CM" },
  // IA - Identification & Authentication
  { id: "03.05.01", name: "Identification", weight: 5, implemented: true, family: "IA" },
  { id: "03.05.02", name: "Authentication", weight: 5, implemented: true, family: "IA" },
  { id: "03.05.03", name: "Multifactor Authentication", weight: 5, implemented: true, family: "IA" },
  // IR - Incident Response
  { id: "03.06.01", name: "Incident Handling", weight: 3, implemented: true, family: "IR" },
  { id: "03.06.02", name: "Incident Reporting", weight: 3, implemented: true, family: "IR" },
  // CA - Security Assessment
  { id: "03.12.01", name: "Security Assessments", weight: 3, implemented: false, family: "CA" },
  { id: "03.12.04", name: "System Security Plan", weight: 1, implemented: true, family: "CA" },
  // SC - System & Communications Protection
  { id: "03.13.01", name: "Boundary Protection", weight: 5, implemented: true, family: "SC" },
  { id: "03.13.08", name: "Transmission Confidentiality", weight: 3, implemented: true, family: "SC" },
  { id: "03.13.11", name: "CUI Encryption at Rest", weight: 5, implemented: false, family: "SC" },
  // SI - System & Information Integrity
  { id: "03.14.01", name: "Flaw Remediation", weight: 5, implemented: true, family: "SI" },
  { id: "03.14.02", name: "Malicious Code Protection", weight: 5, implemented: true, family: "SI" },
  { id: "03.14.03", name: "Security Alerts & Advisories", weight: 1, implemented: true, family: "SI" },
  { id: "03.14.06", name: "System Monitoring", weight: 5, implemented: true, family: "SI" },
  // SR - Supply Chain Risk Management
  { id: "03.17.01", name: "Supply Chain Risk Mgmt Plan", weight: 5, implemented: false, family: "SR" },
]

export const cmmcPhases: FlowNode[] = [
  { name: "Phase 1", sub: "Nov 2025", desc: "L1 self-assessment + L2 C3PAO in solicitations", active: true, color: COLORS.accentBright },
  { name: "Phase 2", sub: "Nov 2026", desc: "L2 C3PAO required for prioritized acquisitions", active: false, color: COLORS.textMuted },
  { name: "Phase 3", sub: "Nov 2027", desc: "L2 mandatory for all CUI contracts", active: false, color: COLORS.textMuted },
  { name: "Phase 4", sub: "Nov 2028", desc: "Full enforcement — L3 for critical programs", active: false, color: COLORS.textMuted },
]

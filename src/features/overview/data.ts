import type { FrameworkData, POAMItem, FlowNode } from '@/types/compliance'
import { COLORS } from '@/theme/tokens'

export const frameworkData: FrameworkData[] = [
  { name: "NIST 800-53r5", controls: 1189, implemented: 1142, color: COLORS.info },
  { name: "FedRAMP Mod", controls: 325, implemented: 318, color: COLORS.accentBright },
  { name: "FedRAMP High", controls: 421, implemented: 398, color: COLORS.warning },
  { name: "800-171r3", controls: 97, implemented: 94, color: COLORS.purple },
  { name: "CMMC L2", controls: 110, implemented: 107, color: COLORS.danger },
]

export const poamItems: POAMItem[] = [
  { id: "POA-2026-014", control: "SC-28(1)", desc: "Encryption at rest for telemetry lake", risk: "High", due: "2026-04-15", status: "In Progress" },
  { id: "POA-2026-022", control: "SI-4(5)", desc: "GuardDuty custom threat intel feed", risk: "Moderate", due: "2026-05-01", status: "Scheduled" },
  { id: "POA-2026-031", control: "AU-6(1)", desc: "Automated CloudTrail anomaly correlation", risk: "Moderate", due: "2026-04-28", status: "In Progress" },
  { id: "POA-2026-038", control: "SR-3", desc: "Supply chain SBOM integration for vessel firmware", risk: "High", due: "2026-06-10", status: "Planning" },
]

// Top row of framework hierarchy
export const frameworkHierarchyTop: FlowNode[] = [
  { name: "NIST 800-53r5", sub: "Universal Catalog", count: "1,189 controls", color: COLORS.info },
  { name: "FedRAMP High", sub: "Cloud Superset", count: "421 controls", color: COLORS.warning },
  { name: "DoD SRG IL5", sub: "FedRAMP+ / CNSSI 1253", count: "High + Overlays", color: COLORS.danger },
]

// Bottom row
export const frameworkHierarchyBottom: FlowNode[] = [
  { name: "NIST 800-171r3", sub: "CUI on Nonfederal", count: "97 requirements", color: COLORS.purple },
  { name: "CMMC 2.0 L2", sub: "Enforcement Layer", count: "110 practices", color: COLORS.cmmcOrange },
]

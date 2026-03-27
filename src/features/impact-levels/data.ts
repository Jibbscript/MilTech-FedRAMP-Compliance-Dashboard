import type { ImpactLevelSpec, FlowNode } from '@/types/compliance'
import { COLORS } from '@/theme/tokens'

export const impactLevels: ImpactLevelSpec[] = [
  {
    il: "IL2", label: "Public / Non-Critical Mission",
    baseline: "FedRAMP Moderate", infra: "Shared commercial cloud", connectivity: "Internet",
    personnel: "No restriction", color: COLORS.info,
    examples: "Public-facing websites, non-sensitive training data",
    saronic: "Public documentation, marketing assets",
  },
  {
    il: "IL4", label: "CUI / PHI / ITAR / EAR",
    baseline: "FedRAMP Mod + DoD CUI", infra: "Logical separation from non-gov", connectivity: "NIPRNet via DISN CAP",
    personnel: "U.S. Persons", color: COLORS.warning,
    examples: "Export-controlled engineering data, contractor CUI",
    saronic: "Vessel design specs (ITAR), autonomy algorithms under EAR",
  },
  {
    il: "IL5", label: "Higher CUI / Mission-Critical / NSS",
    baseline: "FedRAMP High + CNSSI 1253", infra: "Dedicated multi-tenant, phys. separated", connectivity: "NIPRNet via DISN CAP",
    personnel: "U.S. Citizens only", color: COLORS.danger,
    examples: "Weapons telemetry, mission planning, C2 systems",
    saronic: "Autonomous vessel C2 data, real-time telemetry, sensor fusion",
  },
  {
    il: "IL6", label: "SECRET / NSS",
    baseline: "FedRAMP High + Classified Overlay", infra: "Isolated, physically separate", connectivity: "SIPRNet only",
    personnel: "Cleared U.S. Citizens", color: COLORS.dangerLight,
    examples: "Classified DoD operations data",
    saronic: "Classified mission parameters, fleet coordination data",
  },
]

export const capArchitecture: FlowNode[] = [
  { name: "Saronic AWS GovCloud", sub: "IL4/IL5 Workloads", icon: "GC", color: COLORS.warning },
  { name: "DISN CAP/BCAP", sub: "IPS / IDS / WAF / Proxy", icon: "BP", color: COLORS.danger },
  { name: "NIPRNet", sub: "DoD Internal Network", icon: "DN", color: COLORS.info },
  { name: "DoD Mission Owners", sub: "Fleet Command / PEO", icon: "DO", color: COLORS.accentBright },
]

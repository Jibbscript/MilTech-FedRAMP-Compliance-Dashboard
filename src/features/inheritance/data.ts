import type { InheritanceLayer, CRMEntry } from '@/types/compliance'
import { COLORS } from '@/theme/tokens'

export const inheritanceLayers: InheritanceLayer[] = [
  {
    provider: "AWS GovCloud (IaaS)",
    authId: "FedRAMP-ATO-2024-0142",
    level: "FedRAMP High",
    families: ["PE", "PS (partial)", "SC (network/hypervisor)", "MP", "MA (hw)"],
    inherited: 187,
    total: 421,
    color: COLORS.warning,
  },
  {
    provider: "Saronic Platform (PaaS/App)",
    authId: "System-Specific",
    level: "IL5 Target",
    families: ["AC", "AT", "AU", "CM", "CP", "IA", "IR", "RA", "SA", "SI", "SR"],
    inherited: 0,
    total: 234,
    color: COLORS.accentBright,
  },
]

export const controlResponsibilityMatrix: CRMEntry[] = [
  { family: "AC – Access Control", provider: 4, shared: 8, customer: 13, total: 25 },
  { family: "AU – Audit & Accountability", provider: 6, shared: 5, customer: 5, total: 16 },
  { family: "CM – Configuration Mgmt", provider: 3, shared: 6, customer: 3, total: 12 },
  { family: "IA – Identification & Auth", provider: 5, shared: 4, customer: 3, total: 12 },
  { family: "SC – System & Comms Protection", provider: 14, shared: 7, customer: 3, total: 24 },
  { family: "PE – Physical & Environmental", provider: 18, shared: 0, customer: 0, total: 18 },
  { family: "IR – Incident Response", provider: 2, shared: 5, customer: 3, total: 10 },
  { family: "SR – Supply Chain Risk Mgmt", provider: 1, shared: 2, customer: 5, total: 8 },
]

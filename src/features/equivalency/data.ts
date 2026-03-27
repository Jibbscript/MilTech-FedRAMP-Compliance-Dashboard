import type { EquivalencyGap, EquivalencyAssessment, BOEDocument } from '@/types/compliance'
import { COLORS } from '@/theme/tokens'

export const cspAssessments: EquivalencyAssessment[] = [
  { cspName: "AWS GovCloud (IaaS)", authorizationType: "FedRAMP High P-ATO + DISA IL5 PA", level: "IL5", status: "Authorized", controlsCovered: 421, totalRequired: 421 },
  { cspName: "Saronic Platform (PaaS/App)", authorizationType: "FedRAMP Equivalency (In Progress)", level: "IL5 Target", status: "In Progress", controlsCovered: 312, totalRequired: 600 },
]

export const gapAnalysis: EquivalencyGap[] = [
  { family: "SC", familyName: "System & Comms Protection", fedRampHighCount: 24, il5RequiredCount: 52, gapCount: 28, severity: "Critical" },
  { family: "SI", familyName: "System & Info Integrity", fedRampHighCount: 16, il5RequiredCount: 34, gapCount: 18, severity: "High" },
  { family: "AC", familyName: "Access Control", fedRampHighCount: 25, il5RequiredCount: 39, gapCount: 14, severity: "High" },
  { family: "SA", familyName: "System & Services Acquisition", fedRampHighCount: 20, il5RequiredCount: 32, gapCount: 12, severity: "Moderate" },
  { family: "AU", familyName: "Audit & Accountability", fedRampHighCount: 16, il5RequiredCount: 27, gapCount: 11, severity: "Moderate" },
  { family: "IA", familyName: "Identification & Auth", fedRampHighCount: 12, il5RequiredCount: 23, gapCount: 11, severity: "High" },
  { family: "SR", familyName: "Supply Chain Risk Mgmt", fedRampHighCount: 8, il5RequiredCount: 18, gapCount: 10, severity: "Critical" },
  { family: "CM", familyName: "Configuration Management", fedRampHighCount: 12, il5RequiredCount: 20, gapCount: 8, severity: "Moderate" },
  { family: "IR", familyName: "Incident Response", fedRampHighCount: 10, il5RequiredCount: 17, gapCount: 7, severity: "Moderate" },
  { family: "PE", familyName: "Physical & Environmental", fedRampHighCount: 18, il5RequiredCount: 24, gapCount: 6, severity: "Low" },
]

export const boeDocuments: BOEDocument[] = [
  { name: "System Security Plan", abbreviation: "SSP", status: "In Progress", lastUpdated: "2026-03-20", required: true },
  { name: "Security Assessment Plan", abbreviation: "SAP", status: "Not Started", lastUpdated: null, required: true },
  { name: "Security Assessment Report", abbreviation: "SAR", status: "Not Started", lastUpdated: null, required: true },
  { name: "Plan of Action & Milestones", abbreviation: "POA&M", status: "In Progress", lastUpdated: "2026-03-15", required: true },
  { name: "Continuous Monitoring Plan", abbreviation: "ConMon", status: "Complete", lastUpdated: "2026-02-28", required: true },
  { name: "Incident Response Plan", abbreviation: "IRP", status: "Complete", lastUpdated: "2026-01-15", required: true },
]

// Control baseline progression for visualization
export const baselineProgression = [
  { name: "FedRAMP Mod", sub: "323 controls", count: "323", color: COLORS.info },
  { name: "FedRAMP High", sub: "421 controls", count: "421", color: COLORS.warning },
  { name: "IL4 (FedRAMP+)", sub: "443 controls", count: "+22", color: COLORS.danger },
  { name: "IL5 (NSS)", sub: "~600 controls", count: "+179", color: COLORS.dangerLight },
]

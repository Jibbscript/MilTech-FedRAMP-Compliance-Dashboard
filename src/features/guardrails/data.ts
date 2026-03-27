import type { GuardrailPreventive, GuardrailDetective, FlowNode } from '@/types/compliance'
import { COLORS } from '@/theme/tokens'

export const preventiveControls: GuardrailPreventive[] = [
  { name: "SCP: Deny Non-GovCloud Regions", type: "SCP", status: "Active", controls: ["AC-6", "SC-7"], desc: "Block resource creation outside us-gov-west-1/east-1" },
  { name: "SCP: Deny Public S3", type: "SCP", status: "Active", controls: ["SC-8", "AC-3"], desc: "Prevent S3 bucket public access across all accounts" },
  { name: "Permission Boundary: MaxDev", type: "IAM", status: "Active", controls: ["AC-6(1)", "AC-6(2)"], desc: "Ceiling on developer IAM — no IAM:*, KMS:*, Org:*" },
  { name: "TF Module: Encrypted EBS Default", type: "IaC", status: "Active", controls: ["SC-28(1)"], desc: "All EBS volumes force AES-256-GCM via KMS CMK" },
  { name: "Sentinel: CUI Tag Enforcement", type: "Policy-as-Code", status: "Active", controls: ["MP-4", "SC-28"], desc: "Resources touching CUI must carry DataClass=CUI tag" },
  { name: "OPA: Pod Security Standards", type: "K8s", status: "Active", controls: ["CM-7", "AC-6"], desc: "Enforce restricted PSS on all vessel-edge namespaces" },
]

export const detectiveControls: GuardrailDetective[] = [
  { name: "GuardDuty: GovCloud Threat Intel", type: "Detection", status: "Tuned", controls: ["SI-4", "RA-5"], severity: "High" },
  { name: "Config Rule: Unencrypted RDS", type: "Config", status: "Active", controls: ["SC-28(1)"], severity: "Critical" },
  { name: "CloudTrail: Root Account Usage", type: "Audit", status: "Alert", controls: ["AU-2", "AU-6"], severity: "Critical" },
  { name: "SecurityHub: CIS AWS Benchmark", type: "Compliance", status: "Active", controls: ["CM-6", "SI-2"], severity: "Moderate" },
  { name: "Custom: CrossAccount AssumeRole", type: "Detection", status: "Tuned", controls: ["AC-2(4)", "AU-12"], severity: "High" },
  { name: "SIEM: VPC Flow Anomaly", type: "Detection", status: "Active", controls: ["SI-4(4)", "SC-7"], severity: "High" },
]

export const pipelineStages: FlowNode[] = [
  { name: "Git Push", sub: "IaC commit", color: COLORS.textMuted },
  { name: "TF Plan + Sentinel", sub: "Policy-as-code gate", color: COLORS.accentBright },
  { name: "SAST + SCA", sub: "Snyk / Semgrep", color: COLORS.info },
  { name: "OSCAL Validate", sub: "SSP drift check", color: COLORS.purple },
  { name: "TF Apply", sub: "Guarded deploy", color: COLORS.warning },
  { name: "Config Rules", sub: "Post-deploy scan", color: COLORS.danger },
]

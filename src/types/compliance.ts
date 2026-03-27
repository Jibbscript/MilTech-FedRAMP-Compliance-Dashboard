export type ControlFamily =
  | 'AC' | 'AT' | 'AU' | 'CA' | 'CM' | 'CP' | 'IA'
  | 'IR' | 'MA' | 'MP' | 'PE' | 'PL' | 'PM' | 'PS'
  | 'RA' | 'SA' | 'SC' | 'SI' | 'SR'

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical'
export type POAMStatus = 'Planning' | 'Scheduled' | 'In Progress' | 'Complete' | 'Delayed'
export type ImpactLevel = 'IL2' | 'IL4' | 'IL5' | 'IL6'
export type GuardrailStatus = 'Active' | 'Tuned' | 'Alert' | 'Disabled'

export interface NISTControl {
  readonly id: string
  readonly name: string
  readonly family: ControlFamily
  readonly weight: 1 | 3 | 5
  implemented: boolean
}

export interface POAMItem {
  readonly id: string
  readonly control: string
  readonly desc: string
  readonly risk: RiskLevel
  readonly due: string
  readonly status: POAMStatus
}

export interface FrameworkData {
  readonly name: string
  readonly controls: number
  readonly implemented: number
  readonly color: string
}

export interface CRMEntry {
  readonly family: string
  readonly provider: number
  readonly shared: number
  readonly customer: number
  readonly total: number
}

export interface ImpactLevelSpec {
  readonly il: ImpactLevel
  readonly label: string
  readonly baseline: string
  readonly infra: string
  readonly connectivity: string
  readonly personnel: string
  readonly color: string
  readonly examples: string
  readonly saronic: string
}

export interface InheritanceLayer {
  readonly provider: string
  readonly authId: string
  readonly level: string
  readonly families: readonly string[]
  readonly inherited: number
  readonly total: number
  readonly color: string
}

export interface GuardrailPreventive {
  readonly name: string
  readonly type: string
  readonly status: GuardrailStatus
  readonly controls: readonly string[]
  readonly desc: string
}

export interface GuardrailDetective {
  readonly name: string
  readonly type: string
  readonly status: GuardrailStatus
  readonly controls: readonly string[]
  readonly severity: RiskLevel
}

export interface FlowNode {
  readonly name: string
  readonly sub: string
  readonly color: string
  readonly icon?: string
  readonly count?: string
  readonly desc?: string
  readonly date?: string
  readonly phase?: string
  readonly active?: boolean
}

// OSCAL types (subset consumed by dashboard)
export interface OSCALDocumentStatus {
  readonly modelType: 'catalog' | 'profile' | 'ssp' | 'sap' | 'sar' | 'poam' | 'component-definition'
  readonly label: string
  readonly status: 'complete' | 'in-draft' | 'not-started'
  readonly lastValidated: string | null
  readonly format: readonly ('json' | 'xml' | 'yaml')[]
  readonly version: string | null
  readonly errors: number
  readonly warnings: number
}

export interface OSCALIntegrationData {
  readonly documents: readonly OSCALDocumentStatus[]
  readonly catalogVersion: string
  readonly fedRampBaselines: readonly string[]
  readonly rfc0024Deadline: string
  readonly overallReadiness: number
}

// FedRAMP Equivalency types
export interface EquivalencyGap {
  readonly family: ControlFamily
  readonly familyName: string
  readonly fedRampHighCount: number
  readonly il5RequiredCount: number
  readonly gapCount: number
  readonly severity: RiskLevel
}

export interface EquivalencyAssessment {
  readonly cspName: string
  readonly authorizationType: string
  readonly level: string
  readonly status: 'Authorized' | 'In Progress' | 'Not Started'
  readonly controlsCovered: number
  readonly totalRequired: number
}

export interface BOEDocument {
  readonly name: string
  readonly abbreviation: string
  readonly status: 'Complete' | 'In Progress' | 'Not Started'
  readonly lastUpdated: string | null
  readonly required: boolean
}

export interface SPRSScore {
  readonly score: number
  readonly totalDeduction: number
  readonly gapCount: number
  readonly gaps: readonly NISTControl[]
}

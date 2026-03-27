import type { OSCALDocumentStatus, OSCALIntegrationData } from '@/types/compliance'

export const oscalData: OSCALIntegrationData = {
  catalogVersion: "NIST SP 800-53 Rev 5.2.0",
  fedRampBaselines: ["FedRAMP Moderate Rev 5", "FedRAMP High Rev 5"],
  rfc0024Deadline: "2026-09-30",
  overallReadiness: 42,
  documents: [
    { modelType: "catalog", label: "Control Catalog", status: "complete", lastValidated: "2026-03-20T14:30:00Z", format: ["json"], version: "5.2.0", errors: 0, warnings: 2 },
    { modelType: "profile", label: "FedRAMP High Profile", status: "complete", lastValidated: "2026-03-18T09:15:00Z", format: ["json"], version: "1.0.0", errors: 0, warnings: 0 },
    { modelType: "ssp", label: "System Security Plan", status: "in-draft", lastValidated: "2026-03-15T11:00:00Z", format: ["json"], version: "0.3.0", errors: 14, warnings: 31 },
    { modelType: "sap", label: "Assessment Plan", status: "not-started", lastValidated: null, format: [], version: null, errors: 0, warnings: 0 },
    { modelType: "sar", label: "Assessment Results", status: "not-started", lastValidated: null, format: [], version: null, errors: 0, warnings: 0 },
    { modelType: "poam", label: "Plan of Action & Milestones", status: "in-draft", lastValidated: "2026-03-10T16:45:00Z", format: ["json"], version: "0.1.0", errors: 3, warnings: 8 },
    { modelType: "component-definition", label: "Component Definition", status: "in-draft", lastValidated: "2026-03-22T08:00:00Z", format: ["json", "yaml"], version: "0.2.0", errors: 1, warnings: 5 },
  ],
}

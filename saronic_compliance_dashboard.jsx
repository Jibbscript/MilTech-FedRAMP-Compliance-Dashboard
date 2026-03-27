import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0e14",
  bgCard: "#111820",
  bgCardHover: "#161d28",
  border: "#1e2a3a",
  borderActive: "#2d6a4f",
  text: "#c8d6e5",
  textMuted: "#5a6a7a",
  textBright: "#e8f0f8",
  accent: "#2d6a4f",
  accentBright: "#40916c",
  accentDim: "#1b4332",
  warning: "#e6a817",
  warningDim: "#7a5a0a",
  danger: "#c44536",
  dangerDim: "#6b2520",
  info: "#2589bd",
  infoDim: "#14475e",
  success: "#52b788",
  purple: "#7b68ee",
  purpleDim: "#3d346e",
};

const mono = "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace";
const sans = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

function Badge({ children, color = "accent", size = "sm" }) {
  const colorMap = {
    accent: { bg: COLORS.accentDim, text: COLORS.accentBright, border: COLORS.accent },
    warning: { bg: COLORS.warningDim, text: COLORS.warning, border: "#8a6a1a" },
    danger: { bg: COLORS.dangerDim, text: COLORS.danger, border: "#8b3530" },
    info: { bg: COLORS.infoDim, text: COLORS.info, border: "#1a5a80" },
    purple: { bg: COLORS.purpleDim, text: COLORS.purple, border: "#5a4aaa" },
    muted: { bg: "#1a2030", text: COLORS.textMuted, border: COLORS.border },
  };
  const c = colorMap[color] || colorMap.accent;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: size === "xs" ? "1px 6px" : "2px 10px",
      fontSize: size === "xs" ? 10 : 11,
      fontFamily: mono, fontWeight: 600,
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 3, letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Card({ children, title, subtitle, accent, style = {} }) {
  return (
    <div style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      borderRadius: 6, padding: 20, position: "relative",
      borderTop: accent ? `2px solid ${accent}` : undefined,
      ...style,
    }}>
      {title && (
        <div style={{ marginBottom: subtitle ? 4 : 14 }}>
          <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: COLORS.textBright, letterSpacing: "0.01em", textTransform: "uppercase" }}>
            {title}
          </div>
          {subtitle && <div style={{ fontFamily: sans, fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function MetricBox({ label, value, sub, trend, color = COLORS.accentBright }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 16px" }}>
      <div style={{ fontFamily: mono, fontSize: 28, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontFamily: mono, fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
      <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.textMuted, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      {trend && <div style={{ fontFamily: mono, fontSize: 10, color: trend > 0 ? COLORS.success : COLORS.danger, marginTop: 2 }}>{trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%</div>}
    </div>
  );
}

function ProgressBar({ value, max = 100, color = COLORS.accentBright, height = 6, label }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontFamily: sans, fontSize: 11, color: COLORS.text }}>{label}</span>
          <span style={{ fontFamily: mono, fontSize: 11, color }}>{value}/{max}</span>
        </div>
      )}
      <div style={{ height, background: "#1a2030", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, background: "#0d1117", borderRadius: 6, padding: 3, border: `1px solid ${COLORS.border}` }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          fontFamily: sans, fontSize: 12, fontWeight: active === t.id ? 700 : 500,
          padding: "8px 16px", borderRadius: 4, border: "none", cursor: "pointer",
          background: active === t.id ? COLORS.bgCard : "transparent",
          color: active === t.id ? COLORS.textBright : COLORS.textMuted,
          transition: "all 0.2s",
          borderBottom: active === t.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
        }}>{t.icon} {t.label}</button>
      ))}
    </div>
  );
}

// ============= OVERVIEW TAB =============
function OverviewTab() {
  const frameworkData = [
    { name: "NIST 800-53r5", controls: 1189, implemented: 1142, color: COLORS.info },
    { name: "FedRAMP Mod", controls: 325, implemented: 318, color: COLORS.accentBright },
    { name: "FedRAMP High", controls: 421, implemented: 398, color: COLORS.warning },
    { name: "800-171r3", controls: 97, implemented: 94, color: COLORS.purple },
    { name: "CMMC L2", controls: 110, implemented: 107, color: COLORS.danger },
  ];

  const poamItems = [
    { id: "POA-2026-014", control: "SC-28(1)", desc: "Encryption at rest for telemetry lake", risk: "High", due: "2026-04-15", status: "In Progress" },
    { id: "POA-2026-022", control: "SI-4(5)", desc: "GuardDuty custom threat intel feed", risk: "Moderate", due: "2026-05-01", status: "Scheduled" },
    { id: "POA-2026-031", control: "AU-6(1)", desc: "Automated CloudTrail anomaly correlation", risk: "Moderate", due: "2026-04-28", status: "In Progress" },
    { id: "POA-2026-038", control: "SR-3", desc: "Supply chain SBOM integration for vessel firmware", risk: "High", due: "2026-06-10", status: "Planning" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        <Card accent={COLORS.accentBright}><MetricBox label="SPRS Score" value="98" sub="of 110" color={COLORS.accentBright} /></Card>
        <Card accent={COLORS.info}><MetricBox label="Controls Assessed" value="1,189" sub="800-53r5" color={COLORS.info} /></Card>
        <Card accent={COLORS.warning}><MetricBox label="Open POA&Ms" value="4" sub="2 high risk" color={COLORS.warning} /></Card>
        <Card accent={COLORS.purple}><MetricBox label="Inherited Controls" value="63%" sub="from AWS GovCloud" color={COLORS.purple} /></Card>
        <Card accent={COLORS.success}><MetricBox label="Continuous Mon." value="99.2%" sub="uptime / 30d" trend={0.3} color={COLORS.success} /></Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Framework compliance bars */}
        <Card title="Framework Compliance Posture" subtitle="Control implementation by baseline">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            {frameworkData.map(f => (
              <div key={f.name}>
                <ProgressBar value={f.implemented} max={f.controls} color={f.color} label={f.name} />
              </div>
            ))}
          </div>
        </Card>

        {/* POA&M tracker */}
        <Card title="Active POA&M Items" subtitle="Plan of Action & Milestones">
          <div style={{ marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: sans, fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["ID", "Control", "Risk", "Due", "Status"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: COLORS.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {poamItems.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}22` }}>
                    <td style={{ padding: "7px 8px", fontFamily: mono, fontSize: 10, color: COLORS.text }}>{p.id}</td>
                    <td style={{ padding: "7px 8px" }}><Badge color="info" size="xs">{p.control}</Badge></td>
                    <td style={{ padding: "7px 8px" }}><Badge color={p.risk === "High" ? "danger" : "warning"} size="xs">{p.risk}</Badge></td>
                    <td style={{ padding: "7px 8px", fontFamily: mono, fontSize: 10, color: COLORS.textMuted }}>{p.due}</td>
                    <td style={{ padding: "7px 8px" }}><Badge color={p.status === "In Progress" ? "accent" : "muted"} size="xs">{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Framework cascade */}
      <Card title="Framework Hierarchy & Reciprocity" subtitle="Asymmetrical mapping — compliance flows DOWN, not UP">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "20px 0", flexWrap: "wrap" }}>
          {[
            { name: "NIST 800-53r5", sub: "Universal Catalog", count: "1,189 controls", color: COLORS.info },
            { name: "FedRAMP High", sub: "Cloud Superset", count: "421 controls", color: COLORS.warning },
            { name: "DoD SRG IL5", sub: "FedRAMP+ / CNSSI 1253", count: "High + Overlays", color: COLORS.danger },
          ].map((f, i) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                background: `${f.color}15`, border: `1px solid ${f.color}40`,
                borderRadius: 8, padding: "16px 24px", textAlign: "center", minWidth: 170,
              }}>
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: f.color }}>{f.name}</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{f.sub}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: COLORS.text, marginTop: 6 }}>{f.count}</div>
              </div>
              {i < 2 && <div style={{ fontFamily: mono, fontSize: 18, color: COLORS.textMuted, padding: "0 12px" }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 8 }}>
          <div style={{ width: 1, height: 30, background: COLORS.border }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            { name: "NIST 800-171r3", sub: "CUI on Nonfederal", count: "97 requirements", color: COLORS.purple },
            { name: "CMMC 2.0 L2", sub: "Enforcement Layer", count: "110 practices", color: "#e07a5f" },
          ].map((f, i) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                background: `${f.color}15`, border: `1px solid ${f.color}40`,
                borderRadius: 8, padding: "16px 24px", textAlign: "center", minWidth: 170,
              }}>
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: f.color }}>{f.name}</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{f.sub}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: COLORS.text, marginTop: 6 }}>{f.count}</div>
              </div>
              {i < 1 && <div style={{ fontFamily: mono, fontSize: 18, color: COLORS.textMuted, padding: "0 12px" }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: COLORS.textMuted, background: "#1a2030", padding: "4px 12px", borderRadius: 3 }}>
            ⚠ FedRAMP Mod ⊃ 800-53 Mod ⊃ 800-171r3 — compliance is NOT bidirectional
          </span>
        </div>
      </Card>
    </div>
  );
}

// ============= IMPACT LEVELS TAB =============
function ImpactLevelsTab() {
  const levels = [
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
      personnel: "Cleared U.S. Citizens", color: "#ff6b6b",
      examples: "Classified DoD operations data",
      saronic: "Classified mission parameters, fleet coordination data",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card title="DoD Cloud Computing SRG — Impact Levels" subtitle="Saronic workload classification for autonomous maritime platforms">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14 }}>
          {levels.map(l => (
            <div key={l.il} style={{
              background: `${l.color}08`, border: `1px solid ${l.color}30`,
              borderRadius: 6, padding: 16, borderTop: `3px solid ${l.color}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 800, color: l.color }}>{l.il}</span>
              </div>
              <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: COLORS.textBright, marginBottom: 12 }}>{l.label}</div>
              {[
                ["Baseline", l.baseline],
                ["Infrastructure", l.infra],
                ["Connectivity", l.connectivity],
                ["Personnel", l.personnel],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: sans, fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                  <div style={{ fontFamily: sans, fontSize: 11, color: COLORS.text, marginTop: 1 }}>{v}</div>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 10, paddingTop: 10 }}>
                <div style={{ fontFamily: sans, fontSize: 9, color: l.color, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Saronic Workloads</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.text, marginTop: 4, lineHeight: 1.4 }}>{l.saronic}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Cloud Access Point Architecture" subtitle="DISN boundary defense for IL4+ workloads">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "24px 0", flexWrap: "wrap" }}>
          {[
            { name: "Saronic AWS GovCloud", sub: "IL4/IL5 Workloads", icon: "☁", color: COLORS.warning },
            { name: "DISN CAP/BCAP", sub: "IPS • IDS • WAF • Proxy", icon: "🛡", color: COLORS.danger },
            { name: "NIPRNet", sub: "DoD Internal Network", icon: "🏛", color: COLORS.info },
            { name: "DoD Mission Owners", sub: "Fleet Command / PEO", icon: "⚓", color: COLORS.accentBright },
          ].map((n, i) => (
            <div key={n.name} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                background: `${n.color}10`, border: `1px solid ${n.color}35`,
                borderRadius: 8, padding: "14px 20px", textAlign: "center", minWidth: 150,
              }}>
                <div style={{ fontSize: 20 }}>{n.icon}</div>
                <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: n.color, marginTop: 4 }}>{n.name}</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{n.sub}</div>
              </div>
              {i < 3 && <div style={{ fontFamily: mono, fontSize: 14, color: COLORS.textMuted, padding: "0 8px" }}>⟶</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: COLORS.danger, background: `${COLORS.danger}15`, padding: "4px 12px", borderRadius: 3 }}>
            No direct internet access for IL4+ — all traffic routes through DISN boundary protection
          </span>
        </div>
      </Card>
    </div>
  );
}

// ============= INHERITANCE TAB =============
function InheritanceTab() {
  const layers = [
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
  ];

  const crm = [
    { family: "AC – Access Control", provider: 4, shared: 8, customer: 13, total: 25 },
    { family: "AU – Audit & Accountability", provider: 6, shared: 5, customer: 5, total: 16 },
    { family: "CM – Configuration Mgmt", provider: 3, shared: 6, customer: 3, total: 12 },
    { family: "IA – Identification & Auth", provider: 5, shared: 4, customer: 3, total: 12 },
    { family: "SC – System & Comms Protection", provider: 14, shared: 7, customer: 3, total: 24 },
    { family: "PE – Physical & Environmental", provider: 18, shared: 0, customer: 0, total: 18 },
    { family: "IR – Incident Response", provider: 2, shared: 5, customer: 3, total: 10 },
    { family: "SR – Supply Chain Risk Mgmt", provider: 1, shared: 2, customer: 5, total: 8 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {layers.map(l => (
          <Card key={l.provider} title={l.provider} subtitle={`${l.authId} • ${l.level}`} accent={l.color}>
            <div style={{ marginTop: 10 }}>
              <ProgressBar
                value={l.provider.includes("AWS") ? l.inherited : l.total}
                max={421}
                color={l.color}
                label={l.provider.includes("AWS") ? `${l.inherited} controls inherited by Saronic` : `${l.total} system-specific controls owned`}
              />
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
                {l.families.map(f => <Badge key={f} color={l.provider.includes("AWS") ? "warning" : "accent"} size="xs">{f}</Badge>)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Control Responsibility Matrix (CRM)" subtitle="FedRAMP Shared Responsibility Model — per control family">
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, fontFamily: sans, fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <th style={{ padding: "8px", textAlign: "left", color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Control Family</th>
              <th style={{ padding: "8px", textAlign: "center", color: COLORS.warning, fontSize: 10, textTransform: "uppercase" }}>CSP Owned</th>
              <th style={{ padding: "8px", textAlign: "center", color: COLORS.purple, fontSize: 10, textTransform: "uppercase" }}>Shared</th>
              <th style={{ padding: "8px", textAlign: "center", color: COLORS.accentBright, fontSize: 10, textTransform: "uppercase" }}>Saronic Owned</th>
              <th style={{ padding: "8px", textAlign: "right", color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {crm.map(r => (
              <tr key={r.family} style={{ borderBottom: `1px solid ${COLORS.border}22` }}>
                <td style={{ padding: "8px", fontWeight: 500, color: COLORS.text }}>{r.family}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ height: 8, width: `${(r.provider / r.total) * 80}px`, background: COLORS.warning, borderRadius: 2 }} />
                    <span style={{ fontFamily: mono, fontSize: 10, color: COLORS.warning }}>{r.provider}</span>
                  </div>
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ height: 8, width: `${(r.shared / r.total) * 80}px`, background: COLORS.purple, borderRadius: 2 }} />
                    <span style={{ fontFamily: mono, fontSize: 10, color: COLORS.purple }}>{r.shared}</span>
                  </div>
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ height: 8, width: `${(r.customer / r.total) * 80}px`, background: COLORS.accentBright, borderRadius: 2 }} />
                    <span style={{ fontFamily: mono, fontSize: 10, color: COLORS.accentBright }}>{r.customer}</span>
                  </div>
                </td>
                <td style={{ padding: "8px", textAlign: "right", fontFamily: mono, fontSize: 10, color: COLORS.textMuted }}>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 14, padding: "10px 14px", background: `${COLORS.accent}10`, borderRadius: 4, border: `1px solid ${COLORS.accent}30` }}>
          <div style={{ fontFamily: sans, fontSize: 11, color: COLORS.accentBright, fontWeight: 600 }}>Inheritance Efficiency</div>
          <div style={{ fontFamily: sans, fontSize: 11, color: COLORS.text, marginTop: 4 }}>
            AWS GovCloud authorization absorbs <strong style={{ color: COLORS.warning }}>44%</strong> of FedRAMP High controls.
            Saronic's assessment surface reduces to <strong style={{ color: COLORS.accentBright }}>234 system-specific + hybrid controls</strong> — saving ~3 months of 3PAO audit time.
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============= SPRS TAB =============
function SPRSTab() {
  const [simScore, setSimScore] = useState(98);
  const controls = [
    { id: "03.01.01", name: "Account Management", weight: 5, implemented: true, family: "AC" },
    { id: "03.01.03", name: "Information Flow Enforcement", weight: 5, implemented: true, family: "AC" },
    { id: "03.01.12", name: "Remote Access", weight: 5, implemented: true, family: "AC" },
    { id: "03.05.03", name: "Multifactor Authentication", weight: 5, implemented: true, family: "IA" },
    { id: "03.13.08", name: "Transmission Confidentiality", weight: 3, implemented: true, family: "SC" },
    { id: "03.13.11", name: "CUI Encryption at Rest", weight: 5, implemented: false, family: "SC" },
    { id: "03.14.01", name: "Flaw Remediation", weight: 3, implemented: true, family: "SI" },
    { id: "03.14.03", name: "Security Alerts & Advisories", weight: 1, implemented: true, family: "SI" },
    { id: "03.17.01", name: "Supply Chain Risk Mgmt Plan", weight: 5, implemented: false, family: "SR" },
    { id: "03.04.02", name: "Baseline Configurations", weight: 3, implemented: true, family: "CM" },
    { id: "03.06.01", name: "Incident Handling", weight: 3, implemented: true, family: "IR" },
    { id: "03.12.01", name: "Security Assessments", weight: 3, implemented: false, family: "CA" },
  ];

  const toggleControl = (id) => {
    const c = controls.find(x => x.id === id);
    if (c) {
      c.implemented = !c.implemented;
      const deductions = controls.filter(x => !x.implemented).reduce((sum, x) => sum + x.weight, 0);
      setSimScore(110 - deductions);
    }
  };

  const deductions = controls.filter(x => !x.implemented);
  const totalDeduction = deductions.reduce((s, c) => s + c.weight, 0);
  const score = 110 - totalDeduction;

  const scoreColor = score >= 100 ? COLORS.success : score >= 80 ? COLORS.warning : COLORS.danger;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
        <Card title="SPRS Score" subtitle="Supplier Performance Risk System" accent={scoreColor}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontFamily: mono, fontSize: 56, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{score}</div>
            <div style={{ fontFamily: mono, fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>of 110</div>
            <div style={{ marginTop: 16 }}>
              <ProgressBar value={score} max={110} color={scoreColor} height={10} />
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, textAlign: "center" }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 800, color: COLORS.danger }}>{deductions.length}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase" }}>Gaps</div>
              </div>
              <div>
                <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 800, color: COLORS.danger }}>-{totalDeduction}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase" }}>Deduction</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "10px 12px", background: `${COLORS.info}10`, borderRadius: 4, border: `1px solid ${COLORS.info}30`, marginTop: 8 }}>
            <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.info }}>
              CMMC L2 requires triennial C3PAO assessment. SPRS submission mandatory for all DoD contract bids as of Nov 2025.
            </div>
          </div>
        </Card>

        <Card title="800-171r3 Requirement Status" subtitle="97 security requirements • 17 control families • 49 ODPs">
          <div style={{ maxHeight: 420, overflowY: "auto", marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: sans, fontSize: 11 }}>
              <thead style={{ position: "sticky", top: 0, background: COLORS.bgCard }}>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["Req", "Description", "Family", "Wt", "Status"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {controls.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.border}15` }}>
                    <td style={{ padding: "6px 8px", fontFamily: mono, fontSize: 10, color: COLORS.text }}>{c.id}</td>
                    <td style={{ padding: "6px 8px", color: COLORS.text, fontSize: 11 }}>{c.name}</td>
                    <td style={{ padding: "6px 8px" }}><Badge color="muted" size="xs">{c.family}</Badge></td>
                    <td style={{ padding: "6px 8px", fontFamily: mono, fontSize: 10, color: c.weight === 5 ? COLORS.danger : c.weight === 3 ? COLORS.warning : COLORS.textMuted, fontWeight: 700 }}>-{c.weight}</td>
                    <td style={{ padding: "6px 8px" }}>
                      <Badge color={c.implemented ? "accent" : "danger"} size="xs">
                        {c.implemented ? "✓ MET" : "✗ GAP"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card title="CMMC 2.0 Phase-In Timeline" subtitle="Defense contract compliance enforcement schedule">
        <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "16px 0", overflowX: "auto" }}>
          {[
            { phase: "Phase 1", date: "Nov 2025", desc: "L1 self-assessment + L2 C3PAO in solicitations", active: true },
            { phase: "Phase 2", date: "Nov 2026", desc: "L2 C3PAO required for prioritized acquisitions", active: false },
            { phase: "Phase 3", date: "Nov 2027", desc: "L2 mandatory for all CUI contracts", active: false },
            { phase: "Phase 4", date: "Nov 2028", desc: "Full enforcement — L3 for critical programs", active: false },
          ].map((p, i) => (
            <div key={p.phase} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "12px 18px", borderRadius: 6, minWidth: 180, textAlign: "center",
                background: p.active ? `${COLORS.accentBright}15` : `${COLORS.border}30`,
                border: `1px solid ${p.active ? COLORS.accentBright : COLORS.border}`,
              }}>
                <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: p.active ? COLORS.accentBright : COLORS.textMuted }}>{p.phase}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: p.active ? COLORS.accentBright : COLORS.textMuted, marginTop: 2 }}>{p.date}</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.text, marginTop: 6, lineHeight: 1.3 }}>{p.desc}</div>
              </div>
              {i < 3 && <div style={{ fontFamily: mono, color: COLORS.textMuted, padding: "0 6px", fontSize: 12 }}>→</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============= GUARDRAILS TAB =============
function GuardrailsTab() {
  const preventive = [
    { name: "SCP: Deny Non-GovCloud Regions", type: "SCP", status: "Active", controls: ["AC-6", "SC-7"], desc: "Block resource creation outside us-gov-west-1/east-1" },
    { name: "SCP: Deny Public S3", type: "SCP", status: "Active", controls: ["SC-8", "AC-3"], desc: "Prevent S3 bucket public access across all accounts" },
    { name: "Permission Boundary: MaxDev", type: "IAM", status: "Active", controls: ["AC-6(1)", "AC-6(2)"], desc: "Ceiling on developer IAM — no IAM:*, KMS:*, Org:*" },
    { name: "TF Module: Encrypted EBS Default", type: "IaC", status: "Active", controls: ["SC-28(1)"], desc: "All EBS volumes force AES-256-GCM via KMS CMK" },
    { name: "Sentinel: CUI Tag Enforcement", type: "Policy-as-Code", status: "Active", controls: ["MP-4", "SC-28"], desc: "Resources touching CUI must carry DataClass=CUI tag" },
    { name: "OPA: Pod Security Standards", type: "K8s", status: "Active", controls: ["CM-7", "AC-6"], desc: "Enforce restricted PSS on all vessel-edge namespaces" },
  ];

  const detective = [
    { name: "GuardDuty: GovCloud Threat Intel", type: "Detection", status: "Tuned", controls: ["SI-4", "RA-5"], severity: "High" },
    { name: "Config Rule: Unencrypted RDS", type: "Config", status: "Active", controls: ["SC-28(1)"], severity: "Critical" },
    { name: "CloudTrail: Root Account Usage", type: "Audit", status: "Alert", controls: ["AU-2", "AU-6"], severity: "Critical" },
    { name: "SecurityHub: CIS AWS Benchmark", type: "Compliance", status: "Active", controls: ["CM-6", "SI-2"], severity: "Medium" },
    { name: "Custom: CrossAccount AssumeRole", type: "Detection", status: "Tuned", controls: ["AC-2(4)", "AU-12"], severity: "High" },
    { name: "SIEM: VPC Flow Anomaly", type: "Detection", status: "Active", controls: ["SI-4(4)", "SC-7"], severity: "High" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Preventive Controls" subtitle="Guardrails that block non-compliant actions before they happen" accent={COLORS.accentBright}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {preventive.map(c => (
              <div key={c.name} style={{ padding: "10px 12px", background: `${COLORS.accent}08`, border: `1px solid ${COLORS.border}`, borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: COLORS.textBright }}>{c.name}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Badge color="accent" size="xs">{c.type}</Badge>
                    <Badge color="accent" size="xs">{c.status}</Badge>
                  </div>
                </div>
                <div style={{ fontFamily: sans, fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>{c.desc}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {c.controls.map(ctrl => <Badge key={ctrl} color="info" size="xs">{ctrl}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Detective Controls" subtitle="Monitoring and alerting for drift, threats, and misconfigurations" accent={COLORS.warning}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {detective.map(c => (
              <div key={c.name} style={{ padding: "10px 12px", background: `${COLORS.warning}05`, border: `1px solid ${COLORS.border}`, borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: COLORS.textBright }}>{c.name}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Badge color="warning" size="xs">{c.type}</Badge>
                    <Badge color={c.severity === "Critical" ? "danger" : c.severity === "High" ? "warning" : "muted"} size="xs">{c.severity}</Badge>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {c.controls.map(ctrl => <Badge key={ctrl} color="info" size="xs">{ctrl}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Automated Compliance Pipeline" subtitle="Security-as-code integration points in CI/CD">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "20px 0", flexWrap: "wrap" }}>
          {[
            { name: "Git Push", sub: "IaC commit", color: COLORS.textMuted },
            { name: "TF Plan + Sentinel", sub: "Policy-as-code gate", color: COLORS.accentBright },
            { name: "SAST + SCA", sub: "Snyk / Semgrep", color: COLORS.info },
            { name: "OSCAL Validate", sub: "SSP drift check", color: COLORS.purple },
            { name: "TF Apply", sub: "Guarded deploy", color: COLORS.warning },
            { name: "Config Rules", sub: "Post-deploy scan", color: COLORS.danger },
          ].map((s, i) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "10px 14px", borderRadius: 6, textAlign: "center", minWidth: 110,
                background: `${s.color}10`, border: `1px solid ${s.color}30`,
              }}>
                <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: s.color }}>{s.name}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: COLORS.textMuted, marginTop: 2 }}>{s.sub}</div>
              </div>
              {i < 5 && <div style={{ fontFamily: mono, fontSize: 12, color: COLORS.textMuted, padding: "0 4px" }}>→</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============= MAIN APP =============
export default function SaronicDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "impact", label: "Impact Levels", icon: "◈" },
    { id: "inheritance", label: "Control Inheritance", icon: "◇" },
    { id: "sprs", label: "SPRS / CMMC", icon: "◆" },
    { id: "guardrails", label: "Guardrails", icon: "◊" },
  ];

  const tabContent = {
    overview: <OverviewTab />,
    impact: <ImpactLevelsTab />,
    inheritance: <InheritanceTab />,
    sprs: <SPRSTab />,
    guardrails: <GuardrailsTab />,
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: sans, padding: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#0d1117",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 900, color: COLORS.textBright, letterSpacing: "-0.02em" }}>
            SARONIC<span style={{ color: COLORS.accent }}>//</span>COMPLIANCE
          </div>
          <Badge color="accent">AWS GovCloud</Badge>
          <Badge color="warning">IL5 Target</Badge>
          <Badge color="purple">CMMC L2</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: COLORS.textMuted }}>
            Last scan: 2026-03-26T08:42:00Z
          </span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.success, boxShadow: `0 0 6px ${COLORS.success}` }} />
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "12px 24px 0" }}>
        <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Content */}
      <div style={{ padding: "16px 24px 40px" }}>
        {tabContent[activeTab]}
      </div>
    </div>
  );
}

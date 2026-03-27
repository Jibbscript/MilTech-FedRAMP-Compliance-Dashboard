import type { ReactNode } from 'react'

export type BadgeColor = 'accent' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'
export type BadgeSize = 'xs' | 'sm'

export interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
  size?: BadgeSize
}

export interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  accent?: string
  style?: React.CSSProperties
}

export interface MetricBoxProps {
  label: string
  value: string | number
  sub?: string
  trend?: number
  color?: string
}

export interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  height?: number
  label?: string
}

export interface TabDef {
  id: string
  label: string
  icon: string
}

export interface TabBarProps {
  tabs: readonly TabDef[]
  active: string
  onChange: (tabId: string) => void
}

export interface FlowDiagramItem {
  readonly name: string
  readonly sub: string
  readonly color: string
}

export interface FlowDiagramProps<T extends FlowDiagramItem = FlowDiagramItem> {
  items: readonly T[]
  renderExtra?: (item: T, index: number) => ReactNode
  arrow?: string
}

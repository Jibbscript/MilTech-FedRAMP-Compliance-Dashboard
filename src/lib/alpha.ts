/** Safely create a transparent version of a hex color */
export function alpha(hex: string, opacity: number): string {
  const clamped = Math.max(0, Math.min(1, opacity))
  return `${hex}${Math.round(clamped * 255).toString(16).padStart(2, '0')}`
}

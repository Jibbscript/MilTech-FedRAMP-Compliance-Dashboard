import type { NISTControl, SPRSScore } from '@/types/compliance'

/** Pure function: calculate SPRS score from controls array */
export function calculateSPRSScore(controls: readonly NISTControl[]): SPRSScore {
  const gaps = controls.filter(c => !c.implemented)
  const totalDeduction = gaps.reduce((sum, c) => sum + c.weight, 0)
  return {
    score: 110 - totalDeduction,
    totalDeduction,
    gapCount: gaps.length,
    gaps,
  }
}

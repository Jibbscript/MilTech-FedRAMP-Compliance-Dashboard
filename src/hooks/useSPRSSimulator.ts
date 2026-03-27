import { useReducer } from 'react'
import type { NISTControl, SPRSScore } from '@/types/compliance'
import { calculateSPRSScore } from '@/lib/sprs-scoring'

interface SPRSState extends SPRSScore {
  controls: NISTControl[]
}

type SPRSAction =
  | { type: 'TOGGLE_CONTROL'; id: string }
  | { type: 'RESET'; initialControls: readonly NISTControl[] }

function sprsReducer(state: SPRSState, action: SPRSAction): SPRSState {
  switch (action.type) {
    case 'TOGGLE_CONTROL': {
      const controls = state.controls.map(c =>
        c.id === action.id ? { ...c, implemented: !c.implemented } : c
      )
      return { controls, ...calculateSPRSScore(controls) }
    }
    case 'RESET': {
      const controls = action.initialControls.map(c => ({ ...c }))
      return { controls, ...calculateSPRSScore(controls) }
    }
  }
}

export function useSPRSSimulator(initialControls: readonly NISTControl[]) {
  const controls = initialControls.map(c => ({ ...c }))
  const initialState: SPRSState = {
    controls,
    ...calculateSPRSScore(controls),
  }

  const [state, dispatch] = useReducer(sprsReducer, initialState)

  return {
    controls: state.controls,
    score: state.score,
    totalDeduction: state.totalDeduction,
    gapCount: state.gapCount,
    gaps: state.gaps,
    toggleControl: (id: string) => dispatch({ type: 'TOGGLE_CONTROL', id }),
    reset: () => dispatch({ type: 'RESET', initialControls }),
  }
}

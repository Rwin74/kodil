export type AdminActionState =
  | { status: 'idle'; message: '' }
  | { status: 'success' | 'error'; message: string; redirectTo?: string }

export const INITIAL_ADMIN_ACTION_STATE: AdminActionState = { status: 'idle', message: '' }

export function actionError(error: unknown): AdminActionState {
  return {
    status: 'error',
    message: error instanceof Error ? error.message : 'İşlem tamamlanamadı.',
  }
}

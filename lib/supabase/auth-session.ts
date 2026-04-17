type SupabaseRequestError = {
  code?: string
  message: string
  status?: number
}

type SessionClient = {
  auth: {
    getSession: () => Promise<{
      data: { session: unknown | null }
      error: SupabaseRequestError | null
    }>
  }
}

export const AUTH_REQUIRED_ERROR_MESSAGE = 'Sessao encerrada. Entre novamente para continuar.'

export function isAuthError(error: SupabaseRequestError | null | undefined) {
  if (!error) {
    return false
  }

  if (error.status === 401 || error.status === 403) {
    return true
  }

  if (error.code === '42501' || error.code === 'PGRST301') {
    return true
  }

  return /jwt|auth|session|not authenticated|permission denied|invalid token/i.test(error.message)
}

export async function hasActiveSession(client: SessionClient) {
  const {
    data: { session },
    error
  } = await client.auth.getSession()

  if (error || !session) {
    return false
  }

  return true
}

export function hasSupabaseAuthCookie(cookieNames: string[]) {
  return cookieNames.some((name) => name.startsWith('sb-') && name.includes('auth-token'))
}

export function getLoginErrorMessage(error: string | null) {
  if (!error) {
    return null
  }

  if (error === 'session_ended') {
    return 'Sua sessao foi encerrada. Entre novamente.'
  }

  if (error === 'auth_failed') {
    return 'Nao foi possivel concluir login. Tente novamente.'
  }

  if (error === 'missing_code') {
    return 'Link de login invalido. Tente entrar novamente.'
  }

  return null
}

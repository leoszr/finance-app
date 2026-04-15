type ErrorMessageProps = {
  message?: string
  onRetry?: () => void
  title?: string
  className?: string
}

export function ErrorMessage({
  message = 'Nao foi possivel carregar as informacoes. Tente novamente.',
  onRetry,
  title = 'Erro ao carregar dados',
  className = ''
}: ErrorMessageProps) {
  return (
    <section
      aria-live="assertive"
      className={`glass-card rounded-2xl border border-rose-200 bg-rose-50/80 p-4 ${className}`.trim()}
      role="alert"
    >
      <p className="text-sm font-semibold text-rose-800">{title}</p>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
      {onRetry ? (
        <button
          className="glass-btn mt-3 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700"
          onClick={onRetry}
          type="button"
        >
          Tentar novamente
        </button>
      ) : null}
    </section>
  )
}

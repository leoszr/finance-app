export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-3 px-5 py-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Voce esta offline</h1>
      <p className="text-sm text-slate-600">
        Sem conexao no momento. Assim que a internet voltar, atualize a pagina para continuar.
      </p>
    </main>
  )
}
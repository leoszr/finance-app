'use client'

import Link from 'next/link'
import { type ChangeEvent, useMemo, useState } from 'react'

import { useCategories } from '@/lib/hooks/use-categories'
import { parseNubankCSV, type ParsedNubankRow, validateCSVFileName } from '@/lib/csv/parse-nubank-csv'

type PreviewRow = ParsedNubankRow & {
  selected: boolean
  category_id: string
}

type Step = 'upload' | 'preview' | 'confirm'

async function readFileAsText(file: File) {
  return file.text()
}

export default function ImportarTransacoesPage() {
  const [step, setStep] = useState<Step>('upload')
  const [rows, setRows] = useState<PreviewRow[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [info, setInfo] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)

  const { categories } = useCategories({ kind: 'expense' })

  const previewStats = useMemo(() => {
    return rows.reduce(
      (stats, row) => {
        if (!row.selected) {
          return stats
        }

        stats.selected += 1

        if (!row.category_id) {
          stats.selectedWithoutCategory += 1
        }

        return stats
      },
      { selected: 0, selectedWithoutCategory: 0 }
    )
  }, [rows])

  const selectedCount = previewStats.selected
  const selectedWithoutCategory = previewStats.selectedWithoutCategory
  const canAdvanceConfirm = selectedCount > 0 && selectedWithoutCategory === 0

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setErrors([])
    setInfo(null)
    setIsParsing(true)

    try {
      const nameError = validateCSVFileName(file.name)
      if (nameError) {
        setErrors([nameError])
        setRows([])
        setStep('upload')
        return
      }

      const content = await readFileAsText(file)
      const result = parseNubankCSV(content)

      setRows(
        result.rows.map((row) => ({
          ...row,
          selected: true,
          category_id: ''
        }))
      )

      const parseErrors = result.errors.map((item) => `Linha ${item.line}: ${item.reason}`)
      if (parseErrors.length > 0) {
        setErrors(parseErrors)
      }

      setInfo(
        `Linhas válidas: ${result.rows.length}. Ignoradas (valor positivo): ${result.skippedPositive}.`
      )

      setStep('preview')
    } catch (error) {
      setRows([])
      setStep('upload')
      setErrors([error instanceof Error ? error.message : 'Falha ao ler arquivo CSV.'])
    } finally {
      setIsParsing(false)
      event.target.value = ''
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-5 py-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Importar CSV Nubank</h1>
        <p className="mt-1 text-sm text-slate-600">Etapas: Upload → Preview → Confirmação.</p>
        <Link className="glass-btn mt-2 inline-block rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-800" href="/transacoes">
          Voltar para transações
        </Link>
      </header>

      {errors.length > 0 ? (
        <section className="glass-card rounded-2xl border border-rose-200 bg-rose-50/80 p-3" role="alert">
          <p className="text-sm font-semibold text-rose-700">Foram encontrados problemas:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-rose-700">
            {errors.slice(0, 10).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {info ? (
        <section className="glass-card rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3">
          <p className="text-sm text-emerald-800">{info}</p>
        </section>
      ) : null}

      {step === 'upload' ? (
        <section className="glass-card rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-900">1. Upload</h2>
          <p className="mt-1 text-xs text-slate-600">Selecione um arquivo CSV exportado do Nubank.</p>

          <input
            accept=".csv,text/csv"
            className="mt-3 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            disabled={isParsing}
            onChange={(event) => {
              void onFileChange(event)
            }}
            type="file"
          />

          {isParsing ? <p className="mt-2 text-xs text-slate-600">Processando arquivo...</p> : null}
        </section>
      ) : null}

      {step === 'preview' ? (
        <section className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">2. Preview</h2>
            <button
              className="glass-btn rounded-lg px-3 py-1 text-xs font-medium text-slate-800"
              onClick={() => {
                setStep('upload')
                setRows([])
                setErrors([])
                setInfo(null)
              }}
              type="button"
            >
              Trocar arquivo
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-600">
            Selecionadas: {selectedCount} · Sem categoria: {selectedWithoutCategory}
          </p>

          <div className="mt-3 space-y-2">
            {rows.map((row) => (
              <article className="glass-card rounded-xl p-3" key={row.line}>
                <label className="flex items-start gap-2">
                  <input
                    checked={row.selected}
                    onChange={(event) => {
                      setRows((current) =>
                        current.map((item) =>
                          item.line === row.line ? { ...item, selected: event.target.checked } : item
                        )
                      )
                    }}
                    type="checkbox"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{row.description}</p>
                    <p className="text-xs text-slate-600">
                      {row.occurred_on} · R$ {row.amount.toFixed(2)}
                    </p>
                  </div>
                </label>

                <select
                  className="glass-btn mt-2 w-full rounded-lg px-2 py-1.5 text-xs text-slate-800"
                  value={row.category_id}
                  onChange={(event) => {
                    setRows((current) =>
                      current.map((item) =>
                        item.line === row.line ? { ...item, category_id: event.target.value } : item
                      )
                    )
                  }}
                >
                  <option value="">Selecione categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>

          <button
            className="glass-btn mt-3 w-full rounded-lg bg-slate-900/80 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={!canAdvanceConfirm}
            onClick={() => setStep('confirm')}
            type="button"
          >
            Ir para confirmação
          </button>
        </section>
      ) : null}

      {step === 'confirm' ? (
        <section className="glass-card rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-900">3. Confirmação</h2>
          <p className="mt-2 text-sm text-slate-700">
            Pronto para importar {selectedCount} transações. Implementação do batch será o próximo passo.
          </p>
          <button
            className="glass-btn mt-3 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800"
            onClick={() => setStep('preview')}
            type="button"
          >
            Voltar ao preview
          </button>
        </section>
      ) : null}
    </main>
  )
}

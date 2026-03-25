'use client'

type MonthPickerProps = {
  value: string
  onChange: (value: string) => void
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="month-picker">
        Mes de referencia
      </label>
      <input
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        id="month-picker"
        onChange={(event) => onChange(event.target.value)}
        type="month"
        value={value}
      />
    </div>
  )
}

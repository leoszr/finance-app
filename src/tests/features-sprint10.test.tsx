import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { createReportQueries } from '@/db/queries/reportQueries';
import { createAccountsRepository } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';
import { ReportScreen } from '@/features/reports/ReportScreen';
import { generateAndShareReportPdf } from '@/features/reports/pdf/reportPdf';
import { buildReportPdfHtml } from '@/features/reports/pdf/reportPdfHtml';
import { err, ok } from '@/lib/result';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

const mockPrintToFileAsync = jest.fn();
const mockIsAvailableAsync = jest.fn();
const mockShareAsync = jest.fn();
const mockInfo = jest.fn();

jest.mock('expo-print', () => ({ printToFileAsync: (...args: unknown[]) => mockPrintToFileAsync(...args) }));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: (...args: unknown[]) => mockIsAvailableAsync(...args),
  shareAsync: (...args: unknown[]) => mockShareAsync(...args),
}));
jest.mock('expo-file-system', () => ({ Paths: { info: (...args: unknown[]) => mockInfo(...args) } }));

function pad(value: number) { return String(value).padStart(2, '0'); }
function dateFor(offset: number, day = 15) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, day);
  return { year: date.getFullYear(), month: date.getMonth() + 1, iso: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(day)}` };
}

async function reportSeed() {
  const database = createFakeRepositoryDatabase();
  const accountsRepository = createAccountsRepository(database);
  const categoriesRepository = createCategoriesRepository(database);
  const transactionsRepository = createTransactionsRepository(database);
  const reportQueries = createReportQueries(database);
  const account = await accountsRepository.createAccount({ name: 'Banco', type: 'checking', initialBalanceCents: 0 });
  const salary = await categoriesRepository.createCategory({ name: 'Salário', type: 'income' });
  const market = await categoriesRepository.createCategory({ name: 'Mercado & feira', type: 'expense' });
  if (!account.ok || !salary.ok || !market.ok) throw new Error('setup failed');
  await transactionsRepository.createTransaction({ accountId: account.value.id, categoryId: salary.value.id, type: 'income', amountCents: 300000, transactionDate: dateFor(0, 10).iso, description: 'Salário <mensal>' });
  await transactionsRepository.createTransaction({ accountId: account.value.id, categoryId: market.value.id, type: 'expense', amountCents: 50000, transactionDate: dateFor(0, 12).iso, description: 'Compras' });
  const current = dateFor(0);
  const report = await reportQueries.getMonthlyReport(current.year, current.month);
  if (!report.ok) throw new Error('report failed');
  return { report: report.value, reportQueries, current };
}

describe('Sprint 10 geração de PDF local', () => {
  beforeEach(() => {
    mockPrintToFileAsync.mockReset();
    mockIsAvailableAsync.mockReset();
    mockShareAsync.mockReset();
    mockInfo.mockReset();
  });

  it('covers T1001-T1003: has local PDF dependencies, builds HTML and generates/share PDF', async () => {
    const packageJson = require('../../package.json') as { dependencies: Record<string, string> };
    expect(packageJson.dependencies['expo-print']).toBeTruthy();
    expect(packageJson.dependencies['expo-sharing']).toBeTruthy();
    expect(packageJson.dependencies['expo-file-system']).toBeTruthy();

    const { report, current } = await reportSeed();
    const html = buildReportPdfHtml(report, current.year, current.month);
    expect(html).toContain('Relatório financeiro mensal');
    expect(html).toContain('Receitas');
    expect(html).toContain('Despesas');
    expect(html).toContain('Saldo');
    expect(html).toContain('Mercado &amp; feira');
    expect(html).toContain('Salário &lt;mensal&gt;');
    expect(html).toContain('<table');

    mockPrintToFileAsync.mockResolvedValue({ uri: 'file:///tmp/report.pdf' });
    mockInfo.mockReturnValue({ exists: true, isDirectory: false });
    mockIsAvailableAsync.mockResolvedValue(true);

    const result = await generateAndShareReportPdf(report, current.year, current.month);

    expect(result.ok).toBe(true);
    expect(mockPrintToFileAsync).toHaveBeenCalledWith(expect.objectContaining({ html: expect.stringContaining('Relatório financeiro mensal'), base64: false }));
    expect(mockShareAsync).toHaveBeenCalledWith('file:///tmp/report.pdf', expect.objectContaining({ mimeType: 'application/pdf' }));
    if (result.ok) expect(result.value).toEqual({ uri: 'file:///tmp/report.pdf', shared: true });
  });

  it('covers T1005: returns local URI when native sharing is unavailable or fails', async () => {
    const { report, current } = await reportSeed();
    mockPrintToFileAsync.mockResolvedValue({ uri: 'file:///tmp/report.pdf' });
    mockInfo.mockReturnValue({ exists: true, isDirectory: false });
    mockIsAvailableAsync.mockResolvedValue(false);

    const unavailable = await generateAndShareReportPdf(report, current.year, current.month);

    expect(unavailable.ok).toBe(true);
    expect(mockShareAsync).not.toHaveBeenCalled();
    if (unavailable.ok) expect(unavailable.value).toEqual({ uri: 'file:///tmp/report.pdf', shared: false });

    mockIsAvailableAsync.mockResolvedValue(true);
    mockShareAsync.mockRejectedValue(new Error('cancelled'));
    const failedShare = await generateAndShareReportPdf(report, current.year, current.month);

    expect(failedShare.ok).toBe(true);
    if (failedShare.ok) expect(failedShare.value).toEqual({ uri: 'file:///tmp/report.pdf', shared: false });
  });

  it('covers controlled PDF generation errors', async () => {
    const { report, current } = await reportSeed();
    mockPrintToFileAsync.mockRejectedValue(new Error('native failed'));

    const result = await generateAndShareReportPdf(report, current.year, current.month);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Não foi possível gerar o PDF.');
  });

  it('covers T1004: report screen button generates PDF, shows loading and errors', async () => {
    const { reportQueries } = await reportSeed();
    let resolvePdf: ((value: ReturnType<typeof ok<{ uri: string; shared: boolean }>>) => void) | undefined;
    const pdfGenerator = jest.fn(() => new Promise<ReturnType<typeof ok<{ uri: string; shared: boolean }>>>((resolve) => { resolvePdf = resolve; }));
    const screen = await render(<ReportScreen reportQueries={reportQueries} pdfGenerator={pdfGenerator} />);

    await waitFor(() => expect(screen.getByTestId('generate-report-pdf-button')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByTestId('generate-report-pdf-button')); });

    expect(pdfGenerator).toHaveBeenCalledWith(expect.objectContaining({ incomeCents: 300000 }), dateFor(0).year, dateFor(0).month, 'BRL');
    expect(screen.getByTestId('button-loading')).toBeTruthy();

    await act(async () => { resolvePdf?.(ok({ uri: 'file:///tmp/report.pdf', shared: false })); });
    await waitFor(() => expect(screen.getByText('PDF gerado. Compartilhamento indisponível neste dispositivo.')).toBeTruthy());

    await act(async () => { fireEvent.press(screen.getByTestId('generate-report-pdf-button')); });
    await act(async () => { resolvePdf?.(err('pdf_generation_failed', 'Não foi possível gerar o PDF.')); });
    await waitFor(() => expect(screen.getByText('Não foi possível gerar o PDF.')).toBeTruthy());
  });

  it('ignores stale PDF completion after month change', async () => {
    const { reportQueries } = await reportSeed();
    let resolvePdf: ((value: ReturnType<typeof ok<{ uri: string; shared: boolean }>>) => void) | undefined;
    const pdfGenerator = jest.fn(() => new Promise<ReturnType<typeof ok<{ uri: string; shared: boolean }>>>((resolve) => { resolvePdf = resolve; }));
    const screen = await render(<ReportScreen reportQueries={reportQueries} pdfGenerator={pdfGenerator} />);

    await waitFor(() => expect(screen.getByTestId('generate-report-pdf-button')).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByTestId('generate-report-pdf-button')); });
    await act(async () => { fireEvent.press(screen.getByTestId('report-next-month-button')); });
    await waitFor(() => expect(screen.getByTestId('report-empty-state')).toBeTruthy());
    await act(async () => { resolvePdf?.(ok({ uri: 'file:///tmp/old.pdf', shared: true })); });

    expect(screen.queryByText('PDF gerado e compartilhado.')).toBeNull();
  });

});

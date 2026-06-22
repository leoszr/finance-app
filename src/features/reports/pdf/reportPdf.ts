import { Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { MonthlyReport } from '@/db/queries/reportQueries';
import type { AppCurrency } from '@/lib/money';
import { err, ok, type Result } from '@/lib/result';
import { buildReportPdfHtml } from '@/features/reports/pdf/reportPdfHtml';

export type PdfResult = { uri: string; shared: boolean };

export async function generateAndShareReportPdf(report: MonthlyReport, year: number, month: number, currency: AppCurrency = 'BRL'): Promise<Result<PdfResult>> {
  try {
    const html = buildReportPdfHtml(report, year, month, currency);
    const printed = await Print.printToFileAsync({ html, base64: false });
    if (!printed.uri || !Paths.info(printed.uri).exists) return err('pdf_file_missing', 'PDF não foi gerado.');

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return ok({ uri: printed.uri, shared: false });

    try {
      await Sharing.shareAsync(printed.uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar relatório financeiro' });
      return ok({ uri: printed.uri, shared: true });
    } catch {
      return ok({ uri: printed.uri, shared: false });
    }
  } catch {
    return err('pdf_generation_failed', 'Não foi possível gerar o PDF.');
  }
}


import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

import { isRefereeAuthenticated } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import {
  getTallyParticipants,
  normalizeTallyLabel,
  type TallyParticipant,
} from '@/lib/tally';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function headerValue(
  header: string,
  participant: TallyParticipant,
): string {
  const normalizedHeader = normalizeTallyLabel(header);

  if (
    /نام.*نامخانوادگی|نامخانوادگی|نامکامل|fullname/.test(
      normalizedHeader,
    ) ||
    normalizedHeader === 'نام'
  ) {
    return participant.full_name === 'نام ثبت نشده'
      ? ''
      : participant.full_name;
  }

  if (/تلفن|موبایل|شمارهتماس|شمارهتلفن|phone|mobile/.test(normalizedHeader)) {
    return participant.phone;
  }

  if (/ایمیل|email/.test(normalizedHeader)) {
    return participant.email;
  }

  if (/تاریخثبت|زمانثبت|تاریخارسال/.test(normalizedHeader)) {
    return participant.created_at;
  }

  const entries = Object.entries(participant.answers);
  const exact = entries.find(
    ([label]) => normalizeTallyLabel(label) === normalizedHeader,
  );

  if (exact) return exact[1];

  const partial = entries.find(([label]) => {
    const normalizedLabel = normalizeTallyLabel(label);
    return (
      normalizedLabel.length > 2 &&
      (normalizedHeader.includes(normalizedLabel) ||
        normalizedLabel.includes(normalizedHeader))
    );
  });

  return partial?.[1] ?? '';
}

function copyRowStyle(
  worksheet: ExcelJS.Worksheet,
  sourceRowNumber: number,
  targetRowNumber: number,
) {
  const source = worksheet.getRow(sourceRowNumber);
  const target = worksheet.getRow(targetRowNumber);

  source.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const targetCell = target.getCell(colNumber);
    targetCell.style = { ...cell.style };
    targetCell.numFmt = cell.numFmt;
    targetCell.alignment = cell.alignment
      ? { ...cell.alignment }
      : undefined;
    targetCell.border = cell.border ? { ...cell.border } : undefined;
    targetCell.fill = cell.fill ? { ...cell.fill } : undefined;
    targetCell.font = cell.font ? { ...cell.font } : undefined;
  });

  target.height = source.height;
}

function findHeaderRow(worksheet: ExcelJS.Worksheet): number {
  const maxRow = Math.min(worksheet.rowCount, 40);

  for (let rowNumber = 1; rowNumber <= maxRow; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const values: string[] = [];

    row.eachCell((cell) => {
      values.push(normalizeTallyLabel(String(cell.text || '')));
    });

    const hasNameColumn = values.some((value) =>
      /نام.*نامخانوادگی|نامخانوادگی|نامکامل|fullname/.test(value),
    );

    const filledCount = values.filter(Boolean).length;

    if (hasNameColumn && filledCount >= 2) {
      return rowNumber;
    }
  }

  return 0;
}

function createFallbackSheet(
  workbook: ExcelJS.Workbook,
  participants: TallyParticipant[],
) {
  const worksheet = workbook.addWorksheet('ثبت‌نام‌های Tally');

  const allLabels = Array.from(
    new Set(participants.flatMap((p) => Object.keys(p.answers))),
  );

  const columns = [
    { header: 'نام و نام خانوادگی', key: 'full_name', width: 28 },
    { header: 'تلفن', key: 'phone', width: 18 },
    { header: 'ایمیل', key: 'email', width: 30 },
    ...allLabels.map((label, index) => ({
      header: label,
      key: `answer_${index}`,
      width: 24,
    })),
  ];

  worksheet.columns = columns;

  for (const participant of participants) {
    const row: Record<string, string> = {
      full_name:
        participant.full_name === 'نام ثبت نشده'
          ? ''
          : participant.full_name,
      phone: participant.phone,
      email: participant.email,
    };

    allLabels.forEach((label, index) => {
      row[`answer_${index}`] = participant.answers[label] ?? '';
    });

    worksheet.addRow(row);
  }

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!(await isRefereeAuthenticated())) {
      return NextResponse.json(
        { error: 'برای دانلود وارد پنل داور شوید.' },
        { status: 401 },
      );
    }

    const supabase = createServerClient();

    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('id, title, referee_enabled, referee_file_url')
      .eq('id', params.id)
      .eq('referee_enabled', true)
      .single();

    if (tournamentError || !tournament) {
      return NextResponse.json(
        { error: 'مسابقه پیدا نشد یا دسترسی داور فعال نیست.' },
        { status: 404 },
      );
    }

    const participants = await getTallyParticipants();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'هیأت شطرنج شهرستان نیشابور';
    workbook.subject = `فهرست ثبت‌نام‌های ${tournament.title}`;
    workbook.created = new Date();

    let loadedTemplate = false;

    if (tournament.referee_file_url) {
      const templateResponse = await fetch(tournament.referee_file_url, {
        cache: 'no-store',
      });

      if (templateResponse.ok) {
        const templateBuffer = await templateResponse.arrayBuffer();
        await workbook.xlsx.load(templateBuffer);
        loadedTemplate = workbook.worksheets.length > 0;
      }
    }

    if (loadedTemplate) {
      const worksheet = workbook.worksheets[0];
      const headerRowNumber = findHeaderRow(worksheet);

      if (headerRowNumber > 0) {
        const headerRow = worksheet.getRow(headerRowNumber);
        const columnHeaders: Array<{ column: number; label: string }> = [];

        headerRow.eachCell((cell, column) => {
          const label = String(cell.text || '').trim();
          if (label) columnHeaders.push({ column, label });
        });

        const startRow = headerRowNumber + 1;

        participants.forEach((participant, index) => {
          const rowNumber = startRow + index;

          if (rowNumber <= worksheet.rowCount) {
            copyRowStyle(
              worksheet,
              Math.max(startRow, rowNumber - 1),
              rowNumber,
            );
          }

          const row = worksheet.getRow(rowNumber);

          for (const header of columnHeaders) {
            row.getCell(header.column).value = headerValue(
              header.label,
              participant,
            );
          }

          row.commit();
        });
      } else {
        createFallbackSheet(workbook, participants);
      }
    } else {
      createFallbackSheet(workbook, participants);
    }

    const output = await workbook.xlsx.writeBuffer();
    const safeName = `participants-${params.id}.xlsx`;

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Excel export error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'ساخت فایل Excel ناموفق بود.',
      },
      { status: 500 },
    );
  }
}

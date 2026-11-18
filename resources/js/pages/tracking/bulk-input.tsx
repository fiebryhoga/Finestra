import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ClipboardPaste, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import TrackingController from '@/actions/App/Http/Controllers/TrackingController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    addDaysToIsoDate,
    calculateBaseMetricsPreview,
} from '@/lib/quick-recovery';
import {
    index as trackingIndex,
    show as trackingShow,
} from '@/routes/tracking';
import type { BulkAthleteSummary, BulkMetricRow } from '@/types';

type Props = {
    athlete: BulkAthleteSummary;
    existingRows: BulkMetricRow[];
    baselineRhr: number | null;
    today: string;
};

type PasteField = 'rhr' | 'spo2' | 'vj' | 'weight' | 'age';

const PASTE_ORDER: PasteField[] = ['rhr', 'spo2', 'vj', 'weight', 'age'];

function createDefaultRow(
    recordDate: string,
    athlete: BulkAthleteSummary,
): BulkMetricRow {
    return {
        record_date: recordDate,
        rhr: '',
        spo2: '',
        vj: '',
        weight: String(athlete.weight_kg),
        age: String(athlete.age > 0 ? athlete.age : 20),
    };
}

export default function TrackingBulkInput({
    athlete,
    existingRows,
    baselineRhr,
    today,
}: Props) {
    const pageErrors = usePage().props.errors as Record<string, string>;

    const [rows, setRows] = useState<BulkMetricRow[]>(() =>
        existingRows.length > 0
            ? existingRows
            : [createDefaultRow(today, athlete)],
    );
    const [submitting, setSubmitting] = useState(false);

    const updateField = (
        index: number,
        field: keyof BulkMetricRow,
        value: string,
    ) => {
        setRows((current) =>
            current.map((row, i) =>
                i === index ? { ...row, [field]: value } : row,
            ),
        );
    };

    const addRow = () => {
        setRows((current) => {
            const lastDate = current[current.length - 1]?.record_date;
            const nextDate = lastDate ? addDaysToIsoDate(lastDate, 1) : today;

            return [...current, createDefaultRow(nextDate, athlete)];
        });
    };

    const removeRow = (index: number) => {
        setRows((current) => {
            if (current.length <= 1) {
                return current;
            }

            return current.filter((_, i) => i !== index);
        });
    };

    const handleGridPaste = (
        event: React.ClipboardEvent<HTMLInputElement>,
        startRowIndex: number,
        startField: PasteField,
    ) => {
        const raw = event.clipboardData.getData('text');

        if (!raw.includes('\t') && !raw.includes('\n')) {
            return;
        }

        event.preventDefault();

        const pastedLines = raw
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n')
            .filter((line) => line.trim() !== '');

        if (pastedLines.length === 0) {
            return;
        }

        const startColIndex = PASTE_ORDER.indexOf(startField);

        setRows((current) => {
            const next = [...current];

            pastedLines.forEach((line, lineOffset) => {
                const targetRowIndex = startRowIndex + lineOffset;
                const cells = line.split('\t').map((cell) => cell.trim());

                while (next.length <= targetRowIndex) {
                    const prevDate = next[next.length - 1]?.record_date;
                    const nextDate = prevDate
                        ? addDaysToIsoDate(prevDate, 1)
                        : today;
                    next.push(createDefaultRow(nextDate, athlete));
                }

                const updatedRow = { ...next[targetRowIndex] };

                cells.forEach((cellValue, colOffset) => {
                    const targetField = PASTE_ORDER[startColIndex + colOffset];

                    if (targetField) {
                        updatedRow[targetField] = cellValue.replace(',', '.');
                    }
                });

                next[targetRowIndex] = updatedRow;
            });

            return next;
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        router.post(
            TrackingController.storeBulk.url(athlete.id),
            { rows },
            {
                preserveScroll: true,
                onStart: () => setSubmitting(true),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <>
            <Head title={`Input Massal — ${athlete.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="space-y-3">
                    <Link
                        href={trackingShow(athlete.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Detail {athlete.name}
                    </Link>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Input Massal — {athlete.name}
                            </h1>
                            <p className="text-sm text-muted-foreground tabular-nums">
                                Baseline RHR saat ini:{' '}
                                <span className="font-medium text-foreground">
                                    {baselineRhr !== null
                                        ? `${baselineRhr.toFixed(1)} bpm`
                                        : 'Otomatis dari input pertama'}
                                </span>{' '}
                                · {rows.length} baris siap disimpan
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addRow}
                                className="rounded-md"
                            >
                                <Plus className="size-4" />
                                Tambah Baris
                            </Button>
                            <Button
                                type="submit"
                                form="bulk-tracking-form"
                                disabled={submitting}
                                className="rounded-md"
                            >
                                {submitting ? (
                                    <Spinner />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                Simpan Semua ({rows.length})
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Excel Paste Instruction Banner */}
                <div className="flex items-start gap-3 rounded-md border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground">
                    <ClipboardPaste className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="space-y-0.5">
                        <p className="font-medium text-foreground">
                            Mendukung Copy–Paste langsung dari Excel / Google
                            Sheets
                        </p>
                        <p>
                            Salin beberapa baris &amp; kolom dengan urutan{' '}
                            <span className="font-medium text-foreground">
                                RHR → SpO₂ → VJ → Berat → Usia
                            </span>
                            , lalu tempel (`Ctrl+V` / `⌘V`) pada sel kolom RHR.
                            Baris baru akan ditambahkan otomatis bila melebihi
                            jumlah baris saat ini.
                        </p>
                    </div>
                </div>

                {pageErrors.rows && (
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-xs text-destructive-foreground">
                        {pageErrors.rows}
                    </div>
                )}

                {/* Spreadsheet Form */}
                <form
                    id="bulk-tracking-form"
                    onSubmit={handleSubmit}
                    className="rounded-md border border-border bg-card"
                >
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10 pl-4 text-center">
                                        #
                                    </TableHead>
                                    <TableHead className="min-w-40">
                                        Tanggal
                                    </TableHead>
                                    <TableHead className="min-w-28 text-right">
                                        RHR (bpm)
                                    </TableHead>
                                    <TableHead className="min-w-28 text-right">
                                        SpO₂ (%)
                                    </TableHead>
                                    <TableHead className="min-w-28 text-right">
                                        VJ (cm)
                                    </TableHead>
                                    <TableHead className="min-w-28 text-right">
                                        Berat (kg)
                                    </TableHead>
                                    <TableHead className="min-w-24 text-right">
                                        Usia
                                    </TableHead>
                                    <TableHead className="min-w-24 text-right">
                                        HR Max
                                    </TableHead>
                                    <TableHead className="min-w-24 text-right">
                                        VO₂ Max
                                    </TableHead>
                                    <TableHead className="min-w-28 text-right">
                                        Peak Power
                                    </TableHead>
                                    <TableHead className="w-12 pr-4 text-right">
                                        Hapus
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row, index) => {
                                    const preview = calculateBaseMetricsPreview(
                                        Number.parseInt(row.age, 10),
                                        Number.parseFloat(row.rhr),
                                        Number.parseFloat(row.weight),
                                        Number.parseFloat(row.vj),
                                    );

                                    const rowErrorKeys = [
                                        `rows.${index}.record_date`,
                                        `rows.${index}.rhr`,
                                        `rows.${index}.spo2`,
                                        `rows.${index}.vj`,
                                        `rows.${index}.weight`,
                                        `rows.${index}.age`,
                                    ];
                                    const rowErrors = rowErrorKeys
                                        .map((key) => pageErrors[key])
                                        .filter(Boolean);

                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="pl-4 text-center text-xs text-muted-foreground tabular-nums">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="date"
                                                    required
                                                    value={row.record_date}
                                                    onChange={(e) =>
                                                        updateField(
                                                            index,
                                                            'record_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-8 rounded-md text-xs tabular-nums"
                                                />
                                                {rowErrors.length > 0 && (
                                                    <p className="mt-1 text-[11px] text-destructive-foreground">
                                                        {rowErrors[0]}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={30}
                                                    max={150}
                                                    step="0.1"
                                                    required
                                                    placeholder="57"
                                                    value={row.rhr}
                                                    onChange={(e) =>
                                                        updateField(
                                                            index,
                                                            'rhr',
                                                            e.target.value,
                                                        )
                                                    }
                                                    onPaste={(e) =>
                                                        handleGridPaste(
                                                            e,
                                                            index,
                                                            'rhr',
                                                        )
                                                    }
                                                    className="h-8 rounded-md text-right text-xs tabular-nums"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={70}
                                                    max={100}
                                                    step="0.1"
                                                    required
                                                    placeholder="98"
                                                    value={row.spo2}
                                                    onChange={(e) =>
                                                        updateField(
                                                            index,
                                                            'spo2',
                                                            e.target.value,
                                                        )
                                                    }
                                                    onPaste={(e) =>
                                                        handleGridPaste(
                                                            e,
                                                            index,
                                                            'spo2',
                                                        )
                                                    }
                                                    className="h-8 rounded-md text-right text-xs tabular-nums"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={150}
                                                    step="0.1"
                                                    required
                                                    placeholder="55"
                                                    value={row.vj}
                                                    onChange={(e) =>
                                                        updateField(
                                                            index,
                                                            'vj',
                                                            e.target.value,
                                                        )
                                                    }
                                                    onPaste={(e) =>
                                                        handleGridPaste(
                                                            e,
                                                            index,
                                                            'vj',
                                                        )
                                                    }
                                                    className="h-8 rounded-md text-right text-xs tabular-nums"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={20}
                                                    max={250}
                                                    step="0.1"
                                                    required
                                                    placeholder="70"
                                                    value={row.weight}
                                                    onChange={(e) =>
                                                        updateField(
                                                            index,
                                                            'weight',
                                                            e.target.value,
                                                        )
                                                    }
                                                    onPaste={(e) =>
                                                        handleGridPaste(
                                                            e,
                                                            index,
                                                            'weight',
                                                        )
                                                    }
                                                    className="h-8 rounded-md text-right text-xs tabular-nums"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min={10}
                                                    max={80}
                                                    step={1}
                                                    required
                                                    placeholder="24"
                                                    value={row.age}
                                                    onChange={(e) =>
                                                        updateField(
                                                            index,
                                                            'age',
                                                            e.target.value,
                                                        )
                                                    }
                                                    onPaste={(e) =>
                                                        handleGridPaste(
                                                            e,
                                                            index,
                                                            'age',
                                                        )
                                                    }
                                                    className="h-8 rounded-md text-right text-xs tabular-nums"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                                                {preview.hr_max > 0
                                                    ? preview.hr_max.toFixed(1)
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                                                {preview.vo2_max > 0
                                                    ? preview.vo2_max.toFixed(2)
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                                                {preview.peak_power > 0
                                                    ? `${Math.round(preview.peak_power).toLocaleString('id-ID')} W`
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="pr-4 text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={rows.length <= 1}
                                                    onClick={() =>
                                                        removeRow(index)
                                                    }
                                                    className="size-8 rounded-md text-muted-foreground hover:text-destructive-foreground"
                                                    aria-label={`Hapus baris ${index + 1}`}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between border-t border-border px-4 py-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addRow}
                            className="rounded-md"
                        >
                            <Plus className="size-3.5" />
                            Tambah Baris Baru
                        </Button>

                        <Button
                            type="submit"
                            size="sm"
                            disabled={submitting}
                            className="rounded-md"
                        >
                            {submitting ? (
                                <Spinner />
                            ) : (
                                <Save className="size-3.5" />
                            )}
                            Simpan &amp; Hitung Ulang
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TrackingBulkInput.layout = {
    breadcrumbs: [
        {
            title: 'Tracking Quick Recovery',
            href: trackingIndex(),
        },
        {
            title: 'Input Massal',
            href: trackingIndex(),
        },
    ],
};

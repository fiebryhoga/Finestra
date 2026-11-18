import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BarChart3,
    Calendar,
    Download,
    Pencil,
    Plus,
    TableProperties,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import TrackingController from '@/actions/App/Http/Controllers/TrackingController';
import InputError from '@/components/input-error';
import { AnalyticsTab } from '@/components/tracking/analytics-tab';
import { DailyMetricDialog } from '@/components/tracking/daily-metric-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getRecoveryStatusMeta } from '@/lib/quick-recovery';
import { cn } from '@/lib/utils';
import {
    bulk as trackingBulk,
    exportPdf as trackingExportPdf,
    index as trackingIndex,
} from '@/routes/tracking';
import type {
    ClinicalInsight,
    DailyMetricRecord,
    TrackedAthleteDetail,
} from '@/types';

type Props = {
    athlete: TrackedAthleteDetail;
    metrics: DailyMetricRecord[];
    baselineRhr: number | null;
    insights: ClinicalInsight[];
    defaultReferenceDate: string;
    today: string;
};

type ActiveTab = 'calendar' | 'analytics';

export default function TrackingShow({
    athlete,
    metrics,
    baselineRhr,
    insights,
    defaultReferenceDate,
    today,
}: Props) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMetric, setEditingMetric] =
        useState<DailyMetricRecord | null>(null);
    const [deletingMetric, setDeletingMetric] =
        useState<DailyMetricRecord | null>(null);
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [includeInsights, setIncludeInsights] = useState(true);

    const openCreateDialog = () => {
        setEditingMetric(null);
        setDialogOpen(true);
    };

    const openEditDialog = (metric: DailyMetricRecord) => {
        setEditingMetric(metric);
        setDialogOpen(true);
    };

    const filledCount = metrics.filter(
        (m) => m.recovery_status !== 'KOSONG',
    ).length;

    const pdfDownloadUrl = trackingExportPdf.url(athlete.id, {
        query: {
            include_insights: includeInsights ? 1 : 0,
        },
    });

    return (
        <>
            <Head title={`Tracking — ${athlete.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Back Link & Header */}
                <div className="space-y-4">
                    <Link
                        href={trackingIndex()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Daftar Tracking
                    </Link>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                {athlete.name}
                            </h1>
                            <p className="text-sm text-muted-foreground tabular-nums">
                                {athlete.gender_label} · {athlete.age} thn ·{' '}
                                {athlete.weight_kg.toFixed(1)} kg ·{' '}
                                {athlete.height_cm.toFixed(1)} cm · IMT{' '}
                                {athlete.bmi.toFixed(1)} · Baseline RHR:{' '}
                                <span className="font-medium text-foreground">
                                    {baselineRhr !== null
                                        ? `${baselineRhr.toFixed(1)} bpm`
                                        : 'Belum ada'}
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                onClick={openCreateDialog}
                                className="rounded-md"
                            >
                                <Plus className="size-4" />
                                Input Harian
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="rounded-md"
                            >
                                <Link href={trackingBulk(athlete.id)}>
                                    <TableProperties className="size-4" />
                                    Input Massal
                                </Link>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPdfDialogOpen(true)}
                                className="rounded-md"
                            >
                                <Download className="size-4" />
                                Export PDF
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Program Start Date Inline Card */}
                <div className="rounded-md border border-border bg-card p-4">
                    <Form
                        {...TrackingController.setStartDate.form(athlete.id)}
                        options={{ preserveScroll: true }}
                        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Calendar className="size-4 text-primary" />
                                        <span>Tanggal Mulai Program</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Menentukan penomoran kalender{' '}
                                        <span className="font-medium text-foreground">
                                            Week X, Day Y
                                        </span>
                                        , auto-generate baris harian, dan
                                        prioritas Baseline RHR hari ke-1.
                                    </p>
                                    <InputError
                                        message={errors.training_start_date}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Input
                                        id="training-start-date"
                                        name="training_start_date"
                                        type="date"
                                        defaultValue={
                                            athlete.training_start_date ?? ''
                                        }
                                        className="h-9 w-44 rounded-md tabular-nums"
                                    />
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        size="sm"
                                        disabled={processing}
                                        className="h-9 rounded-md"
                                    >
                                        {processing && <Spinner />}
                                        Simpan Tanggal
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('calendar')}
                            className={cn(
                                'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                                activeTab === 'calendar'
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <Calendar className="size-3.5" />
                            Data &amp; Kalender Harian
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('analytics')}
                            className={cn(
                                'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                                activeTab === 'analytics'
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <BarChart3 className="size-3.5" />
                            Analitik &amp; Grafik
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground tabular-nums">
                        {filledCount} hari terisi dari {metrics.length} total
                        baris kalender
                    </p>
                </div>

                {/* Tab Content */}
                {activeTab === 'calendar' ? (
                    <div className="rounded-md border border-border bg-card">
                        {metrics.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                                <Calendar className="size-8 text-muted-foreground/60" />
                                <p className="text-sm font-medium text-foreground">
                                    Belum ada riwayat Quick Recovery
                                </p>
                                <p className="max-w-md text-xs text-muted-foreground">
                                    Atur Tanggal Mulai Program untuk membuat
                                    kalender otomatis, atau langsung klik Input
                                    Harian / Input Massal.
                                </p>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={openCreateDialog}
                                    className="mt-2 rounded-md"
                                >
                                    <Plus className="size-4" />
                                    Input Data Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-4">
                                                Tanggal
                                            </TableHead>
                                            <TableHead>Program</TableHead>
                                            <TableHead className="text-right">
                                                RHR
                                            </TableHead>
                                            <TableHead className="text-right">
                                                SpO₂
                                            </TableHead>
                                            <TableHead className="text-right">
                                                VJ
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Berat
                                            </TableHead>
                                            <TableHead className="text-right">
                                                VO₂ Max
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Peak Power
                                            </TableHead>
                                            <TableHead className="text-right">
                                                QRS
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="pr-4 text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {metrics.map((metric) => {
                                            const isEmpty =
                                                metric.recovery_status ===
                                                'KOSONG';
                                            const statusMeta =
                                                getRecoveryStatusMeta(
                                                    metric.recovery_status,
                                                );

                                            return (
                                                <TableRow
                                                    key={metric.id}
                                                    className={cn(
                                                        isEmpty &&
                                                            'bg-muted/20',
                                                    )}
                                                >
                                                    <TableCell className="pl-4 font-medium text-foreground tabular-nums">
                                                        {
                                                            metric.record_date_formatted
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {metric.week}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {metric.rhr > 0 ? (
                                                            <>
                                                                {metric.rhr.toFixed(
                                                                    1,
                                                                )}{' '}
                                                                <span className="text-muted-foreground">
                                                                    bpm
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {metric.spo2 > 0 ? (
                                                            <>
                                                                {metric.spo2.toFixed(
                                                                    1,
                                                                )}
                                                                <span className="text-muted-foreground">
                                                                    %
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {metric.vj > 0 ? (
                                                            <>
                                                                {metric.vj.toFixed(
                                                                    1,
                                                                )}{' '}
                                                                <span className="text-muted-foreground">
                                                                    cm
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {metric.weight > 0 ? (
                                                            <>
                                                                {metric.weight.toFixed(
                                                                    1,
                                                                )}{' '}
                                                                <span className="text-muted-foreground">
                                                                    kg
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {metric.vo2_max > 0 ? (
                                                            metric.vo2_max.toFixed(
                                                                1,
                                                            )
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {metric.peak_power >
                                                        0 ? (
                                                            <>
                                                                {Math.round(
                                                                    metric.peak_power,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                )}{' '}
                                                                <span className="text-muted-foreground">
                                                                    W
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-foreground tabular-nums">
                                                        {!isEmpty ? (
                                                            `${metric.quick_recovery_score}%`
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                                                            <span
                                                                className={cn(
                                                                    'size-1.5 shrink-0 rounded-full',
                                                                    statusMeta.dotClass,
                                                                )}
                                                            />
                                                            <span
                                                                className={
                                                                    statusMeta.textClass
                                                                }
                                                            >
                                                                {
                                                                    statusMeta.label
                                                                }
                                                            </span>
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-4 text-right">
                                                        <div className="inline-flex items-center justify-end gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    openEditDialog(
                                                                        metric,
                                                                    )
                                                                }
                                                                className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                                                                aria-label={`Ubah data ${metric.record_date_formatted}`}
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    setDeletingMetric(
                                                                        metric,
                                                                    )
                                                                }
                                                                className="size-8 rounded-md text-muted-foreground hover:text-destructive-foreground"
                                                                aria-label={`Hapus data ${metric.record_date_formatted}`}
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                ) : (
                    <AnalyticsTab
                        metrics={metrics}
                        baselineRhr={baselineRhr}
                        defaultReferenceDate={defaultReferenceDate}
                        fullInsights={insights}
                    />
                )}
            </div>

            {/* Create / Edit Daily Metric Modal */}
            <DailyMetricDialog
                open={dialogOpen}
                athlete={athlete}
                metric={editingMetric}
                baselineRhr={baselineRhr}
                today={today}
                onOpenChange={(open) => {
                    setDialogOpen(open);

                    if (!open) {
                        setEditingMetric(null);
                    }
                }}
            />

            {/* Delete Metric Confirmation Modal */}
            <Dialog
                open={deletingMetric !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingMetric(null);
                    }
                }}
            >
                <DialogContent className="rounded-md sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Data Harian</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus pencatatan tanggal{' '}
                            <span className="font-medium text-foreground">
                                {deletingMetric?.record_date_formatted}
                            </span>
                            ? Seluruh skor pemulihan riwayat atlet akan
                            direkalkulasi otomatis.
                        </DialogDescription>
                    </DialogHeader>

                    {deletingMetric && (
                        <Form
                            {...TrackingController.destroy.form([
                                athlete.id,
                                deletingMetric.id,
                            ])}
                            options={{ preserveScroll: true }}
                            onSuccess={() => setDeletingMetric(null)}
                        >
                            {({ processing }) => (
                                <DialogFooter className="gap-2 pt-2">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="rounded-md"
                                        >
                                            Batal
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={processing}
                                        className="rounded-md"
                                    >
                                        {processing && <Spinner />}
                                        Hapus Data
                                    </Button>
                                </DialogFooter>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Export PDF Modal */}
            <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
                <DialogContent className="rounded-md sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Export Laporan Quick Recovery</DialogTitle>
                        <DialogDescription>
                            Laporan PDF (A4 Portrait) mencakup profil atlet,
                            ringkasan statistik, dan seluruh tabel riwayat
                            harian.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3.5">
                        <Checkbox
                            id="pdf-include-insights"
                            checked={includeInsights}
                            onCheckedChange={(checked) =>
                                setIncludeInsights(checked === true)
                            }
                        />
                        <div className="grid gap-1 leading-none">
                            <Label
                                htmlFor="pdf-include-insights"
                                className="cursor-pointer text-sm font-medium"
                            >
                                Sertakan Automated Clinical Insights
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Menambahkan ringkasan evaluasi QRS, deviasi RHR,
                                dan kategori VO₂ Max di halaman laporan.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-md"
                            >
                                Batal
                            </Button>
                        </DialogClose>
                        <Button
                            asChild
                            className="rounded-md"
                            onClick={() => setPdfDialogOpen(false)}
                        >
                            <a href={pdfDownloadUrl}>
                                <Download className="size-4" />
                                Unduh PDF
                            </a>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

TrackingShow.layout = {
    breadcrumbs: [
        {
            title: 'Tracking Quick Recovery',
            href: trackingIndex(),
        },
        {
            title: 'Detail Atlet',
            href: trackingIndex(),
        },
    ],
};

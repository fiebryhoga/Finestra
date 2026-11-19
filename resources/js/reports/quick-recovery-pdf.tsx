import {
    Circle,
    Document,
    G,
    Line,
    Page,
    Path,
    Polyline,
    Rect,
    StyleSheet,
    Svg,
    Text,
    View,
} from '@react-pdf/renderer';
import type { QuickRecoveryReportData } from './types';

const styles = StyleSheet.create({
    page: {
        paddingTop: 24,
        paddingBottom: 36,
        paddingHorizontal: 24,
        fontSize: 8.5,
        fontFamily: 'Helvetica',
        color: '#0f172a',
        backgroundColor: '#ffffff',
    },
    header: {
        borderBottomWidth: 2,
        borderBottomColor: '#132e57',
        paddingBottom: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    brandKicker: {
        fontSize: 7,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#1e4b8f',
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#132e57',
    },
    headerSub: {
        fontSize: 7.5,
        color: '#475569',
        marginTop: 2,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    headerDate: {
        fontSize: 7.5,
        color: '#475569',
    },
    sectionTitle: {
        fontSize: 8.5,
        fontWeight: 'bold',
        color: '#132e57',
        marginTop: 10,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    // Meta Profile Grid
    metaTable: {
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#cbd5e1',
    },
    metaCellLabel: {
        width: '20%',
        backgroundColor: '#f1f5f9',
        paddingVertical: 3.5,
        paddingHorizontal: 5,
        fontWeight: 'bold',
        fontSize: 7.5,
        color: '#334155',
    },
    metaCellValue: {
        width: '30%',
        paddingVertical: 3.5,
        paddingHorizontal: 5,
        fontSize: 7.5,
        color: '#0f172a',
        borderRightWidth: 0.5,
        borderRightColor: '#cbd5e1',
    },
    // KPI Cards
    summaryRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8,
    },
    summaryCard: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        borderTopWidth: 2.5,
        borderTopColor: '#132e57',
        backgroundColor: '#f8fafc',
        padding: 6,
    },
    summaryLabel: {
        fontSize: 7,
        color: '#475569',
        marginBottom: 2,
    },
    summaryValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#132e57',
    },
    summaryUnit: {
        fontSize: 7,
        color: '#64748b',
    },
    // Chart Vector Card
    chartCard: {
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        borderRadius: 4,
        backgroundColor: '#f8fafc',
        padding: 8,
        marginBottom: 8,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    chartTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#132e57',
    },
    chartSubtitle: {
        fontSize: 6.5,
        color: '#64748b',
        marginTop: 1.5,
    },
    legendRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    legendText: {
        fontSize: 6.5,
        color: '#475569',
    },
    legendDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    // Insights
    insightsRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8,
    },
    insightCard: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        borderTopWidth: 2.5,
        backgroundColor: '#f8fafc',
        padding: 5,
    },
    insightCat: {
        fontSize: 6.5,
        fontWeight: 'bold',
        color: '#475569',
        letterSpacing: 0.3,
    },
    insightVal: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#132e57',
        marginVertical: 1.5,
    },
    insightTitle: {
        fontSize: 7.5,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 2,
    },
    insightText: {
        fontSize: 6.8,
        color: '#334155',
        lineHeight: 1.3,
    },
    // Daily Table
    table: {
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        marginTop: 2,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#132e57',
        borderBottomWidth: 0.5,
        borderBottomColor: '#132e57',
        paddingVertical: 4,
    },
    tableHeaderCell: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#ffffff',
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 3,
    },
    tableRowAlt: {
        backgroundColor: '#f8fafc',
    },
    tableCell: {
        fontSize: 7.2,
        color: '#0f172a',
        paddingHorizontal: 4,
    },
    tableCellNum: {
        textAlign: 'right',
    },
    statusGood: {
        color: '#059669',
        fontWeight: 'bold',
    },
    statusFair: {
        color: '#d97706',
        fontWeight: 'bold',
    },
    statusPoor: {
        color: '#e11d48',
        fontWeight: 'bold',
    },
    statusEmpty: {
        color: '#94a3b8',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 14,
        left: 24,
        right: 24,
        borderTopWidth: 0.5,
        borderTopColor: '#cbd5e1',
        paddingTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerBrand: {
        fontSize: 6.8,
        color: '#64748b',
    },
    footerPage: {
        fontSize: 6.8,
        color: '#64748b',
    },
});

function getInsightBorderColor(level: string): string {
    switch (level) {
        case 'optimal':
            return '#059669';
        case 'warning':
            return '#d97706';
        case 'risk':
            return '#e11d48';
        default:
            return '#0284c7';
    }
}

function QuickRecoveryChart({
    metrics,
}: {
    metrics: QuickRecoveryReportData['metrics'];
}) {
    const data = [...metrics]
        .reverse()
        .filter(
            (m) => m.status_code !== 'empty' && m.quick_recovery_score !== null,
        );

    if (data.length === 0) {
        return (
            <View style={styles.chartCard}>
                <Text
                    style={{
                        color: '#64748b',
                        fontSize: 7,
                        textAlign: 'center',
                        paddingVertical: 14,
                    }}
                >
                    Belum ada data skor pemulihan untuk divisualisasikan sebagai
                    grafik.
                </Text>
            </View>
        );
    }

    const width = 531;
    const height = 150;
    const marginLeft = 32;
    const marginRight = 16;
    const marginTop = 14;
    const marginBottom = 28;
    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;
    const plotBottom = marginTop + plotHeight;
    const plotLeft = marginLeft;
    const plotRight = marginLeft + plotWidth;

    const yTicks = [0, 25, 50, 75, 100];
    const yOpt = plotBottom - (75 / 100) * plotHeight;
    const yPoor = plotBottom - (35 / 100) * plotHeight;

    const N = data.length;
    const points: { cx: number; cy: number; qrs: number; date: string }[] = [];

    data.forEach((m, i) => {
        const cx =
            N === 1
                ? plotLeft + plotWidth / 2
                : plotLeft + (i / (N - 1)) * plotWidth;
        const cy =
            plotBottom - ((m.quick_recovery_score ?? 0) / 100) * plotHeight;
        points.push({
            cx,
            cy,
            qrs: m.quick_recovery_score ?? 0,
            date: m.record_date,
        });
    });

    const xLabelIndices: number[] = [];
    const numLabels = Math.min(8, N);
    const step = (N - 1) / Math.max(1, numLabels - 1);
    for (let i = 0; i < numLabels; i++) {
        xLabelIndices.push(Math.round(i * step));
    }

    const areaD =
        points.length > 1
            ? `M ${points[0].cx} ${plotBottom} ` +
              points.map((p) => `L ${p.cx} ${p.cy}`).join(' ') +
              ` L ${points[points.length - 1].cx} ${plotBottom} Z`
            : '';

    return (
        <View wrap={false} style={styles.chartCard}>
            <View style={styles.chartHeader}>
                <View>
                    <Text style={styles.chartTitle}>
                        TREN QUICK RECOVERY SCORE (QRS)
                    </Text>
                    <Text style={styles.chartSubtitle}>
                        Skala 0–100% dengan ambang zona optimal (75%) dan batas
                        pemulihan rendah (35%)
                    </Text>
                </View>
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#10b981' },
                            ]}
                        />
                        <Text style={styles.legendText}>
                            Optimal (&gt;= 75%)
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#f43f5e' },
                            ]}
                        />
                        <Text style={[styles.legendText, { color: '#e11d48' }]}>
                            Kurang (&lt; 35%)
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#1d4ed8' },
                            ]}
                        />
                        <Text style={styles.legendText}>QRS</Text>
                    </View>
                </View>
            </View>

            <Svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
            >
                {/* Shaded Optimal Zone (>= 75%) */}
                <Rect
                    x={plotLeft}
                    y={marginTop}
                    width={plotWidth}
                    height={yOpt - marginTop}
                    fill="#10b981"
                    fillOpacity={0.08}
                />

                {/* Horizontal Grid lines */}
                {yTicks.map((val, idx) => {
                    const y = plotBottom - (val / 100) * plotHeight;
                    return (
                        <G key={`qrs-grid-${idx}`}>
                            <Line
                                x1={plotLeft}
                                y1={y}
                                x2={plotRight}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeDasharray="2 2"
                                strokeWidth={0.5}
                            />
                            <Text
                                x={plotLeft - 5}
                                y={y + 2.5}
                                style={{
                                    fontSize: 6.5,
                                    fill: '#64748b',
                                    textAnchor: 'end',
                                }}
                            >
                                {val}%
                            </Text>
                        </G>
                    );
                })}

                {/* Reference Threshold Lines */}
                <Line
                    x1={plotLeft}
                    y1={yOpt}
                    x2={plotRight}
                    y2={yOpt}
                    stroke="#10b981"
                    strokeDasharray="4 3"
                    strokeWidth={0.8}
                />
                <Line
                    x1={plotLeft}
                    y1={yPoor}
                    x2={plotRight}
                    y2={yPoor}
                    stroke="#f43f5e"
                    strokeDasharray="4 3"
                    strokeWidth={0.8}
                />

                {/* Blue Area Fill under QRS line */}
                {points.length > 1 && (
                    <Path d={areaD} fill="#1d4ed8" fillOpacity={0.12} />
                )}

                {/* QRS Trend Line */}
                {points.length > 1 && (
                    <Polyline
                        points={points.map((p) => `${p.cx},${p.cy}`).join(' ')}
                        stroke="#1d4ed8"
                        strokeWidth={1.8}
                        fill="none"
                    />
                )}

                {/* Point Dots & Vertical Values if <= 35 points */}
                {points.map((p, i) => {
                    const showValue = N <= 25 || (N <= 40 && i % 2 === 0);
                    return (
                        <G key={`qrs-pt-${i}`}>
                            <Circle
                                cx={p.cx}
                                cy={p.cy}
                                r={2.2}
                                fill="#ffffff"
                                stroke="#1d4ed8"
                                strokeWidth={1.2}
                            />
                            {showValue && (
                                <G
                                    transform={`rotate(-90 ${p.cx} ${p.cy - 4})`}
                                >
                                    <Text
                                        x={p.cx}
                                        y={p.cy - 4}
                                        style={{
                                            fontSize: 5.5,
                                            fill: '#1d4ed8',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {Math.round(p.qrs)}%
                                    </Text>
                                </G>
                            )}
                        </G>
                    );
                })}

                {/* Sampled X Axis Date Labels */}
                {xLabelIndices.map((idx) => {
                    const p = points[idx];
                    if (!p) return null;
                    const shortDate = p.date.replace(/\s+\d{4}$/, '');
                    return (
                        <G
                            key={`x-lbl-${idx}`}
                            transform={`rotate(-90 ${p.cx} ${plotBottom + 6})`}
                        >
                            <Text
                                x={p.cx}
                                y={plotBottom + 6}
                                style={{
                                    fontSize: 6,
                                    fill: '#64748b',
                                    textAnchor: 'end',
                                }}
                            >
                                {shortDate}
                            </Text>
                        </G>
                    );
                })}
            </Svg>
        </View>
    );
}

export function QuickRecoveryPdfDocument({
    data,
}: {
    data: QuickRecoveryReportData;
}) {
    const { athlete, summary, insights, metrics, generated_at } = data;

    return (
        <Document
            title={`Laporan Quick Recovery - ${athlete.name}`}
            author="Phynestra Sports Science"
            subject="Monitoring Quick Recovery Atlet"
        >
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandKicker}>
                            PHYNESTRA SPORTS SCIENCE
                        </Text>
                        <Text style={styles.headerTitle}>
                            LAPORAN MONITORING QUICK RECOVERY
                        </Text>
                        <Text style={styles.headerSub}>
                            Physiological and Neuromuscular Tracking · FIKK
                            Universitas Negeri Surabaya
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.headerDate}>
                            Dicetak: {generated_at}
                        </Text>
                    </View>
                </View>

                {/* Athlete Metadata Profile */}
                <View style={styles.metaTable}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaCellLabel}>Nama Atlet</Text>
                        <Text style={styles.metaCellValue}>{athlete.name}</Text>
                        <Text style={styles.metaCellLabel}>
                            Cabang / Posisi
                        </Text>
                        <Text
                            style={[
                                styles.metaCellValue,
                                { borderRightWidth: 0 },
                            ]}
                        >
                            {athlete.sport_branch}
                            {athlete.position ? ` · ${athlete.position}` : ''}
                        </Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaCellLabel}>Jenis Kelamin</Text>
                        <Text style={styles.metaCellValue}>
                            {athlete.gender_label}
                        </Text>
                        <Text style={styles.metaCellLabel}>Usia / Lahir</Text>
                        <Text
                            style={[
                                styles.metaCellValue,
                                { borderRightWidth: 0 },
                            ]}
                        >
                            {athlete.age ? `${athlete.age} tahun` : '-'}
                            {athlete.birth_date
                                ? ` (${athlete.birth_date})`
                                : ''}
                        </Text>
                    </View>
                    <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.metaCellLabel}>Tinggi / Berat</Text>
                        <Text style={styles.metaCellValue}>
                            {athlete.height_cm
                                ? `${athlete.height_cm} cm`
                                : '-'}{' '}
                            /{' '}
                            {athlete.weight_kg
                                ? `${athlete.weight_kg} kg`
                                : '-'}
                        </Text>
                        <Text style={styles.metaCellLabel}>Baseline BHR</Text>
                        <Text
                            style={[
                                styles.metaCellValue,
                                { borderRightWidth: 0 },
                            ]}
                        >
                            {athlete.baseline_rhr
                                ? `${athlete.baseline_rhr.toFixed(1)} bpm`
                                : 'Dihitung otomatis'}
                        </Text>
                    </View>
                </View>

                {/* Summary KPI Cards */}
                <View style={styles.summaryRow}>
                    <View
                        style={[
                            styles.summaryCard,
                            summary.avg_recovery !== null
                                ? {
                                      borderTopColor:
                                          summary.avg_recovery >= 75
                                              ? '#059669'
                                              : summary.avg_recovery >= 35
                                                ? '#d97706'
                                                : '#e11d48',
                                  }
                                : undefined,
                        ]}
                    >
                        <Text style={styles.summaryLabel}>
                            Rata-rata Quick Recovery
                        </Text>
                        <Text style={styles.summaryValue}>
                            {summary.avg_recovery !== null
                                ? `${summary.avg_recovery.toFixed(1)}%`
                                : '-'}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Rata-rata BHR</Text>
                        <Text style={styles.summaryValue}>
                            {summary.avg_rhr !== null ? (
                                <>
                                    {summary.avg_rhr.toFixed(1)}{' '}
                                    <Text style={styles.summaryUnit}>bpm</Text>
                                </>
                            ) : (
                                '-'
                            )}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Max Peak Power</Text>
                        <Text style={styles.summaryValue}>
                            {summary.max_peak_power !== null ? (
                                <>
                                    {summary.max_peak_power.toLocaleString(
                                        'id-ID',
                                    )}{' '}
                                    <Text style={styles.summaryUnit}>W</Text>
                                </>
                            ) : (
                                '-'
                            )}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>
                            Rata-rata VO₂ Max
                        </Text>
                        <Text style={styles.summaryValue}>
                            {summary.avg_vo2_max !== null ? (
                                <>
                                    {summary.avg_vo2_max.toFixed(1)}{' '}
                                    <Text style={styles.summaryUnit}>
                                        ml/kg/mnt
                                    </Text>
                                </>
                            ) : (
                                '-'
                            )}
                        </Text>
                    </View>
                </View>

                {/* Quick Recovery Score Vector Chart */}
                <QuickRecoveryChart metrics={metrics} />

                {/* Automated Clinical Insights */}
                {insights.length > 0 && (
                    <View wrap={false}>
                        <Text style={styles.sectionTitle}>
                            AUTOMATED CLINICAL INSIGHTS
                        </Text>
                        <View style={styles.insightsRow}>
                            {insights.map((ins, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.insightCard,
                                        {
                                            borderTopColor:
                                                getInsightBorderColor(
                                                    ins.level,
                                                ),
                                        },
                                    ]}
                                >
                                    <Text style={styles.insightCat}>
                                        {ins.category}
                                    </Text>
                                    <Text style={styles.insightVal}>
                                        {ins.value}
                                    </Text>
                                    <Text style={styles.insightTitle}>
                                        {ins.title}
                                    </Text>
                                    <Text style={styles.insightText}>
                                        {ins.summary}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Daily Metrics History Table */}
                <Text style={styles.sectionTitle}>
                    RIWAYAT PENCATATAN HARIAN
                </Text>
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeaderRow}>
                        <Text
                            style={[styles.tableHeaderCell, { width: '13%' }]}
                        >
                            Tanggal
                        </Text>
                        <Text
                            style={[styles.tableHeaderCell, { width: '15%' }]}
                        >
                            Program
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '9%' },
                            ]}
                        >
                            BHR
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '9%' },
                            ]}
                        >
                            SpO₂
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '8%' },
                            ]}
                        >
                            VJ (cm)
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '9%' },
                            ]}
                        >
                            Berat
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '11%' },
                            ]}
                        >
                            VO₂ Max
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '12%' },
                            ]}
                        >
                            Peak Power
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '8%' },
                            ]}
                        >
                            QRS
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: '6%', textAlign: 'center' },
                            ]}
                        >
                            Status
                        </Text>
                    </View>

                    {/* Table Body */}
                    {metrics.length === 0 ? (
                        <View
                            style={[
                                styles.tableRow,
                                {
                                    justifyContent: 'center',
                                    paddingVertical: 12,
                                },
                            ]}
                        >
                            <Text style={{ color: '#64748b', fontSize: 7.5 }}>
                                Belum ada data pencatatan harian.
                            </Text>
                        </View>
                    ) : (
                        metrics.map((m, idx) => {
                            const isAlt = idx % 2 === 1;
                            const statusStyle =
                                m.status_code === 'good'
                                    ? styles.statusGood
                                    : m.status_code === 'fair'
                                      ? styles.statusFair
                                      : m.status_code === 'poor'
                                        ? styles.statusPoor
                                        : styles.statusEmpty;

                            return (
                                <View
                                    key={idx}
                                    wrap={false}
                                    style={[
                                        styles.tableRow,
                                        isAlt ? styles.tableRowAlt : {},
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: '13%' },
                                        ]}
                                    >
                                        {m.record_date}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: '15%' },
                                        ]}
                                    >
                                        {m.week}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '9%' },
                                        ]}
                                    >
                                        {m.rhr !== null && m.rhr > 0
                                            ? m.rhr.toFixed(1)
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '9%' },
                                        ]}
                                    >
                                        {m.spo2 !== null && m.spo2 > 0
                                            ? `${m.spo2.toFixed(1)}%`
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '8%' },
                                        ]}
                                    >
                                        {m.vj !== null && m.vj > 0
                                            ? m.vj.toFixed(1)
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '9%' },
                                        ]}
                                    >
                                        {m.weight !== null && m.weight > 0
                                            ? m.weight.toFixed(1)
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '11%' },
                                        ]}
                                    >
                                        {m.vo2_max !== null && m.vo2_max > 0
                                            ? m.vo2_max.toFixed(2)
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '12%' },
                                        ]}
                                    >
                                        {m.peak_power !== null &&
                                        m.peak_power > 0
                                            ? `${Math.round(m.peak_power).toLocaleString('id-ID')} W`
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '8%' },
                                        ]}
                                    >
                                        {m.quick_recovery_score !== null &&
                                        m.status_code !== 'empty'
                                            ? `${m.quick_recovery_score}%`
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            statusStyle,
                                            {
                                                width: '6%',
                                                textAlign: 'center',
                                                fontSize: 6.8,
                                            },
                                        ]}
                                    >
                                        {m.status_label}
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Running Footer on each page */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerBrand}>
                        Phynestra Sports Science — Dokumen resmi monitoring
                        kondisi fisik atlet
                    </Text>
                    <Text
                        style={styles.footerPage}
                        render={({ pageNumber, totalPages }) =>
                            `Halaman ${pageNumber} dari ${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    );
}

import {
    Circle,
    Document,
    G,
    Line,
    Page,
    Polyline,
    Rect,
    StyleSheet,
    Svg,
    Text,
    View,
} from '@react-pdf/renderer';
import type { RpeWeeklyReportData } from './types';

const styles = StyleSheet.create({
    page: {
        paddingTop: 22,
        paddingBottom: 32,
        paddingHorizontal: 24,
        fontSize: 8.5,
        fontFamily: 'Helvetica',
        color: '#0f172a',
        backgroundColor: '#ffffff',
    },
    // Header
    header: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#132e57',
        paddingBottom: 6,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    brandKicker: {
        fontSize: 6.8,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#1e4b8f',
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#132e57',
    },
    headerSub: {
        fontSize: 7.2,
        color: '#475569',
        marginTop: 1.5,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    headerDate: {
        fontSize: 7.2,
        color: '#475569',
    },
    // Modern Athlete Profile (clean, borderless-feel, no heavy grid)
    metaCard: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#e2e8f0',
        paddingVertical: 5.5,
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    metaCol: {
        flex: 1,
    },
    metaLabel: {
        fontSize: 5.8,
        fontWeight: 'bold',
        color: '#64748b',
        letterSpacing: 0.5,
        marginBottom: 1.5,
    },
    metaVal: {
        fontSize: 7.5,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    // Chart Cards & Grids
    gridRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    chartCard: {
        borderWidth: 0.5,
        borderColor: '#e2e8f0',
        borderRadius: 4,
        backgroundColor: '#ffffff',
        padding: 6,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    chartTitle: {
        fontSize: 7.5,
        fontWeight: 'bold',
        color: '#132e57',
        letterSpacing: 0.3,
    },
    chartSubtitle: {
        fontSize: 6.2,
        color: '#64748b',
        marginTop: 1,
    },
    chartAxisTick: {
        fontSize: 5.8,
        fill: '#64748b',
    },
    chartEmpty: {
        fontSize: 6.8,
        color: '#64748b',
        textAlign: 'center',
        paddingVertical: 30,
    },
    legendRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2.5,
    },
    legendText: {
        fontSize: 6,
        color: '#475569',
    },
    legendDot: {
        width: 4.5,
        height: 4.5,
        borderRadius: 2.25,
    },
    // Donut Gauge Specific
    donutCard: {
        borderWidth: 0.5,
        borderColor: '#e2e8f0',
        borderRadius: 4,
        backgroundColor: '#ffffff',
        padding: 6,
        width: 165,
        height: 156,
        justifyContent: 'space-between',
    },
    donutHeader: {
        marginBottom: 2,
    },
    donutFooter: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: '#f1f5f9',
        paddingTop: 4,
        marginTop: 2,
    },
    donutFooterCol: {
        flex: 1,
        alignItems: 'center',
    },
    donutFooterDivider: {
        width: 0.5,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 4,
    },
    donutFooterLabel: {
        fontSize: 5.5,
        color: '#64748b',
        marginBottom: 1,
    },
    donutFooterVal: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    // Section Header
    sectionTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#132e57',
        marginTop: 6,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    // Insights Cards (Clean Left-Accent, No Clunky Frame)
    insightsRow: {
        flexDirection: 'row',
        gap: 6,
    },
    insightCard: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#e2e8f0',
        borderLeftWidth: 3,
        borderRadius: 3,
        backgroundColor: '#f8fafc',
        padding: 5,
    },
    insightCat: {
        fontSize: 5.8,
        fontWeight: 'bold',
        color: '#64748b',
        letterSpacing: 0.3,
    },
    insightVal: {
        fontSize: 8.5,
        fontWeight: 'bold',
        color: '#132e57',
        marginVertical: 1,
    },
    insightTitle: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 1.5,
    },
    insightText: {
        fontSize: 6.4,
        color: '#334155',
        lineHeight: 1.25,
    },
    // Clean Modern Tables
    table: {
        borderWidth: 0.5,
        borderColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 3,
        marginBottom: 8,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#132e57',
        paddingVertical: 4.5,
    },
    tableHeaderCell: {
        fontSize: 6.8,
        fontWeight: 'bold',
        color: '#ffffff',
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f5f9',
        paddingVertical: 3.5,
    },
    tableRowAlt: {
        backgroundColor: '#f8fafc',
    },
    tableCell: {
        fontSize: 6.8,
        color: '#0f172a',
        paddingHorizontal: 4,
    },
    tableCellNum: {
        textAlign: 'right',
    },
    zoneOptimal: {
        color: '#059669',
        fontWeight: 'bold',
    },
    zoneCaution: {
        color: '#ea580c',
        fontWeight: 'bold',
    },
    zoneRisk: {
        color: '#e11d48',
        fontWeight: 'bold',
    },
    zoneUnder: {
        color: '#0284c7',
        fontWeight: 'bold',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 12,
        left: 24,
        right: 24,
        borderTopWidth: 0.5,
        borderTopColor: '#cbd5e1',
        paddingTop: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerBrand: {
        fontSize: 6.5,
        color: '#64748b',
    },
    footerPage: {
        fontSize: 6.5,
        color: '#64748b',
    },
});

function getInsightBorderColor(level: string): string {
    switch (level) {
        case 'optimal':
            return '#059669';
        case 'warning':
            return '#ea580c';
        case 'risk':
            return '#e11d48';
        default:
            return '#0284c7';
    }
}

function getZoneStyle(zone: string) {
    switch (zone) {
        case 'optimal':
            return styles.zoneOptimal;
        case 'caution':
            return styles.zoneCaution;
        case 'high_risk':
            return styles.zoneRisk;
        case 'undertraining':
            return styles.zoneUnder;
        default:
            return {};
    }
}

/**
 * 1. Donut Gauge Rasio ACWR Mingguan (Card Kiri Atas)
 * Menampilkan lingkaran gauge proporsional 0-2.00, nilai rasio, status zona,
 * serta metrik Acute (1W) dan Chronic (4W) di bagian bawah.
 */
function AcwrDonutGauge({
    latestWeek,
}: {
    latestWeek: RpeWeeklyReportData['latest_week'];
}) {
    const acwr = latestWeek?.acwr ?? null;
    const filled = acwr !== null ? Math.min(2.0, Math.max(0, acwr)) : 0;
    const ratio = filled / 2.0;

    let zoneColor = '#94a3b8';
    if (acwr !== null) {
        if (acwr < 0.8) {
            zoneColor = '#0284c7';
        } else if (acwr <= 1.3) {
            zoneColor = '#10b981';
        } else if (acwr <= 1.5) {
            zoneColor = '#ea580c';
        } else {
            zoneColor = '#e11d48';
        }
    }

    const width = 165;
    const cx = (width - 12) / 2;
    const cy = 40;
    const r = 28;
    const strokeWidth = 6.5;
    const circumference = 2 * Math.PI * r;
    const strokeDash = `${(ratio * circumference).toFixed(1)} ${circumference.toFixed(1)}`;

    return (
        <View style={styles.donutCard}>
            <View style={styles.donutHeader}>
                <Text style={styles.chartTitle}>RASIO ACWR MINGGUAN</Text>
                <Text style={styles.chartSubtitle}>
                    {latestWeek
                        ? `${latestWeek.week_label} · Basis ${latestWeek.session_count > 0 ? '4' : '0'} minggu`
                        : 'Basis 4 minggu'}
                </Text>
            </View>

            <Svg width={width - 12} height={80}>
                {/* Background track circle */}
                <Circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc starting at 12 o'clock */}
                <Circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={zoneColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    transform={`rotate(-90 ${cx} ${cy})`}
                />
                {/* Centered ACWR Value */}
                <Text
                    x={cx}
                    y={cy - 2}
                    style={{
                        fontSize: 13,
                        fontWeight: 'bold',
                        fill: '#0f172a',
                        textAnchor: 'middle',
                    }}
                >
                    {acwr !== null ? acwr.toFixed(2) : '-'}
                </Text>
                {/* Status Dot & Label */}
                <Text
                    x={cx}
                    y={cy + 9.5}
                    style={{
                        fontSize: 6.5,
                        fontWeight: 'bold',
                        fill: zoneColor,
                        textAnchor: 'middle',
                    }}
                >
                    {latestWeek?.zone_label
                        ? `• ${latestWeek.zone_label}`
                        : '—'}
                </Text>
            </Svg>

            <View style={styles.donutFooter}>
                <View style={styles.donutFooterCol}>
                    <Text style={styles.donutFooterLabel}>Acute (1W)</Text>
                    <Text style={styles.donutFooterVal}>
                        {latestWeek
                            ? `${latestWeek.acute_load.toLocaleString('id-ID')} AU`
                            : '-'}
                    </Text>
                </View>
                <View style={styles.donutFooterDivider} />
                <View style={styles.donutFooterCol}>
                    <Text style={styles.donutFooterLabel}>
                        Chronic (4W Avg)
                    </Text>
                    <Text style={styles.donutFooterVal}>
                        {latestWeek
                            ? `${Math.round(latestWeek.chronic_load).toLocaleString('id-ID')} AU`
                            : '-'}
                    </Text>
                </View>
            </View>
        </View>
    );
}

/**
 * 2. Grafik Tren Beban Mingguan (Acute vs Chronic) & ACWR (Kanan Atas)
 * Bar Bertumpuk: Chronic 4W (Bawah, #0d9488) + Acute (Atas, #132e57)
 * Garis: ACWR (Oranye, #ea580c), Batas Bahaya (Merah, #f43f5e)
 */
function RpeAcwrChart({
    summaries,
}: {
    summaries: RpeWeeklyReportData['weekly_summaries'];
}) {
    if (summaries.length === 0) {
        return (
            <View style={[styles.chartCard, { width: 362, height: 156 }]}>
                <Text style={styles.chartEmpty}>
                    Belum ada riwayat beban mingguan untuk divisualisasikan.
                </Text>
            </View>
        );
    }

    const data = [...summaries].reverse();
    const width = 362;
    const height = 156;
    const marginLeft = 28;
    const marginRight = 22;
    const marginTop = 10;
    const plotHeight = 82;
    const plotBottom = marginTop + plotHeight; // 92
    const plotWidth = width - marginLeft - marginRight;
    const plotLeft = marginLeft;
    const plotRight = marginLeft + plotWidth;

    const maxStackedAu = Math.max(
        8000,
        ...data.map((d) => (d.acute_load || 0) + (d.chronic_load || 0)),
    );
    const maxAu = Math.ceil(maxStackedAu / 2000) * 2000;
    const maxAcwr = 2.0;

    const auTicks = [0, 0.25, 0.5, 0.75, 1.0].map((r) =>
        Math.round(r * maxAu),
    );
    const acwrTicks = [0, 0.5, 1.0, 1.5, 2.0];

    const ySweetTop = plotBottom - (1.3 / maxAcwr) * plotHeight;
    const ySweetBottom = plotBottom - (0.8 / maxAcwr) * plotHeight;
    const yDanger = plotBottom - (1.5 / maxAcwr) * plotHeight;

    const N = data.length;
    const stepWidth = N > 0 ? plotWidth / N : plotWidth;
    const barWidth = Math.min(14, Math.max(6, stepWidth * 0.55));

    const acwrPoints: { cx: number; cy: number; val: number }[] = [];

    return (
        <View
            wrap={false}
            style={[styles.chartCard, { width: 362, height: 156 }]}
        >
            <View style={styles.chartHeader}>
                <View>
                    <Text style={styles.chartTitle}>
                        TREN BEBAN MINGGUAN (ACUTE VS CHRONIC) &amp; ACWR
                    </Text>
                    <Text style={styles.chartSubtitle}>
                        Zona optimal 0.80 - 1.30 · Batas bahaya &gt; 1.50
                    </Text>
                </View>
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#0d9488' },
                            ]}
                        />
                        <Text style={styles.legendText}>Chronic</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#132e57' },
                            ]}
                        />
                        <Text style={styles.legendText}>Acute</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#ea580c' },
                            ]}
                        />
                        <Text style={styles.legendText}>ACWR</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#f43f5e' },
                            ]}
                        />
                        <Text style={[styles.legendText, { color: '#e11d48' }]}>
                            &gt; 1.50
                        </Text>
                    </View>
                </View>
            </View>

            <Svg width={width - 12} height={height - 30}>
                {/* Sweet Spot Shaded Area */}
                <Rect
                    x={plotLeft}
                    y={ySweetTop}
                    width={plotWidth}
                    height={ySweetBottom - ySweetTop}
                    fill="#10b981"
                    fillOpacity={0.09}
                />
                {/* Danger 1.5 Line */}
                <Line
                    x1={plotLeft}
                    y1={yDanger}
                    x2={plotRight}
                    y2={yDanger}
                    stroke="#f43f5e"
                    strokeDasharray="4 3"
                    strokeWidth={0.75}
                />
                {/* Grid & Right ACWR Ticks */}
                {acwrTicks.map((tick) => {
                    const y = plotBottom - (tick / maxAcwr) * plotHeight;
                    return (
                        <G key={`acwr-grid-${tick}`}>
                            <Line
                                x1={plotLeft}
                                y1={y}
                                x2={plotRight}
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth={0.5}
                            />
                            <Text
                                x={plotRight + 2.5}
                                y={y + 2}
                                style={styles.chartAxisTick}
                            >
                                {tick.toFixed(tick % 1 === 0 ? 0 : 1)}
                            </Text>
                        </G>
                    );
                })}
                {/* Left AU Ticks */}
                {auTicks.map((tick) => {
                    const y = plotBottom - (tick / maxAu) * plotHeight;
                    return (
                        <Text
                            key={`au-tick-${tick}`}
                            x={plotLeft - 3.5}
                            y={y + 2}
                            style={[
                                styles.chartAxisTick,
                                { textAnchor: 'end' },
                            ]}
                        >
                            {tick >= 1000
                                ? `${(tick / 1000).toFixed(0)}k`
                                : String(tick)}
                        </Text>
                    );
                })}

                {/* Stacked Bars: Chronic Load (Bottom, Teal) + Acute Load (Top, Navy) */}
                {data.map((d, i) => {
                    const cx = plotLeft + (i + 0.5) * stepWidth;
                    const bx = cx - barWidth / 2;

                    const chronicH = Math.max(
                        0,
                        (d.chronic_load / maxAu) * plotHeight,
                    );
                    const chronicY = plotBottom - chronicH;

                    const acuteH = Math.max(
                        0,
                        (d.acute_load / maxAu) * plotHeight,
                    );
                    const acuteY = chronicY - acuteH;

                    if (d.acwr !== null && d.acwr > 0) {
                        const acwrY =
                            plotBottom - (d.acwr / maxAcwr) * plotHeight;
                        acwrPoints.push({ cx, cy: acwrY, val: d.acwr });
                    }

                    return (
                        <G key={`bar-${i}`}>
                            {/* Chronic Segment (Bottom) */}
                            {chronicH > 0 && (
                                <Rect
                                    x={bx}
                                    y={chronicY}
                                    width={barWidth}
                                    height={chronicH}
                                    fill="#0d9488"
                                    rx={1.5}
                                />
                            )}
                            {/* Acute Segment (Top) */}
                            {acuteH > 0 && (
                                <Rect
                                    x={bx}
                                    y={acuteY}
                                    width={barWidth}
                                    height={acuteH}
                                    fill="#132e57"
                                    rx={1.5}
                                />
                            )}
                            {stepWidth >= 13 && d.acute_load > 0 && (
                                <G
                                    transform={`rotate(-90 ${cx - 2} ${acuteY - 3})`}
                                >
                                    <Text
                                        x={cx - 2}
                                        y={acuteY - 3}
                                        style={{
                                            fontSize: 4.8,
                                            fill: '#132e57',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {d.acute_load.toLocaleString('id-ID')}
                                    </Text>
                                </G>
                            )}
                            <G
                                transform={`rotate(-90 ${cx} ${plotBottom + 26})`}
                            >
                                <Text
                                    x={cx}
                                    y={plotBottom + 26}
                                    style={{
                                        fontSize: 5.2,
                                        fill: '#64748b',
                                        textAnchor: 'start',
                                    }}
                                >
                                    {d.week_label}
                                </Text>
                            </G>
                        </G>
                    );
                })}

                {/* ACWR Line (Orange) */}
                {acwrPoints.length > 1 && (
                    <Polyline
                        points={acwrPoints
                            .map((p) => `${p.cx},${p.cy}`)
                            .join(' ')}
                        stroke="#ea580c"
                        strokeWidth={1.8}
                        fill="none"
                    />
                )}
                {acwrPoints.map((p, i) => (
                    <G key={`acwr-${i}`}>
                        <Circle
                            cx={p.cx}
                            cy={p.cy}
                            r={2.4}
                            fill="#ffffff"
                            stroke="#ea580c"
                            strokeWidth={1.2}
                        />
                        {stepWidth >= 13 && (
                            <G
                                transform={`rotate(-90 ${p.cx + 3.5} ${p.cy - 3})`}
                            >
                                <Text
                                    x={p.cx + 3.5}
                                    y={p.cy - 3}
                                    style={{
                                        fontSize: 5.2,
                                        fill: '#ea580c',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {p.val.toFixed(2)}
                                </Text>
                            </G>
                        )}
                    </G>
                ))}
            </Svg>
        </View>
    );
}

/**
 * 3. Grafik Tren Area ACWR Mingguan (Sweet Spot) (Kiri Bawah)
 * Area hijau 0.80 - 1.30, garis batas 1.50, dan kurva area biru
 */
function AcwrSweetSpotChart({
    summaries,
}: {
    summaries: RpeWeeklyReportData['weekly_summaries'];
}) {
    if (summaries.length === 0) {
        return (
            <View style={[styles.chartCard, { width: 263, height: 156 }]}>
                <Text style={styles.chartEmpty}>Belum ada riwayat ACWR.</Text>
            </View>
        );
    }

    const data = [...summaries].reverse();
    const width = 263;
    const height = 156;
    const marginLeft = 22;
    const marginRight = 14;
    const marginTop = 10;
    const plotHeight = 82;
    const plotBottom = marginTop + plotHeight; // 92
    const plotWidth = width - marginLeft - marginRight;
    const plotLeft = marginLeft;
    const plotRight = marginLeft + plotWidth;

    const maxAcwr = 2.0;
    const ticks = [0, 0.5, 1.0, 1.5, 2.0];

    const ySweetTop = plotBottom - (1.3 / maxAcwr) * plotHeight;
    const ySweetBottom = plotBottom - (0.8 / maxAcwr) * plotHeight;
    const yDanger = plotBottom - (1.5 / maxAcwr) * plotHeight;

    const N = data.length;
    const stepWidth = N > 0 ? plotWidth / N : plotWidth;

    const points: { cx: number; cy: number; val: number }[] = [];
    data.forEach((d, i) => {
        if (d.acwr !== null && d.acwr > 0) {
            const cx = plotLeft + (i + 0.5) * stepWidth;
            const cy =
                plotBottom - (Math.min(maxAcwr, d.acwr) / maxAcwr) * plotHeight;
            points.push({ cx, cy, val: d.acwr });
        }
    });

    return (
        <View
            wrap={false}
            style={[styles.chartCard, { width: 263, height: 156 }]}
        >
            <View style={styles.chartHeader}>
                <View>
                    <Text style={styles.chartTitle}>
                        TREN AREA ACWR (SWEET SPOT)
                    </Text>
                    <Text style={styles.chartSubtitle}>
                        Zona aman 0.80 - 1.30 (hijau)
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
                        <Text style={styles.legendText}>Sweet Spot</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#f43f5e' },
                            ]}
                        />
                        <Text style={[styles.legendText, { color: '#e11d48' }]}>
                            Batas 1.50
                        </Text>
                    </View>
                </View>
            </View>

            <Svg width={width - 12} height={height - 30}>
                {/* Sweet Spot Shaded Zone */}
                <Rect
                    x={plotLeft}
                    y={ySweetTop}
                    width={plotWidth}
                    height={ySweetBottom - ySweetTop}
                    fill="#10b981"
                    fillOpacity={0.09}
                />
                {/* Danger 1.5 line */}
                <Line
                    x1={plotLeft}
                    y1={yDanger}
                    x2={plotRight}
                    y2={yDanger}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    strokeWidth={0.75}
                />
                {/* Y-axis Ticks & Grid */}
                {ticks.map((t) => {
                    const y = plotBottom - (t / maxAcwr) * plotHeight;
                    return (
                        <G key={`sweet-grid-${t}`}>
                            <Line
                                x1={plotLeft}
                                y1={y}
                                x2={plotRight}
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth={0.5}
                            />
                            <Text
                                x={plotLeft - 3.5}
                                y={y + 2}
                                style={[
                                    styles.chartAxisTick,
                                    { textAnchor: 'end' },
                                ]}
                            >
                                {t.toFixed(t % 1 === 0 ? 0 : 1)}
                            </Text>
                        </G>
                    );
                })}

                {/* Area Fill under ACWR Line */}
                {points.length > 1 && (
                    <Polyline
                        points={[
                            `${points[0].cx},${plotBottom}`,
                            ...points.map((p) => `${p.cx},${p.cy}`),
                            `${points[points.length - 1].cx},${plotBottom}`,
                        ].join(' ')}
                        fill="#1d4ed8"
                        fillOpacity={0.08}
                        stroke="none"
                    />
                )}
                {/* ACWR Blue Polyline */}
                {points.length > 1 && (
                    <Polyline
                        points={points.map((p) => `${p.cx},${p.cy}`).join(' ')}
                        stroke="#1d4ed8"
                        strokeWidth={1.8}
                        fill="none"
                    />
                )}
                {/* Points & Labels */}
                {points.map((p, i) => (
                    <G key={`spt-${i}`}>
                        <Circle
                            cx={p.cx}
                            cy={p.cy}
                            r={2.4}
                            fill="#ffffff"
                            stroke="#1d4ed8"
                            strokeWidth={1.2}
                        />
                        {stepWidth >= 13 && (
                            <G
                                transform={`rotate(-90 ${p.cx + 3.5} ${p.cy - 3})`}
                            >
                                <Text
                                    x={p.cx + 3.5}
                                    y={p.cy - 3}
                                    style={{
                                        fontSize: 5.2,
                                        fill: '#1d4ed8',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {p.val.toFixed(2)}
                                </Text>
                            </G>
                        )}
                    </G>
                ))}
                {/* X-axis week labels */}
                {data.map((d, i) => {
                    const cx = plotLeft + (i + 0.5) * stepWidth;
                    return (
                        <G
                            key={`sx-${i}`}
                            transform={`rotate(-90 ${cx} ${plotBottom + 26})`}
                        >
                            <Text
                                x={cx}
                                y={plotBottom + 26}
                                style={{
                                    fontSize: 5.2,
                                    fill: '#64748b',
                                    textAnchor: 'start',
                                }}
                            >
                                {d.week_label}
                            </Text>
                        </G>
                    );
                })}
            </Svg>
        </View>
    );
}

function DailyLoadChart({
    dailyLoads,
}: {
    dailyLoads?: RpeWeeklyReportData['daily_loads'];
}) {
    const data = dailyLoads ?? [];
    if (data.length === 0) {
        return (
            <View style={[styles.chartCard, { width: 264, height: 156 }]}>
                <Text style={styles.chartEmpty}>
                    Belum ada data sesi latihan harian.
                </Text>
            </View>
        );
    }

    const width = 264;
    const height = 156;
    const marginLeft = 26;
    const marginRight = 14;
    const marginTop = 10;
    const plotHeight = 82;
    const plotBottom = marginTop + plotHeight; // 92
    const plotWidth = width - marginLeft - marginRight;
    const plotLeft = marginLeft;
    const plotRight = marginLeft + plotWidth;

    const maxLoad = Math.max(1200, ...data.map((d) => d.daily_load || 0));
    const maxScale = Math.ceil(maxLoad / 300) * 300;
    const ticks = [
        0,
        maxScale * 0.25,
        maxScale * 0.5,
        maxScale * 0.75,
        maxScale,
    ];

    const N = data.length;
    const stepWidth = N > 0 ? plotWidth / N : plotWidth;
    const barWidth = Math.min(10, Math.max(5, stepWidth * 0.62));

    return (
        <View
            wrap={false}
            style={[styles.chartCard, { width: 264, height: 156 }]}
        >
            <View style={styles.chartHeader}>
                <View>
                    <Text style={styles.chartTitle}>
                        DISTRIBUSI BEBAN HARIAN
                    </Text>
                    <Text style={styles.chartSubtitle}>
                        14 hari terakhir (AU)
                    </Text>
                </View>
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: '#132e57' },
                            ]}
                        />
                        <Text style={styles.legendText}>Beban Harian</Text>
                    </View>
                </View>
            </View>

            <Svg width={width - 12} height={height - 30}>
                {/* Y-axis Ticks & Grid */}
                {ticks.map((t) => {
                    const y = plotBottom - (t / maxScale) * plotHeight;
                    return (
                        <G key={`dl-tick-${t}`}>
                            <Line
                                x1={plotLeft}
                                y1={y}
                                x2={plotRight}
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth={0.5}
                            />
                            <Text
                                x={plotLeft - 3.5}
                                y={y + 2}
                                style={[
                                    styles.chartAxisTick,
                                    { textAnchor: 'end' },
                                ]}
                            >
                                {t >= 1000
                                    ? `${(t / 1000).toFixed(1)}k`
                                    : String(Math.round(t))}
                            </Text>
                        </G>
                    );
                })}

                {/* Daily Load Bars */}
                {data.map((d, i) => {
                    const cx = plotLeft + (i + 0.5) * stepWidth;
                    const bh = Math.max(
                        0,
                        (d.daily_load / maxScale) * plotHeight,
                    );
                    const by = plotBottom - bh;
                    const bx = cx - barWidth / 2;

                    return (
                        <G key={`dbar-${i}`}>
                            <Rect
                                x={bx}
                                y={by}
                                width={barWidth}
                                height={bh}
                                fill="#132e57"
                                rx={1.5}
                            />
                            {d.daily_load > 0 && (
                                <G
                                    transform={`rotate(-90 ${cx - 1.8} ${by - 3})`}
                                >
                                    <Text
                                        x={cx - 1.8}
                                        y={by - 3}
                                        style={{
                                            fontSize: 4.8,
                                            fill: '#132e57',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {d.daily_load.toLocaleString('id-ID')}
                                    </Text>
                                </G>
                            )}
                            <G
                                transform={`rotate(-90 ${cx} ${plotBottom + 26})`}
                            >
                                <Text
                                    x={cx}
                                    y={plotBottom + 26}
                                    style={{
                                        fontSize: 5,
                                        fill: '#64748b',
                                        textAnchor: 'start',
                                    }}
                                >
                                    {d.date_label}
                                </Text>
                            </G>
                        </G>
                    );
                })}
            </Svg>
        </View>
    );
}

export function RpeWeeklyPdfDocument({ data }: { data: RpeWeeklyReportData }) {
    const {
        athlete,
        latest_week,
        insights,
        weekly_summaries,
        daily_loads,
        recent_sessions,
        generated_at,
    } = data;

    return (
        <Document
            title={`Laporan RPE & ACWR Weekly - ${athlete.name}`}
            author="Phynestra Sports Science"
            subject="Monitoring Beban Latihan dan ACWR Mingguan"
        >
            {/* ============================================================ */}
            {/* HALAMAN 1: EXECUTIVE VISUAL DASHBOARD                        */}
            {/* ============================================================ */}
            <Page size="A4" style={styles.page}>
                {/* Header Dokumen */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandKicker}>
                            PHYNESTRA SPORTS SCIENCE
                        </Text>
                        <Text style={styles.headerTitle}>
                            LAPORAN BEBAN LATIHAN (RPE) &amp; ACWR
                        </Text>
                        <Text style={styles.headerSub}>
                            Session-RPE (Borg CR-10) · Coupled Rolling Average
                            (4-Week Basis)
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.headerDate}>
                            Dicetak: {generated_at}
                        </Text>
                    </View>
                </View>

                {/* Profil Atlet Modern (Minimalis, Bebas Kerangka Kotak Tebal) */}
                <View style={styles.metaCard}>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>NAMA ATLET</Text>
                        <Text style={styles.metaVal}>{athlete.name}</Text>
                    </View>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>CABANG / POSISI</Text>
                        <Text style={styles.metaVal}>
                            {athlete.sport_branch}
                            {athlete.position ? ` · ${athlete.position}` : ''}
                        </Text>
                    </View>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>TOTAL SESI</Text>
                        <Text style={styles.metaVal}>
                            {athlete.total_sessions} sesi tercatat
                        </Text>
                    </View>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>RENTANG WAKTU</Text>
                        <Text style={styles.metaVal}>
                            {data.period.start_date ?? '-'} s.d.{' '}
                            {data.period.end_date ?? '-'}
                        </Text>
                    </View>
                </View>

                {/* Baris Visual 1: Donut Gauge ACWR (Kiri) + Tren Acute vs Chronic & ACWR (Kanan) */}
                <View style={styles.gridRow}>
                    <AcwrDonutGauge latestWeek={latest_week} />
                    <RpeAcwrChart summaries={weekly_summaries} />
                </View>

                {/* Baris Visual 2: Tren Area ACWR Sweet Spot (Kiri) + Distribusi Beban Harian 14 Hari (Kanan) */}
                <View style={styles.gridRow}>
                    <AcwrSweetSpotChart summaries={weekly_summaries} />
                    <DailyLoadChart dailyLoads={daily_loads} />
                </View>

                {/* Automated Workload Insights (Elegan, Aksen Garis Kiri, Tanpa Kotak Tebal) */}
                {insights.length > 0 && (
                    <View wrap={false}>
                        <Text style={styles.sectionTitle}>
                            AUTOMATED WORKLOAD INSIGHTS
                        </Text>
                        <View style={styles.insightsRow}>
                            {insights.map((ins, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.insightCard,
                                        {
                                            borderLeftColor:
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

                {/* Running Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerBrand}>
                        Phynestra Sports Science — Dokumen resmi monitoring
                        beban latihan &amp; ACWR atlet
                    </Text>
                    <Text
                        style={styles.footerPage}
                        render={({ pageNumber, totalPages }) =>
                            `Halaman ${pageNumber} dari ${totalPages}`
                        }
                    />
                </View>
            </Page>

            {/* ============================================================ */}
            {/* HALAMAN 2: TABEL DATA HISTORIS LENGKAP                       */}
            {/* ============================================================ */}
            <Page size="A4" style={styles.page}>
                {/* Running Header Halaman 2 */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandKicker}>
                            PHYNESTRA SPORTS SCIENCE
                        </Text>
                        <Text style={styles.headerTitle}>
                            TABEL HISTORIS REKAP ACWR &amp; SESI LATIHAN
                        </Text>
                        <Text style={styles.headerSub}>
                            {athlete.name} · {athlete.sport_branch}
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.headerDate}>
                            Dicetak: {generated_at}
                        </Text>
                    </View>
                </View>

                {/* Tabel Rekap ACWR Mingguan (Per 7 Hari) */}
                <Text style={styles.sectionTitle}>
                    REKAP ACWR MINGGUAN (PER 7 HARI)
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <Text
                            style={[styles.tableHeaderCell, { width: '11%' }]}
                        >
                            Minggu
                        </Text>
                        <Text
                            style={[styles.tableHeaderCell, { width: '22%' }]}
                        >
                            Rentang Tanggal
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '7%' },
                            ]}
                        >
                            Sesi
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '12%' },
                            ]}
                        >
                            Acute (AU)
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '13%' },
                            ]}
                        >
                            Chronic (AU)
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '9%' },
                            ]}
                        >
                            ACWR
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '13%' },
                            ]}
                        >
                            Perubahan %
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '13%' },
                            ]}
                        >
                            Monotony
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '13%' },
                            ]}
                        >
                            Strain
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: '11%', textAlign: 'center' },
                            ]}
                        >
                            Zona
                        </Text>
                    </View>

                    {weekly_summaries.map((w, idx) => {
                        const isAlt = idx % 2 === 1;
                        return (
                            <View
                                key={idx}
                                style={[
                                    styles.tableRow,
                                    isAlt ? styles.tableRowAlt : {},
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { width: '11%', fontWeight: 'bold' },
                                    ]}
                                >
                                    {w.week_label}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        { width: '22%', color: '#475569' },
                                    ]}
                                >
                                    {w.week_range}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        styles.tableCellNum,
                                        { width: '7%' },
                                    ]}
                                >
                                    {w.session_count}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        styles.tableCellNum,
                                        { width: '12%', fontWeight: 'bold' },
                                    ]}
                                >
                                    {w.acute_load.toLocaleString('id-ID')}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        styles.tableCellNum,
                                        { width: '13%' },
                                    ]}
                                >
                                    {Math.round(w.chronic_load).toLocaleString(
                                        'id-ID',
                                    )}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        styles.tableCellNum,
                                        { width: '9%', fontWeight: 'bold' },
                                    ]}
                                >
                                    {w.acwr !== null ? w.acwr.toFixed(2) : '-'}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        styles.tableCellNum,
                                        { width: '13%' },
                                    ]}
                                >
                                    {w.week_change_pct !== null
                                        ? `${w.week_change_pct > 0 ? '+' : ''}${w.week_change_pct.toFixed(1)}%`
                                        : '-'}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        styles.tableCellNum,
                                        { width: '13%' },
                                    ]}
                                >
                                    {w.monotony.toFixed(2)}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        styles.tableCellNum,
                                        { width: '13%' },
                                    ]}
                                >
                                    {Math.round(w.strain).toLocaleString(
                                        'id-ID',
                                    )}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        getZoneStyle(w.zone),
                                        { width: '11%', textAlign: 'center' },
                                    ]}
                                >
                                    {w.zone_label}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Tabel Riwayat Sesi RPE Terbaru */}
                {recent_sessions.length > 0 && (
                    <View wrap={false}>
                        <Text style={styles.sectionTitle}>
                            RIWAYAT SESI LATIHAN TERBARU (MAKS. 20 SESI)
                        </Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '15%' },
                                    ]}
                                >
                                    Tanggal
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '20%' },
                                    ]}
                                >
                                    Tipe Sesi
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        styles.tableCellNum,
                                        { width: '11%' },
                                    ]}
                                >
                                    Durasi
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        styles.tableCellNum,
                                        { width: '9%' },
                                    ]}
                                >
                                    RPE
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        styles.tableCellNum,
                                        { width: '13%' },
                                    ]}
                                >
                                    Beban (AU)
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '32%' },
                                    ]}
                                >
                                    Catatan
                                </Text>
                            </View>

                            {recent_sessions.map((s, idx) => {
                                const isAlt = idx % 2 === 1;
                                return (
                                    <View
                                        key={idx}
                                        style={[
                                            styles.tableRow,
                                            isAlt ? styles.tableRowAlt : {},
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                { width: '15%' },
                                            ]}
                                        >
                                            {s.session_date}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                { width: '20%' },
                                            ]}
                                        >
                                            {s.session_type_label}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                styles.tableCellNum,
                                                { width: '11%' },
                                            ]}
                                        >
                                            {s.duration_minutes} mnt
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                styles.tableCellNum,
                                                { width: '9%' },
                                            ]}
                                        >
                                            {s.rpe} / 10
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                styles.tableCellNum,
                                                {
                                                    width: '13%',
                                                    fontWeight: 'bold',
                                                },
                                            ]}
                                        >
                                            {s.session_load.toLocaleString(
                                                'id-ID',
                                            )}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                {
                                                    width: '32%',
                                                    color: '#64748b',
                                                },
                                            ]}
                                        >
                                            {s.notes ?? '-'}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Running Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerBrand}>
                        Phynestra Sports Science — Dokumen resmi monitoring
                        beban latihan &amp; ACWR atlet
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

export const RpeWeeklyPdf = RpeWeeklyPdfDocument;

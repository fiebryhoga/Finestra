import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { RpeWeeklyReportData } from './types';

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
    badgeOfficial: {
        marginTop: 3,
        fontSize: 7,
        fontWeight: 'bold',
        color: '#059669',
        backgroundColor: '#ecfdf5',
        borderWidth: 0.5,
        borderColor: '#a7f3d0',
        paddingHorizontal: 5,
        paddingVertical: 1.5,
        borderRadius: 3,
    },
    sectionTitle: {
        fontSize: 8.5,
        fontWeight: 'bold',
        color: '#132e57',
        marginTop: 10,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    // Meta Table
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
    // Summary KPI Cards
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
    // Insights Cards
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
    // Tables
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
    zoneOptimal: {
        color: '#059669',
        fontWeight: 'bold',
    },
    zoneCaution: {
        color: '#d97706',
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

export function RpeWeeklyPdfDocument({ data }: { data: RpeWeeklyReportData }) {
    const {
        athlete,
        latest_week,
        insights,
        weekly_summaries,
        recent_sessions,
        generated_at,
    } = data;

    const latestAcwr = latest_week?.acwr ?? null;
    const latestZoneBorderColor =
        latest_week?.zone === 'optimal'
            ? '#059669'
            : latest_week?.zone === 'caution'
              ? '#d97706'
              : latest_week?.zone === 'high_risk'
                ? '#e11d48'
                : '#132e57';

    return (
        <Document
            title={`Laporan RPE & ACWR Weekly - ${athlete.name}`}
            author="Phynestra Sports Science"
            subject="Monitoring Beban Latihan dan ACWR Mingguan"
        >
            <Page size="A4" style={styles.page}>
                {/* Header */}
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
                        <Text style={styles.badgeOfficial}>DOKUMEN RESMI</Text>
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
                    <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.metaCellLabel}>
                            Total Sesi Latihan
                        </Text>
                        <Text style={styles.metaCellValue}>
                            {athlete.total_sessions} sesi tercatat
                        </Text>
                        <Text style={styles.metaCellLabel}>Rentang Sesi</Text>
                        <Text
                            style={[
                                styles.metaCellValue,
                                { borderRightWidth: 0 },
                            ]}
                        >
                            {data.period.start_date ?? '-'} s.d.{' '}
                            {data.period.end_date ?? '-'}
                        </Text>
                    </View>
                </View>

                {/* Summary KPI Cards for Latest Week */}
                <View style={styles.summaryRow}>
                    <View
                        style={[
                            styles.summaryCard,
                            { borderTopColor: latestZoneBorderColor },
                        ]}
                    >
                        <Text style={styles.summaryLabel}>
                            Rasio ACWR{' '}
                            {latest_week ? `(${latest_week.week_label})` : ''}
                        </Text>
                        <Text style={styles.summaryValue}>
                            {latestAcwr !== null ? (
                                <>
                                    {latestAcwr.toFixed(2)}{' '}
                                    <Text style={styles.summaryUnit}>
                                        ({latest_week?.zone_label})
                                    </Text>
                                </>
                            ) : (
                                '-'
                            )}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Acute Load (1W)</Text>
                        <Text style={styles.summaryValue}>
                            {latest_week ? (
                                <>
                                    {latest_week.acute_load.toLocaleString(
                                        'id-ID',
                                    )}{' '}
                                    <Text style={styles.summaryUnit}>AU</Text>
                                </>
                            ) : (
                                '-'
                            )}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>
                            Chronic Load (4W)
                        </Text>
                        <Text style={styles.summaryValue}>
                            {latest_week ? (
                                <>
                                    {Math.round(
                                        latest_week.chronic_load,
                                    ).toLocaleString('id-ID')}{' '}
                                    <Text style={styles.summaryUnit}>AU</Text>
                                </>
                            ) : (
                                '-'
                            )}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>
                            Monotony / Strain
                        </Text>
                        <Text style={styles.summaryValue}>
                            {latest_week ? (
                                <>
                                    {latest_week.monotony.toFixed(2)}{' '}
                                    <Text style={styles.summaryUnit}>
                                        /{' '}
                                        {Math.round(
                                            latest_week.strain,
                                        ).toLocaleString('id-ID')}{' '}
                                        AU
                                    </Text>
                                </>
                            ) : (
                                '-'
                            )}
                        </Text>
                    </View>
                </View>

                {/* Automated Workload Insights */}
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

                {/* Weekly ACWR Recap Table */}
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
                            style={[styles.tableHeaderCell, { width: '19%' }]}
                        >
                            Rentang Tanggal
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '6%' },
                            ]}
                        >
                            Sesi
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '11%' },
                            ]}
                        >
                            Acute (AU)
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '12%' },
                            ]}
                        >
                            Chronic (AU)
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '8%' },
                            ]}
                        >
                            ACWR
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '9%' },
                            ]}
                        >
                            Δ Minggu
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '8%' },
                            ]}
                        >
                            Monotony
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                styles.tableCellNum,
                                { width: '8%' },
                            ]}
                        >
                            Strain
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: '8%', textAlign: 'center' },
                            ]}
                        >
                            Zona
                        </Text>
                    </View>

                    {weekly_summaries.length === 0 ? (
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
                                Belum ada data beban mingguan.
                            </Text>
                        </View>
                    ) : (
                        weekly_summaries.map((w, idx) => {
                            const isAlt = idx % 2 === 1;
                            const zoneStyle = getZoneStyle(w.zone);

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
                                            { width: '11%' },
                                        ]}
                                    >
                                        {w.week_label}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: '19%' },
                                        ]}
                                    >
                                        {w.week_range}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '6%' },
                                        ]}
                                    >
                                        {w.session_count}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '11%' },
                                        ]}
                                    >
                                        {w.acute_load.toLocaleString('id-ID')}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '12%' },
                                        ]}
                                    >
                                        {Math.round(
                                            w.chronic_load,
                                        ).toLocaleString('id-ID')}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '8%' },
                                        ]}
                                    >
                                        {w.acwr !== null
                                            ? w.acwr.toFixed(2)
                                            : '-'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '9%' },
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
                                            { width: '8%' },
                                        ]}
                                    >
                                        {w.monotony.toFixed(2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.tableCellNum,
                                            { width: '8%' },
                                        ]}
                                    >
                                        {Math.round(w.strain).toLocaleString(
                                            'id-ID',
                                        )}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            zoneStyle,
                                            {
                                                width: '8%',
                                                textAlign: 'center',
                                                fontSize: 6.8,
                                            },
                                        ]}
                                    >
                                        {w.zone_label}
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Recent Sessions Table */}
                {recent_sessions.length > 0 && (
                    <View wrap={false} style={{ marginTop: 10 }}>
                        <Text style={styles.sectionTitle}>
                            RIWAYAT SESI RPE TERBARU (MAKS. 20 SESI)
                        </Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '14%' },
                                    ]}
                                >
                                    Tanggal
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '18%' },
                                    ]}
                                >
                                    Jenis Sesi
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
                                    sRPE
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        styles.tableCellNum,
                                        { width: '13%' },
                                    ]}
                                >
                                    Load (AU)
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: '35%' },
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
                                        wrap={false}
                                        style={[
                                            styles.tableRow,
                                            isAlt ? styles.tableRowAlt : {},
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                { width: '14%' },
                                            ]}
                                        >
                                            {s.session_date}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                { width: '18%' },
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
                                                { width: '13%' },
                                            ]}
                                        >
                                            {s.session_load.toLocaleString(
                                                'id-ID',
                                            )}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                { width: '35%' },
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

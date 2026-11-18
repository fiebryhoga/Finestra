<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan RPE &amp; ACWR Weekly - {{ $athlete->name }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 14mm 14mm 16mm 14mm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9px;
            color: #0f172a;
            margin: 0;
            padding: 0;
            line-height: 1.35;
        }

        .pdf-footer {
            position: fixed;
            bottom: -10mm;
            left: 0;
            right: 0;
            border-top: 1px solid #cbd5e1;
            padding-top: 5px;
            font-size: 7.5px;
            color: #64748b;
        }

        .pdf-footer table {
            width: 100%;
            border-collapse: collapse;
        }

        .pdf-footer td {
            padding: 0;
            border: none;
        }

        .header {
            border-bottom: 2px solid #132e57;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            padding: 0;
            border: none;
            vertical-align: bottom;
        }

        .brand-kicker {
            font-size: 7.5px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #1e4b8f;
            margin: 0 0 2px 0;
        }

        .header-title {
            font-size: 15px;
            font-weight: bold;
            color: #132e57;
            margin: 0;
        }

        .header-sub {
            font-size: 8px;
            color: #475569;
            margin-top: 2px;
        }

        .header-right {
            text-align: right;
            font-size: 8px;
            color: #475569;
        }

        .header-right strong {
            display: block;
            font-size: 10px;
            color: #0f172a;
            margin-bottom: 2px;
        }

        .section-title {
            font-size: 9px;
            font-weight: bold;
            color: #132e57;
            margin: 12px 0 5px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .meta-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .meta-table td {
            padding: 4px 7px;
            border: 1px solid #cbd5e1;
            font-size: 8.5px;
        }

        .meta-label {
            background: #f1f5f9;
            color: #334155;
            font-weight: bold;
        }

        .summary-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 6px 0;
            margin: 0 -6px;
            table-layout: fixed;
        }

        .summary-table td {
            width: 25%;
            border: 1px solid #cbd5e1;
            border-top: 2.5px solid #132e57;
            padding: 7px 8px;
            background: #f8fafc;
            vertical-align: top;
        }

        .summary-label {
            font-size: 7.5px;
            color: #475569;
            margin-bottom: 3px;
        }

        .summary-value {
            font-size: 13px;
            font-weight: bold;
            color: #132e57;
        }

        .summary-unit {
            font-size: 8px;
            font-weight: normal;
            color: #64748b;
        }

        .insights-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 6px 0;
            margin: 0 -6px;
            table-layout: fixed;
            page-break-inside: avoid;
        }

        .insights-table td {
            width: 33.33%;
            border: 1px solid #cbd5e1;
            border-top: 2.5px solid #132e57;
            padding: 6px 8px;
            background: #f8fafc;
            vertical-align: top;
        }

        .insights-table td.insight-optimal { border-top-color: #059669; }
        .insights-table td.insight-warning { border-top-color: #d97706; }
        .insights-table td.insight-risk { border-top-color: #e11d48; }
        .insights-table td.insight-info { border-top-color: #0284c7; }

        .insight-cat {
            font-size: 7px;
            font-weight: bold;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .insight-val {
            font-size: 9.5px;
            font-weight: bold;
            color: #132e57;
            margin: 2px 0;
        }

        .insight-title {
            font-size: 8.5px;
            font-weight: bold;
            color: #0f172a;
            margin: 2px 0 3px 0;
        }

        .insight-text {
            font-size: 7.5px;
            color: #334155;
            margin: 0;
            line-height: 1.35;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .data-table thead {
            display: table-header-group;
        }

        .data-table tr {
            page-break-inside: avoid;
        }

        .data-table th {
            background: #132e57;
            color: #ffffff;
            font-weight: bold;
            font-size: 7.5px;
            padding: 5px 4px;
            border: 1px solid #132e57;
            text-align: left;
        }

        .data-table th.num,
        .data-table td.num {
            text-align: right;
        }

        .data-table td {
            padding: 4px 4px;
            border: 1px solid #cbd5e1;
            font-size: 8px;
            vertical-align: middle;
            word-wrap: break-word;
        }

        .data-table tbody tr:nth-child(even) td {
            background: #f8fafc;
        }

        .zone-optimal { color: #047857; font-weight: bold; }
        .zone-caution { color: #b45309; font-weight: bold; }
        .zone-high_risk { color: #be123c; font-weight: bold; }
        .zone-undertraining { color: #0369a1; font-weight: bold; }
        .zone-no_data { color: #64748b; }
    </style>
</head>
<body>
    <div class="pdf-footer">
        <table>
            <tr>
                <td style="text-align: left;">Finestra · Monitoring Beban Latihan (sRPE &amp; ACWR Weekly) · FIKK UNESA</td>
                <td style="text-align: right;">Dicetak {{ $generatedAt }}</td>
            </tr>
        </table>
    </div>

    <div class="header">
        <table class="header-table">
            <tr>
                <td style="width: 68%;">
                    <p class="brand-kicker">Finestra Sports Science</p>
                    <p class="header-title">Laporan Beban Latihan (sRPE) &amp; ACWR Weekly</p>
                    <div class="header-sub">
                        Metode Foster CR-10 &amp; Gabbett Coupled 4-Week Rolling Average · FIKK UNESA
                    </div>
                </td>
                <td class="header-right" style="width: 32%;">
                    <strong>{{ $athlete->name }}</strong>
                    {{ $totalSessions }} sesi tercatat · {{ count($weeklySummaries) }} minggu berjalan
                </td>
            </tr>
        </table>
    </div>

    <div class="section-title">Profil Atlet</div>
    <table class="meta-table">
        <tr>
            <td class="meta-label" style="width: 19%;">Nama Atlet</td>
            <td style="width: 31%;">{{ $athlete->name }}</td>
            <td class="meta-label" style="width: 20%;">Jenis Kelamin</td>
            <td style="width: 30%;">{{ $athlete->gender->label() }}</td>
        </tr>
        <tr>
            <td class="meta-label">Usia</td>
            <td>{{ $athlete->age() }} tahun ({{ $athlete->date_of_birth->format('d M Y') }})</td>
            <td class="meta-label">Antropometri</td>
            <td>{{ number_format($athlete->weight_kg, 1) }} kg / {{ number_format($athlete->height_cm, 1) }} cm</td>
        </tr>
    </table>

    <div class="section-title">
        Ringkasan Minggu Terbaru {{ $latestWeek ? '(' . $latestWeek['week_label'] . ' · ' . $latestWeek['week_range'] . ')' : '' }}
    </div>
    @php
        $acwrBorder = '#132e57';
        if ($latestWeek !== null) {
            $acwrBorder = match ($latestWeek['zone']) {
                'optimal' => '#059669',
                'caution' => '#d97706',
                'high_risk' => '#e11d48',
                'undertraining' => '#0284c7',
                default => '#132e57',
            };
        }
    @endphp
    <table class="summary-table">
        <tr>
            <td style="border-top-color: {{ $acwrBorder }};">
                <div class="summary-label">ACWR Mingguan</div>
                <div class="summary-value">
                    {{ $latestWeek && $latestWeek['acwr'] !== null ? number_format($latestWeek['acwr'], 2) : '-' }}
                    @if ($latestWeek)
                        <span class="summary-unit">({{ $latestWeek['zone_label'] }})</span>
                    @endif
                </div>
            </td>
            <td>
                <div class="summary-label">Acute Load (Minggu Ini)</div>
                <div class="summary-value">
                    {{ $latestWeek ? number_format($latestWeek['acute_load']) : '-' }}
                    @if ($latestWeek)
                        <span class="summary-unit">AU</span>
                    @endif
                </div>
            </td>
            <td>
                <div class="summary-label">Chronic Load (4W Avg)</div>
                <div class="summary-value">
                    {{ $latestWeek ? number_format($latestWeek['chronic_load'], 1) : '-' }}
                    @if ($latestWeek)
                        <span class="summary-unit">AU</span>
                    @endif
                </div>
            </td>
            <td>
                <div class="summary-label">Monotony / Strain</div>
                <div class="summary-value">
                    {{ $latestWeek ? number_format($latestWeek['monotony'], 2) : '-' }}
                    @if ($latestWeek)
                        <span class="summary-unit">/ {{ number_format($latestWeek['strain']) }} AU</span>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    @if (! empty($insights))
        <div class="section-title">Automated Workload Insights</div>
        <table class="insights-table">
            <tr>
                @foreach ($insights as $insight)
                    <td class="insight-{{ $insight['level'] }}">
                        <div class="insight-cat">{{ $insight['category'] }}</div>
                        <div class="insight-val">{{ $insight['value'] }}</div>
                        <div class="insight-title">{{ $insight['title'] }}</div>
                        <p class="insight-text">{{ $insight['summary'] }}</p>
                    </td>
                @endforeach
            </tr>
        </table>
    @endif

    <div class="section-title">Rekap ACWR Mingguan (Per 7 Hari Sejak Input Pertama)</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 11%;">Minggu</th>
                <th style="width: 19%;">Rentang Tanggal</th>
                <th class="num" style="width: 6%;">Sesi</th>
                <th class="num" style="width: 11%;">Acute (AU)</th>
                <th class="num" style="width: 11%;">Chronic (AU)</th>
                <th class="num" style="width: 8%;">ACWR</th>
                <th class="num" style="width: 9%;">Δ Minggu</th>
                <th class="num" style="width: 8%;">Monotony</th>
                <th class="num" style="width: 8%;">Strain</th>
                <th style="width: 9%;">Zona</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($weeklySummaries as $week)
                <tr>
                    <td>{{ $week['week_label'] }}</td>
                    <td>{{ $week['week_range'] }}</td>
                    <td class="num">{{ $week['session_count'] }}</td>
                    <td class="num">{{ number_format($week['acute_load']) }}</td>
                    <td class="num">{{ number_format($week['chronic_load'], 1) }}</td>
                    <td class="num">{{ $week['acwr'] !== null ? number_format($week['acwr'], 2) : '-' }}</td>
                    <td class="num">
                        @if ($week['week_change_pct'] !== null)
                            {{ $week['week_change_pct'] > 0 ? '+' : '' }}{{ number_format($week['week_change_pct'], 1) }}%
                        @else
                            -
                        @endif
                    </td>
                    <td class="num">{{ number_format($week['monotony'], 2) }}</td>
                    <td class="num">{{ number_format($week['strain']) }}</td>
                    <td class="zone-{{ $week['zone'] }}">{{ $week['zone_label'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" style="text-align: center; color: #64748b; padding: 12px;">
                        Belum ada data sesi RPE.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    @if ($recentSessions->isNotEmpty())
        <div class="section-title">Riwayat Sesi RPE Terbaru (Maks. 20 Sesi)</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 14%;">Tanggal</th>
                    <th style="width: 18%;">Jenis Sesi</th>
                    <th class="num" style="width: 11%;">Durasi</th>
                    <th class="num" style="width: 9%;">sRPE</th>
                    <th class="num" style="width: 13%;">Load (AU)</th>
                    <th style="width: 35%;">Catatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($recentSessions as $session)
                    <tr>
                        <td>{{ $session->session_date->format('d M Y') }}</td>
                        <td>{{ $session->session_type->label() }}</td>
                        <td class="num">{{ $session->duration_minutes }} mnt</td>
                        <td class="num">{{ $session->rpe }} / 10</td>
                        <td class="num">{{ number_format($session->session_load) }}</td>
                        <td>{{ $session->notes ?? '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>
</html>

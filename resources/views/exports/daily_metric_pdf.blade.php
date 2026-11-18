<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Quick Recovery - {{ $athlete->name }}</title>
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

        /* Running Footer (fixed inside @page bottom margin — never creates orphan blank page) */
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

        /* Header */
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

        /* Section Titles */
        .section-title {
            font-size: 9px;
            font-weight: bold;
            color: #132e57;
            margin: 12px 0 5px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Meta Profile Table */
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .meta-table td {
            padding: 4px 7px;
            border: 1px solid #cbd5e1;
            font-size: 8.5px;
            vertical-align: middle;
        }

        .meta-label {
            background: #f1f5f9;
            color: #334155;
            font-weight: bold;
        }

        /* Summary KPI Cards */
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

        /* Clinical Insights (3-Column Compact Grid) */
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

        /* Daily Metrics Data Table */
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
            vertical-align: middle;
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

        .status-good { color: #047857; font-weight: bold; }
        .status-fair { color: #b45309; font-weight: bold; }
        .status-poor { color: #be123c; font-weight: bold; }
        .status-empty { color: #64748b; }
    </style>
</head>
<body>
    <div class="pdf-footer">
        <table>
            <tr>
                <td style="text-align: left;">Finestra · Physiological &amp; Neuromuscular Tracking · FIKK UNESA</td>
                <td style="text-align: right;">Dicetak {{ $generatedAt }}</td>
            </tr>
        </table>
    </div>

    <div class="header">
        <table class="header-table">
            <tr>
                <td style="width: 68%;">
                    <p class="brand-kicker">Finestra Sports Science</p>
                    <p class="header-title">Laporan Tracking Quick Recovery</p>
                    <div class="header-sub">
                        Physiological &amp; Neuromuscular Tracking · FIKK Universitas Negeri Surabaya
                    </div>
                </td>
                <td class="header-right" style="width: 32%;">
                    <strong>{{ $athlete->name }}</strong>
                    {{ $summary['total_days'] }} hari terisi · {{ count($metrics) }} baris kalender
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
            <td class="meta-label">Tanggal Lahir / Usia</td>
            <td>{{ $athlete->date_of_birth->format('d M Y') }} ({{ $athlete->age() }} thn)</td>
            <td class="meta-label">Berat / Tinggi / IMT</td>
            <td>{{ number_format($athlete->weight_kg, 1) }} kg / {{ number_format($athlete->height_cm, 1) }} cm ({{ number_format($athlete->bmi(), 1) }})</td>
        </tr>
        <tr>
            <td class="meta-label">Mulai Program</td>
            <td>{{ $athlete->training_start_date ? $athlete->training_start_date->format('d M Y') : 'Belum diatur' }}</td>
            <td class="meta-label">Baseline BHR</td>
            <td>{{ $baselineRhr !== null ? number_format($baselineRhr, 1) . ' bpm' : '-' }}</td>
        </tr>
    </table>

    <div class="section-title">Ringkasan Performa ({{ $summary['total_days'] }} Hari Terisi)</div>
    <table class="summary-table">
        <tr>
            @php
                $avgRec = $summary['avg_recovery'];
                $recBorderColor = $avgRec === null ? '#132e57' : ($avgRec >= 75 ? '#059669' : ($avgRec >= 35 ? '#d97706' : '#e11d48'));
            @endphp
            <td style="border-top-color: {{ $recBorderColor }};">
                <div class="summary-label">Rata-rata Quick Recovery</div>
                <div class="summary-value">
                    {{ $avgRec !== null ? number_format($avgRec, 1) . '%' : '-' }}
                </div>
            </td>
            <td>
                <div class="summary-label">Rata-rata BHR</div>
                <div class="summary-value">
                    @if ($summary['avg_rhr'] !== null)
                        {{ number_format($summary['avg_rhr'], 1) }} <span class="summary-unit">bpm</span>
                    @else
                        -
                    @endif
                </div>
            </td>
            <td>
                <div class="summary-label">Max Peak Power</div>
                <div class="summary-value">
                    @if ($summary['max_peak_power'] !== null)
                        {{ number_format($summary['max_peak_power']) }} <span class="summary-unit">W</span>
                    @else
                        -
                    @endif
                </div>
            </td>
            <td>
                <div class="summary-label">Rata-rata VO₂ Max</div>
                <div class="summary-value">
                    @if ($summary['avg_vo2_max'] !== null)
                        {{ number_format($summary['avg_vo2_max'], 1) }} <span class="summary-unit">ml/kg</span>
                    @else
                        -
                    @endif
                </div>
            </td>
        </tr>
    </table>

    @if (! empty($insights))
        <div class="section-title">Automated Clinical Insights</div>
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

    <div class="section-title">Riwayat Pencatatan Harian</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 13%;">Tanggal</th>
                <th style="width: 15%;">Program</th>
                <th class="num" style="width: 8%;">BHR</th>
                <th class="num" style="width: 8.5%;">SpO₂</th>
                <th class="num" style="width: 7%;">VJ</th>
                <th class="num" style="width: 8%;">Berat</th>
                <th class="num" style="width: 9.5%;">VO₂ Max</th>
                <th class="num" style="width: 11.5%;">Peak Power</th>
                <th class="num" style="width: 8%;">QRS</th>
                <th style="width: 11.5%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($metrics as $metric)
                @php
                    $statusClass = match ($metric->recovery_status->value) {
                        'RECOVERY BAIK' => 'status-good',
                        'RECOVERY CUKUP' => 'status-fair',
                        'RECOVERY KURANG' => 'status-poor',
                        default => 'status-empty',
                    };
                @endphp
                <tr>
                    <td>{{ $metric->record_date->format('d M Y') }}</td>
                    <td>{{ $metric->week }}</td>
                    <td class="num">{{ $metric->rhr > 0 ? number_format($metric->rhr, 1) : '-' }}</td>
                    <td class="num">{{ $metric->spo2 > 0 ? number_format($metric->spo2, 1) . '%' : '-' }}</td>
                    <td class="num">{{ $metric->vj > 0 ? number_format($metric->vj, 1) : '-' }}</td>
                    <td class="num">{{ $metric->weight > 0 ? number_format($metric->weight, 1) : '-' }}</td>
                    <td class="num">{{ $metric->vo2_max > 0 ? number_format($metric->vo2_max, 2) : '-' }}</td>
                    <td class="num">{{ $metric->peak_power > 0 ? number_format($metric->peak_power, 0) . ' W' : '-' }}</td>
                    <td class="num">{{ $metric->recovery_status->value !== 'KOSONG' ? $metric->quick_recovery_score . '%' : '-' }}</td>
                    <td class="{{ $statusClass }}">{{ $metric->recovery_status->shortLabel() }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" style="text-align: center; color: #64748b; padding: 14px;">
                        Belum ada data pencatatan harian.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>

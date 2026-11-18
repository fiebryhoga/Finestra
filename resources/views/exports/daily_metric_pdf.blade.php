<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Quick Recovery - {{ $athlete->name }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #0f172a;
            margin: 0;
            padding: 18px 22px;
        }
        .header {
            border-bottom: 2px solid #132e57;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }
        .header-title {
            font-size: 16px;
            font-weight: bold;
            color: #132e57;
            margin: 0;
        }
        .header-sub {
            font-size: 9px;
            color: #475569;
            margin-top: 3px;
        }
        .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #132e57;
            margin: 14px 0 6px 0;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .meta-table, .summary-table, .data-table {
            width: 100%;
            border-collapse: collapse;
        }
        .meta-table td {
            padding: 4px 6px;
            border: 1px solid #cbd5e1;
            font-size: 9.5px;
        }
        .meta-label {
            background: #f1f5f9;
            color: #334155;
            font-weight: bold;
            width: 22%;
        }
        .summary-table td {
            width: 25%;
            border: 1px solid #cbd5e1;
            padding: 8px 10px;
            background: #f8fafc;
        }
        .summary-label {
            font-size: 8.5px;
            color: #475569;
            margin-bottom: 3px;
        }
        .summary-value {
            font-size: 14px;
            font-weight: bold;
            color: #132e57;
        }
        .data-table th {
            background: #132e57;
            color: #ffffff;
            font-weight: bold;
            font-size: 8.5px;
            padding: 6px 5px;
            border: 1px solid #132e57;
            text-align: left;
        }
        .data-table th.num, .data-table td.num {
            text-align: right;
        }
        .data-table td {
            padding: 5px;
            border: 1px solid #cbd5e1;
            font-size: 8.5px;
        }
        .data-table tr:nth-child(even) td {
            background: #f8fafc;
        }
        .status-good { color: #047857; font-weight: bold; }
        .status-fair { color: #b45309; font-weight: bold; }
        .status-poor { color: #be123c; font-weight: bold; }
        .status-empty { color: #64748b; }
        .insight-box {
            border: 1px solid #cbd5e1;
            border-left: 3px solid #132e57;
            padding: 7px 10px;
            margin-bottom: 7px;
            background: #f8fafc;
        }
        .insight-optimal { border-left-color: #059669; }
        .insight-warning { border-left-color: #d97706; }
        .insight-risk { border-left-color: #e11d48; }
        .insight-info { border-left-color: #0284c7; }
        .insight-cat {
            font-size: 8px;
            color: #475569;
            text-transform: uppercase;
        }
        .insight-title {
            font-size: 10px;
            font-weight: bold;
            color: #0f172a;
            margin: 2px 0;
        }
        .insight-text {
            font-size: 8.5px;
            color: #334155;
            margin: 0;
        }
        .footer {
            margin-top: 18px;
            border-top: 1px solid #cbd5e1;
            padding-top: 6px;
            font-size: 8px;
            color: #64748b;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <p class="header-title">FINESTRA — Laporan Tracking Quick Recovery</p>
        <div class="header-sub">
            Physiological &amp; Neuromuscular Tracking · FIKK Universitas Negeri Surabaya · Dicetak {{ $generatedAt }}
        </div>
    </div>

    <div class="section-title">Profil Atlet</div>
    <table class="meta-table">
        <tr>
            <td class="meta-label">Nama Atlet</td>
            <td>{{ $athlete->name }}</td>
            <td class="meta-label">Jenis Kelamin</td>
            <td>{{ $athlete->gender->label() }}</td>
        </tr>
        <tr>
            <td class="meta-label">Tanggal Lahir / Usia</td>
            <td>{{ $athlete->date_of_birth->format('d M Y') }} ({{ $athlete->age() }} thn)</td>
            <td class="meta-label">Berat / Tinggi / IMT</td>
            <td>{{ number_format($athlete->weight_kg, 1) }} kg / {{ number_format($athlete->height_cm, 1) }} cm ({{ number_format($athlete->bmi(), 1) }})</td>
        </tr>
        <tr>
            <td class="meta-label">Tanggal Mulai Program</td>
            <td>{{ $athlete->training_start_date ? $athlete->training_start_date->format('d M Y') : 'Belum diatur' }}</td>
            <td class="meta-label">Baseline RHR</td>
            <td>{{ $baselineRhr !== null ? number_format($baselineRhr, 1) . ' bpm' : '-' }}</td>
        </tr>
    </table>

    <div class="section-title">Ringkasan Performa ({{ $summary['total_days'] }} Hari Terisi)</div>
    <table class="summary-table">
        <tr>
            <td>
                <div class="summary-label">Rata-rata Quick Recovery</div>
                <div class="summary-value">{{ $summary['avg_recovery'] !== null ? number_format($summary['avg_recovery'], 1) . '%' : '-' }}</div>
            </td>
            <td>
                <div class="summary-label">Rata-rata RHR</div>
                <div class="summary-value">{{ $summary['avg_rhr'] !== null ? number_format($summary['avg_rhr'], 1) . ' bpm' : '-' }}</div>
            </td>
            <td>
                <div class="summary-label">Max Peak Power</div>
                <div class="summary-value">{{ $summary['max_peak_power'] !== null ? number_format($summary['max_peak_power']) . ' W' : '-' }}</div>
            </td>
            <td>
                <div class="summary-label">Rata-rata VO₂ Max</div>
                <div class="summary-value">{{ $summary['avg_vo2_max'] !== null ? number_format($summary['avg_vo2_max'], 1) . ' ml/kg' : '-' }}</div>
            </td>
        </tr>
    </table>

    @if (! empty($insights))
        <div class="section-title">Automated Clinical Insights</div>
        @foreach ($insights as $insight)
            <div class="insight-box insight-{{ $insight['level'] }}">
                <div class="insight-cat">{{ $insight['category'] }} · {{ $insight['value'] }}</div>
                <div class="insight-title">{{ $insight['title'] }}</div>
                <p class="insight-text">{{ $insight['summary'] }}</p>
            </div>
        @endforeach
    @endif

    <div class="section-title">Riwayat Pencatatan Harian</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Program</th>
                <th class="num">RHR</th>
                <th class="num">SpO₂</th>
                <th class="num">VJ</th>
                <th class="num">Berat</th>
                <th class="num">VO₂ Max</th>
                <th class="num">Peak Power</th>
                <th class="num">QRS</th>
                <th>Status</th>
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

    <div class="footer">
        Finestra · Physiological &amp; Neuromuscular Tracking System
    </div>
</body>
</html>

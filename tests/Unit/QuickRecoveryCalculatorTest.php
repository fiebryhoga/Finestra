<?php

namespace Tests\Unit;

use App\Enums\RecoveryStatus;
use App\Services\Tracking\QuickRecoveryCalculator;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class QuickRecoveryCalculatorTest extends TestCase
{
    private QuickRecoveryCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new QuickRecoveryCalculator;
    }

    public function test_worked_example_base_metrics_and_qrs_match_specification(): void
    {
        // Worked example: Age=24, Weight=70, VJ=55, Baseline RHR=54, RHR=57, SpO2=98
        $base = $this->calculator->calculateBaseMetrics(24, 57.0, 70.0, 55.0);

        $this->assertSame(191.2, $base['hr_max']);
        $this->assertSame(3.35, $base['hr_ratio']);
        $this->assertSame(51.32, $base['vo2_max']);
        $this->assertSame(4454.5, $base['peak_power']);

        $recovery = $this->calculator->calculateRecoveryScore(57.0, 98.0, 54.0);

        $this->assertSame(77, $recovery['score']);
        $this->assertSame(RecoveryStatus::Good, $recovery['status']);
    }

    public function test_peak_power_is_zero_when_vj_or_weight_is_non_positive(): void
    {
        $noVj = $this->calculator->calculateBaseMetrics(22, 60.0, 70.0, 0.0);
        $this->assertSame(0.0, $noVj['peak_power']);

        $noWeight = $this->calculator->calculateBaseMetrics(22, 60.0, 0.0, 50.0);
        $this->assertSame(0.0, $noWeight['peak_power']);
    }

    public function test_spo2_scoring_handles_all_tiers_and_decimals(): void
    {
        $this->assertSame(6, $this->calculator->scoreSpo2(100.0));
        $this->assertSame(6, $this->calculator->scoreSpo2(99.0));
        $this->assertSame(5, $this->calculator->scoreSpo2(98.7));
        $this->assertSame(5, $this->calculator->scoreSpo2(98.0));
        $this->assertSame(4, $this->calculator->scoreSpo2(97.5));
        $this->assertSame(4, $this->calculator->scoreSpo2(97.0));
        $this->assertSame(3, $this->calculator->scoreSpo2(96.4));
        $this->assertSame(2, $this->calculator->scoreSpo2(95.2));
        $this->assertSame(1, $this->calculator->scoreSpo2(94.9));
        $this->assertSame(1, $this->calculator->scoreSpo2(88.0));
    }

    public function test_rhr_deviation_scoring_covers_all_ten_tiers(): void
    {
        $this->assertSame(10, $this->calculator->scoreRhrDeviation(-2.0));
        $this->assertSame(10, $this->calculator->scoreRhrDeviation(0.9));
        $this->assertSame(9, $this->calculator->scoreRhrDeviation(1.0));
        $this->assertSame(9, $this->calculator->scoreRhrDeviation(1.9));
        $this->assertSame(8, $this->calculator->scoreRhrDeviation(2.5));
        $this->assertSame(7, $this->calculator->scoreRhrDeviation(3.0));
        $this->assertSame(6, $this->calculator->scoreRhrDeviation(4.9));
        $this->assertSame(5, $this->calculator->scoreRhrDeviation(5.5));
        $this->assertSame(4, $this->calculator->scoreRhrDeviation(6.2));
        $this->assertSame(3, $this->calculator->scoreRhrDeviation(7.9));
        $this->assertSame(2, $this->calculator->scoreRhrDeviation(8.5));
        $this->assertSame(1, $this->calculator->scoreRhrDeviation(9.0));
        $this->assertSame(1, $this->calculator->scoreRhrDeviation(15.0));
    }

    public function test_empty_metric_returns_zero_and_kosong_status(): void
    {
        $zeroRhr = $this->calculator->calculateRecoveryScore(0.0, 98.0, 55.0);
        $this->assertSame(0, $zeroRhr['score']);
        $this->assertSame(RecoveryStatus::Empty, $zeroRhr['status']);

        $zeroSpo2 = $this->calculator->calculateRecoveryScore(55.0, 0.0, 55.0);
        $this->assertSame(0, $zeroSpo2['score']);
        $this->assertSame(RecoveryStatus::Empty, $zeroSpo2['status']);
    }

    public function test_recovery_status_boundaries(): void
    {
        $this->assertSame(RecoveryStatus::Good, RecoveryStatus::fromScore(75));
        $this->assertSame(RecoveryStatus::Fair, RecoveryStatus::fromScore(74));
        $this->assertSame(RecoveryStatus::Fair, RecoveryStatus::fromScore(35));
        $this->assertSame(RecoveryStatus::Poor, RecoveryStatus::fromScore(34));
        $this->assertSame(RecoveryStatus::Poor, RecoveryStatus::fromScore(0));
    }

    public function test_week_label_calculation(): void
    {
        $this->assertSame(
            'Belum Set Tanggal Mulai',
            $this->calculator->calculateWeekLabel(null, Carbon::parse('2026-11-18')),
        );

        $start = Carbon::parse('2026-11-10');

        $this->assertSame(
            'Sebelum Program',
            $this->calculator->calculateWeekLabel($start, Carbon::parse('2026-11-09')),
        );

        $this->assertSame(
            'Week 1, Day 1',
            $this->calculator->calculateWeekLabel($start, Carbon::parse('2026-11-10')),
        );

        $this->assertSame(
            'Week 1, Day 7',
            $this->calculator->calculateWeekLabel($start, Carbon::parse('2026-11-16')),
        );

        $this->assertSame(
            'Week 2, Day 3',
            $this->calculator->calculateWeekLabel($start, Carbon::parse('2026-11-19')),
        );
    }
}

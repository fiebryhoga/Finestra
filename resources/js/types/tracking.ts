export type RecoveryStatusValue =
    | 'KOSONG'
    | 'MENGHITUNG...'
    | 'RECOVERY BAIK'
    | 'RECOVERY CUKUP'
    | 'RECOVERY KURANG';

export type TrackingStatusFilter = 'all' | 'good' | 'fair' | 'poor' | 'empty';

export type DailyMetricRecord = {
    id: number;
    record_date: string;
    record_date_formatted: string;
    week: string;
    age: number;
    rhr: number;
    spo2: number;
    weight: number;
    vj: number;
    hr_max: number;
    hr_ratio: number;
    vo2_max: number;
    peak_power: number;
    quick_recovery_score: number;
    recovery_status: RecoveryStatusValue;
    recovery_status_short: string;
};

export type AthleteLatestMetric = {
    record_date: string;
    record_date_formatted: string;
    rhr: number;
    spo2: number;
    vo2_max: number;
    peak_power: number;
    quick_recovery_score: number;
    recovery_status: RecoveryStatusValue;
    recovery_status_short: string;
};

export type AthleteTrackingListItem = {
    id: number;
    name: string;
    gender_label: string;
    age: number;
    weight_kg: number;
    training_start_date: string | null;
    training_start_date_formatted: string | null;
    filled_metrics_count: number;
    latest_metric: AthleteLatestMetric | null;
};

export type TrackingOverviewStats = {
    total_athletes: number;
    tracked_athletes: number;
    avg_recovery_score: number | null;
    good_count: number;
    fair_count: number;
    poor_count: number;
};

export type TrackedAthleteDetail = {
    id: number;
    name: string;
    gender_label: string;
    age: number;
    weight_kg: number;
    height_cm: number;
    bmi: number;
    training_start_date: string | null;
    training_start_date_formatted: string | null;
};

export type ClinicalInsightLevel = 'optimal' | 'warning' | 'risk' | 'info';

export type ClinicalInsight = {
    category: string;
    level: ClinicalInsightLevel;
    title: string;
    summary: string;
    value: string;
};

export type BulkMetricRow = {
    record_date: string;
    rhr: string;
    spo2: string;
    vj: string;
    weight: string;
    age: string;
};

export type BulkAthleteSummary = {
    id: number;
    name: string;
    age: number;
    weight_kg: number;
    training_start_date: string | null;
};

export type DashboardStats = {
    total_athletes: number;
    tracked_athletes: number;
    avg_readiness_7d: number | null;
    optimal_fit: number;
    fatigue_warning: number;
    in_recovery: number;
};

export type DashboardAlert = {
    athlete_id: number;
    athlete_name: string;
    severity: 'rose' | 'amber';
    reason: string;
    score: number;
    rhr: number;
    record_date_formatted: string;
};

export type DashboardRecentMetric = {
    id: number;
    athlete_id: number;
    athlete_name: string;
    record_date_formatted: string;
    week: string;
    rhr: number;
    spo2: number;
    quick_recovery_score: number;
    recovery_status: RecoveryStatusValue;
    recovery_status_short: string;
};

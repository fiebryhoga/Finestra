export type InsightItem = {
    category: string;
    value: string;
    title: string;
    summary: string;
    level: 'optimal' | 'warning' | 'risk' | 'info';
};

export type QuickRecoveryReportData = {
    athlete: {
        name: string;
        gender_label: string;
        birth_date: string | null;
        age: number | null;
        height_cm: number | null;
        weight_kg: number | null;
        sport_branch: string;
        position: string | null;
        baseline_rhr: number | null;
    };
    period: {
        start_date: string | null;
        end_date: string | null;
        total_days: number;
    };
    summary: {
        total_days: number;
        avg_recovery: number | null;
        avg_rhr: number | null;
        max_peak_power: number | null;
        avg_vo2_max: number | null;
    };
    insights: InsightItem[];
    metrics: Array<{
        record_date: string;
        week: string;
        rhr: number | null;
        spo2: number | null;
        vj: number | null;
        weight: number | null;
        vo2_max: number | null;
        peak_power: number | null;
        quick_recovery_score: number | null;
        status_label: string;
        status_code: 'good' | 'fair' | 'poor' | 'empty';
    }>;
    generated_at: string;
};

export type DailyLoadItem = {
    date: string;
    date_label: string;
    day_short: string;
    daily_load: number;
    session_count: number;
};

export type RpeWeeklyReportData = {
    athlete: {
        name: string;
        sport_branch: string;
        position: string | null;
        total_sessions: number;
    };
    period: {
        start_date: string | null;
        end_date: string | null;
    };
    latest_week: {
        week_label: string;
        week_range: string;
        session_count: number;
        acute_load: number;
        chronic_load: number;
        acwr: number | null;
        week_change_pct: number | null;
        monotony: number;
        strain: number;
        zone: string;
        zone_label: string;
    } | null;
    insights: InsightItem[];
    weekly_summaries: Array<{
        week_label: string;
        week_range: string;
        session_count: number;
        acute_load: number;
        chronic_load: number;
        acwr: number | null;
        week_change_pct: number | null;
        monotony: number;
        strain: number;
        zone: string;
        zone_label: string;
    }>;
    daily_loads?: DailyLoadItem[];
    recent_sessions: Array<{
        session_date: string;
        session_type_label: string;
        duration_minutes: number;
        rpe: number;
        session_load: number;
        notes: string | null;
    }>;
    generated_at: string;
};

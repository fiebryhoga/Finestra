export type SessionTypeValue =
    | 'training'
    | 'conditioning'
    | 'tactical'
    | 'match'
    | 'recovery';

export type AcwrZoneValue =
    | 'undertraining'
    | 'optimal'
    | 'caution'
    | 'high_risk'
    | 'no_data';

export type RpeZoneFilter = 'all' | AcwrZoneValue;

export type SessionTypeOption = {
    value: SessionTypeValue;
    label: string;
};

export type WeeklyAcwrSummary = {
    iso_week: string;
    week_label: string;
    week_start: string;
    week_end: string;
    week_range: string;
    session_count: number;
    total_duration: number;
    avg_rpe: number | null;
    acute_load: number;
    chronic_load: number;
    chronic_weeks_used: number;
    acwr: number | null;
    zone: AcwrZoneValue;
    zone_label: string;
    week_change_pct: number | null;
    monotony: number;
    strain: number;
};

export type DailyLoadPoint = {
    date: string;
    date_label: string;
    day_short: string;
    session_count: number;
    daily_load: number;
};

export type RpeSessionRecord = {
    id: number;
    session_date: string;
    session_date_formatted: string;
    iso_week: string;
    session_type: SessionTypeValue;
    session_type_label: string;
    duration_minutes: number;
    rpe: number;
    session_load: number;
    notes: string | null;
};

export type AthleteRpeListItem = {
    id: number;
    name: string;
    gender_label: string;
    age: number;
    total_sessions: number;
    sessions_this_week: number;
    latest_week: {
        week_label: string;
        week_range: string;
        session_count: number;
        acute_load: number;
        chronic_load: number;
        chronic_weeks_used: number;
        acwr: number | null;
        zone: AcwrZoneValue;
        zone_label: string;
        week_change_pct: number | null;
    } | null;
};

export type RpeOverviewStats = {
    total_athletes: number;
    sessions_this_week: number;
    avg_acwr: number | null;
    optimal_count: number;
    caution_count: number;
    high_risk_count: number;
    undertraining_count: number;
};

export type RpeAthleteDetail = {
    id: number;
    name: string;
    gender_label: string;
    age: number;
    weight_kg: number;
    height_cm: number;
};

export type TeamInputAthlete = {
    id: number;
    name: string;
    gender_label: string;
    age: number;
};

export type LoadInsightLevel = 'optimal' | 'warning' | 'risk' | 'info';

export type LoadInsight = {
    category: string;
    level: LoadInsightLevel;
    title: string;
    summary: string;
    value: string;
};

export type AthleteGender = 'male' | 'female';

export type Athlete = {
    id: number;
    name: string;
    gender: AthleteGender;
    gender_label: string;
    date_of_birth: string;
    date_of_birth_formatted: string;
    age: number;
    weight_kg: number;
    height_cm: number;
    bmi: number;
    created_at_formatted: string;
};

export type AthleteSort =
    | 'latest'
    | 'name_asc'
    | 'name_desc'
    | 'youngest'
    | 'oldest';

export type AthleteStats = {
    total: number;
    avg_age: number | null;
    avg_weight_kg: number | null;
    avg_height_cm: number | null;
};

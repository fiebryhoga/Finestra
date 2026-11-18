export type User = {
    id: number;
    name: string;
    username: string;
    is_active?: boolean;
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type ManagedUser = {
    id: number;
    name: string;
    username: string;
    is_active: boolean;
    created_at: string | null;
    created_at_formatted: string;
};

export type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
};

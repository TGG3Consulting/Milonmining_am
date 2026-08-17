export interface User {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
    created_at: string;
    updated_at: string;
}

export interface UserForm {
    name: string;
    email: string;
    password?: string;
    role_ids: number[];
}

export interface Paginated<T> {
    data: T[];
    meta: {
        total: number;
        per_page: number;
        current_page: number;
    };
}
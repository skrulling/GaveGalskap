export interface Gift {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
    url?: string;
    taken?: boolean;
    taken_by?: string;
}

export interface SafeGift {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
    url?: string;
}
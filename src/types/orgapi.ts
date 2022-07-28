export interface Org {
    id: number,
    name: string,
    description1?: string,
    description2?: string,
    category?: string,
    status?: 'todo' | 'raise' | 'success' | 'failure' | 'pending',
    creationStamp: Date,
}

export interface Contact {
    id: number,
    name: String,
    first_name?: string,
    email?: string,
    phone?: string,
    address?: string,
    zipCode?: string,
    city?: string,
    creationStamp: Date,
}
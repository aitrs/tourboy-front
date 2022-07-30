import { Paginator } from "./generic";

export type OrgStatus = 'todo' | 'raise' | 'success' | 'failure' | 'pending';

export interface Org {
    idActivity: number,
    idOrg: number,
    name: string,
    description1?: string,
    description2?: string,
    city?: string,
    zipCode?: string,
    category?: string,
    status?: OrgStatus,
    userId?: number,
    userPseudo?: string,
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

export interface ListResponse {
    orgs: Array<Org>,
    pagination: Paginator,
}

export interface TagResponse {
    tagged: boolean,
    reason?: string,
}

export interface TagRequest {
    orgs: Array<number>,
    status: OrgStatus,
}
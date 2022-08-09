export interface Band {
    id: number,
    name: string,
}

export interface Claims {
    sub: string,
    bands: Array<Band>,
    id_user: number,
    exp: number,
}

export interface LoginResponse {
    status: boolean,
    jwt: string,
}

export interface User {
    id: number,
    pseudo: string,
    name: string,
    firstname: string,
    email: string,
    creationStamp: Date,
    lastLogin?: Date,
    verified: boolean,
    isAdmin?: boolean,
}

export interface UserCreationRequest {
    pseudo: string,
    name: string,
    firstname: string,
    email: string,
    pwd: string,
}

export interface UserCreationResponse {
    id: number;
}

export interface UserExistsResponse {
    exists: boolean,
    user?: User,
}

export interface KickBandResponse {
    kicked: boolean,
    reason?: string,
}

export interface VerifyResponse {
    id?: number,
    verified: boolean,
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordModRequest {
    id: number,
    pwd: string,
    chain: string,
}
export interface Claims {
    sub: string,
    bands: [number],
    id_user: number,
    exp: number,
}

export interface LoginResponse {
    status: boolean,
    jwt: string,
}
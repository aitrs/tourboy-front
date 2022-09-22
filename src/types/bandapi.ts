import { User } from "./userapi";

export interface BandCreateRequest {
    name: string;
}

export interface BandCreateResponse {
    id: number;
}

export interface BandMembersResponse {
    members: Array<User>;
}

export interface BandIsAdminResponse {
    isAdmin: boolean;
}

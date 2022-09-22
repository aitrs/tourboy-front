import { User } from "./userapi";

export interface Note {
    id: number;
    note: string;
    user?: User;
    creationStamp: Date;
}

export interface NoteCreateRequest {
    idBand: number;
    idActivity: number;
    note: string;
}

export interface NoteUpdateRequest {
    id: number;
    note: string;
}

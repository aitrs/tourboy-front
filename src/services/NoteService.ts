import { Note, NoteCreateRequest, NoteUpdateRequest } from "../types/noteapi";
import BaseService from "./BaseService";

export default class NoteService extends BaseService {
    private _api = "/api/note";

    async createNote(
        idBand: number,
        idActivity: number,
        note: string
    ): Promise<Note> {
        const request: NoteCreateRequest = {
            idActivity,
            idBand,
            note,
        };
        const response = await fetch(`${this._api}/create`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(request),
            mode: "cors",
        });

        let res: Note = await response.json();
        return res;
    }

    async editNote(id: number, note: string): Promise<Note> {
        const request: NoteUpdateRequest = {
            id,
            note,
        };
        const response = await fetch(`${this._api}/edit`, {
            method: "PUT",
            headers: this._headers,
            body: JSON.stringify(request),
            mode: "cors",
        });

        let res: Note = await response.json();
        return res;
    }

    async deleteNote(id: number, idBand: number): Promise<Note> {
        const response = await fetch(`${this._api}/delete/${id}/${idBand}`, {
            method: "DELETE",
            headers: this._headers,
            mode: "cors",
        });

        let res: Note = await response.json();
        return res;
    }

    async readNotes(idActivity: number, idBand: number): Promise<Array<Note>> {
        const response = await fetch(
            `${this._api}/all/${idActivity}/${idBand}`,
            {
                method: "GET",
                headers: this._headers,
                mode: "cors",
            }
        );

        let res: Array<Note> = await response.json();
        return res;
    }
}

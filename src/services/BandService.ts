import { BandCreateResponse, BandIsAdminResponse, BandMembersResponse } from "../types/bandapi";
import BaseService from "./BaseService";

export default class BandService extends BaseService {
    private _api = '/api/band';

    async createBand(name: string): Promise<BandCreateResponse> {
        const response = await fetch(`${this._api}/add`,{
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name,
            }),
            mode: 'cors',
        });

        let res: BandCreateResponse = await response.json();
        return res;
    }

    async updateBand(name: string, id: number): Promise<null>{
        await fetch(`${this._api}/upd/${id}`, {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify({
                name,
            }),
            mode: 'cors',
        });

        return null;        
    }

    async members(id: number): Promise<BandMembersResponse> {
        const response = await fetch(`${this._api}/members/${id}`, {
            method: 'GET',
            headers: this._headers,
            mode: 'cors',
        });

        const res: BandMembersResponse = await response.json();

        return res;
    }

    async isAdmin(idBand: number): Promise<BandIsAdminResponse> {
        const response = await fetch(`${this._api}/isadmin/${idBand}`, {
            method: 'GET',
            headers: this._headers,
            mode: 'cors',
        });

        const res: BandIsAdminResponse = await response.json();

        return res;
    }

}
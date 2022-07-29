import { Band, KickBandResponse, LoginResponse, UserExistsResponse } from "../types/userapi";
import BaseService from "./BaseService";

export default class LoginService extends BaseService {
    private _api: string = '/api/user';


    async login(email: string, pwd: string): Promise<LoginResponse> {
        const response = await fetch(`${this._api}/login`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                email,
                pwd,
            }),
            mode: 'cors',
        });

        let res: LoginResponse = await response.json();
        return res;
    }

    async getBands(): Promise<Array<Band>> {
        const response = await fetch(`${this._api}/bands`, {
            method: 'GET',
            headers: this._headers,
            mode: 'cors',
        });

        let res: Array<Band> = await response.json();
        return res;
    }

    async exists(email: string): Promise<UserExistsResponse> {
        const response = await fetch(`${this._api}/exists/${email}`, {
            method: 'GET',
            headers: this._headers,
            mode: 'cors',
        });

        let res: UserExistsResponse = await response.json();

        return res;
    }

    async addUserInBand(idBand: number, email: String, administrator: boolean): Promise<null> {
        const response = await fetch(`${this._api}/addband`, {
            method: 'PATCH',
            headers: this._headers,
            mode: 'cors',
            body: JSON.stringify({
                email,
                idBand, 
                administrator,
            }),
        });
        await response.text();
        return null;
    }

    async kickUserFromBand(idBand: number, idUser: number, pwd: string): Promise<KickBandResponse> {
        const response = await fetch(`${this._api}/kick`, {
            method: 'PATCH',
            headers: this._headers,
            mode: 'cors',
            body: JSON.stringify({
                idUser,
                idBand,
                pwd
            })
        });

        let res: KickBandResponse = await response.json();
        return res;
    }
}
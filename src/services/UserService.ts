import { LoginResponse } from "../types/userapi";
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
}
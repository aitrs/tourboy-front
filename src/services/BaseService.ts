import { Claims } from "../types/userapi";

export default class BaseService {
    protected _claims?: Claims;
    protected static readonly _secret = "kahloriz";

    protected get _headers(): Headers {
        let headers = new Headers();
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            //this._claims = JSON.parse(Jwt.verify(jwt, BaseService._secret) as string);
            headers.append('Authorization', `Bearer ${jwt}`);
        }
        headers.append('Content-Type', 'application/json');
        
        return headers
    }

    static set jwt(jwt: string) {
        localStorage.setItem('jwt', jwt);
    }

    static get token(): string | null {
        return localStorage.getItem('jwt');
    }

    static removeJwt() {
        localStorage.removeItem('jwt');
    }
}
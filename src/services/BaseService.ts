import { Filter } from "../types/generic";
import { Band, Claims } from "../types/userapi";
export default class BaseService {
    protected _claims?: Claims;
    protected static readonly _secret = "kahloriz";

    protected get _headers(): Headers {
        let headers = new Headers();
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            const decode = require('jwt-claims');
            this._claims = decode(jwt);
            headers.append('Authorization', `Bearer ${jwt}`);
        }
        headers.append('Content-Type', 'application/json');
        
        return headers
    }

    protected _genHeaders(filters: Array<Filter>): Headers {
        let headers = this._headers;
        headers.append('filters', JSON.stringify(filters));
        return headers;
    }

    static set jwt(jwt: string) {
        localStorage.setItem('jwt', jwt);
    }

    static get token(): string | null {
        return localStorage.getItem('jwt');
    }

    static get isJwtExpired(): boolean {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            const decode = require('jwt-claims');
            const claims: Claims = decode(jwt);
            const now = Date.now() / 1000;

            return claims.exp < now;
        } else {
            return false;
        }
    }

    static removeJwt() {
        localStorage.removeItem('jwt');
    }

    get userId(): number | undefined {
        return this._claims ? this._claims.id_user : undefined;
    }

    get bands(): Array<Band> {
        return this._claims ? this._claims.bands : [];
    }
}
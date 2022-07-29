import { Filter } from "../types/generic";
import { ListResponse, Org } from "../types/orgapi";
import BaseService from "./BaseService";

export default class OrgService extends BaseService {
    private _api: string = '/api/org';

    async orgAll(filters: Array<Filter>, page: number, size: number): Promise<ListResponse> {
        const response = await fetch(`${this._api}/all/${page}/${size}`, {
            method: 'GET',
            headers: this._genHeaders(filters),
            mode: 'cors',
        });

        let res: ListResponse = await response.json();
        return res;
    }
}
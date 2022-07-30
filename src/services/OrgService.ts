import { Filter } from "../types/generic";
import { Contact, ListResponse, Org, OrgStatus, TagRequest, TagResponse } from "../types/orgapi";
import BaseService from "./BaseService";

export default class OrgService extends BaseService {
    private _api: string = '/api/org';

    async orgAll(idBand: number, filters: Array<Filter>, page: number, size: number): Promise<ListResponse> {
        const response = await fetch(`${this._api}/all/${idBand}/${page}/${size}`, {
            method: 'GET',
            headers: this._genHeaders(filters),
            mode: 'cors',
        });

        let res: ListResponse = await response.json();
        return res;
    }

    async tag(idBand: number, orgs: Array<Org>, idUser: number, status: OrgStatus): Promise<TagResponse> {
        const request: TagRequest = {
            status,
            orgs: orgs.map(o => o.idActivity),
        };
        const response = await fetch(`${this._api}/tag/${idBand}/${idUser}`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(request),
            mode: 'cors',
        });

        let res: TagResponse = await response.json();
        return res;
    }

    async addContact(idOrg: number, idBand: number, contact: Contact): Promise<Contact> {
        const pcontact: Contact = {
            ...contact,
            id: 0,
        };
        const response = await fetch(`${this._api}/contact/${idOrg}/${idBand}`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(pcontact),
            mode: 'cors',
        });

        let res: Contact = await response.json();
        return res;
    }

    async updateContact(contact: Contact): Promise<Contact> {
        const response = await fetch(`${this._api}/contact`, {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify(contact),
            mode: 'cors',
        });

        let res: Contact = await response.json();
        return res;
    }

    async deleteContact(idContact: number): Promise<Contact> {
        const response = await fetch(`${this._api}/contact/${idContact}`, {
            method: 'DELETE',
            headers: this._headers,
            mode: 'cors',
        });

        let res: Contact = await response.json();
        return res;
    }

    async getContacts(idOrg: number, idBand: number): Promise<Array<Contact>> {
        const response = await fetch(`${this._api}/contact/${idOrg}/${idBand}`, {
            method: 'GET',
            headers: this._headers,
            mode: 'cors',
        });

        let res: Array<Contact> = await response.json();
        return res;
    }
}
import { Org } from "./orgapi";
import { Band } from "./userapi";

export interface Contact {
    id: number,
    org?: Org,
    band?: Band,
    name: string,
    firstname?: string,
    email?: string,
    phone?: string,
    address?: string,
    zipCode?: string,
    city?: string,
    creationStamp: Date,
}
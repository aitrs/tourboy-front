import { useEffect, useRef } from "react";
import { ValidatorPerformer } from "../lib/validators";

export interface FormValue<T> {
    value: T;
    error: boolean;
    errorMessage: string;
    validators: ValidatorPerformer[];
}

export function validateFormValue<T>(f: FormValue<T>): boolean {
    for (let v of f.validators) {
        if (!v.perform(f.value)) {
            return false;
        }
    }

    return true;
}

export function validateForm(form: any): any {
    const keys = Object.keys(form);
    for (let field of keys) {
        const fvalue: FormValue<string> = form[field];
        form[field].error = !validateFormValue(fvalue);
    }
    return form;
}

export function isFormValid(form: any): boolean {
    const keys = Object.keys(form);
    for (let field of keys) {
        if (form[field].error) {
            return false;
        }
    }
    return true;
}

export interface Filter {
    key: string;
    alias?: string;
    op: "like" | "exact";
    filterType: "numeric" | "string";
    value: string;
    likeStart: boolean;
}

export interface Paginator {
    page: number;
    size: number;
    pageCount?: number;
    itemCount?: number;
}

export function usePrevious<T>(prev: T): T {
    const ref = useRef<T>(prev);
    useEffect(() => {
        ref.current = prev;
    });
    return ref.current;
}

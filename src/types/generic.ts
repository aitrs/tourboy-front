export interface FormValue<T> {
    value: T,
    error: boolean,
    errorMessage: string,
}

export interface Filter {
    key: string,
    alias?: string,
    op: 'like' | 'exact',
    filterType: 'numeric' | 'string',
    value: string,
}

export interface Paginator {
    page: number,
    size: number,
    pageCount?: number,
    itemCount?: number,
}

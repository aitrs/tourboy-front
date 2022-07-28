export interface Column {
    ident: 'id' | 'name' | 'description1' | 'category' | 'status',
    label: string,
    minWidth?: number,
    align?: 'right',
    format?: (value: number) => string,
}


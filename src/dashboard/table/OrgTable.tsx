import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { off } from "process";
import React from "react";
import OrgService from "../../services/OrgService";
import { Filter } from "../../types/generic";
import { Org, OrgStatus } from "../../types/orgapi";
import './OrgTable.css';

export type Ident = 'id' | 'name' | 'description1' | 'category' | 'status' | 'city' | 'zipCode';

export interface Column {
    ident: Ident,
    colname?: string,
    label: string,
    alias?: string,
    op?: 'like' | 'exact',
    width?: number,
    align?: 'right' | 'left',
    format?: (value: number | OrgStatus) => string,
    filter?: string,
    likeStart: boolean,
}

export interface OrgTableState {
    layout: Array<Column>,
    data: Array<Org>,
    filters: Array<Filter>,
    page: number,
    size: number,
    pageCount?: number,
    totalItems?: number,
    selected: Array<Org>,
}

export interface OrgTableProps {
    idBand?: number,
}

export class OrgTable extends React.Component<OrgTableProps, OrgTableState> {
    private _orgService = new OrgService();

    constructor(props: OrgTableProps) {
        super(props);
        this.state = {
            data: [],
            layout: [
                {
                    ident: 'name',
                    alias: 'o',
                    label: 'Nom',
                    width: 100,
                    align: 'left',
                    likeStart: false,
                },
                {
                    ident: 'description1',
                    alias: 'o',
                    label: 'Description',
                    width: 200,
                    align: 'left',
                    likeStart: false,
                },
                {
                    ident: 'city',
                    alias: 'a',
                    label: 'Ville',
                    width: 100,
                    align: 'left',
                    likeStart: false,
                },
                {
                    ident: 'zipCode',
                    colname: 'postal_code',
                    alias: 'a',
                    label: 'Code Postal',
                    width: 50,
                    align: 'left',
                    likeStart: true,
                },
                {
                    ident: 'category',
                    alias: 'a',
                    label: 'Categorie',
                    width: 200,
                    align: 'right',
                    likeStart: false,
                },
                {
                    ident: 'status',
                    alias: 'oa',
                    op: 'exact',
                    label: 'Etat',
                    width: 100,
                    align: 'right',
                    likeStart: false,
                    format: (value) => {
                        if (typeof value === 'number') {
                            return `${value}`
                        } else {
                            switch(value as OrgStatus) {
                                case 'todo':
                                    return 'TODO';
                                case 'success':
                                    return 'Succès';
                                case 'failure':
                                    return 'Echec';
                                case 'raise':
                                    return 'Relancer';
                                case 'pending':
                                    return 'En cours';
                                default:
                                    return 'TODO';
                            }
                        }
                    }
                }
            ],
            filters: [],
            page: 0,
            size: 10,
            selected: [],
        }
    }

    componentDidUpdate(previousProps: OrgTableProps) {
        if (this.props.idBand) {
            if (!previousProps.idBand || (previousProps.idBand !== this.props.idBand)) {
                this.setState({
                    ...this.state,
                    page: 0,
                });
                this._retrieveData();
            }
        }
    }

    handlePageChange(_: unknown, page: number) {
        this.setState({
            ...this.state,
            page,
        }, () => {
            this._retrieveData();
        });
    }

    handleSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            size: +event.target.value,
        }, () => {
            this._retrieveData();
        });
    }

    onSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) {
            this.setState({
                ...this.state,
                selected: this.state.data,
            });
        } else {
            this.setState({
                ...this.state,
                selected: [],
            });
        }
    }

    handleCheckBox(checked: boolean, org: Org) {
        if(checked) {
            const nselection = [...this.state.selected, org];
            this.setState({
                ...this.state,
                selected: nselection,
            });
        } else {
            const infex = this.state.selected.findIndex(o => o.id === org.id);
            if (infex !== -1) {
                let selected = this.state.selected;
                selected.splice(infex, 1);
                this.setState({
                    ...this.state,
                    selected,
                });
            }
        }
    }

    isItemSelected(id: number): boolean {
        return this.state.selected.find(o => o.id === id) === undefined ? false : true;
    }

    onFilterChange(col: Column, value: string) {
        const index = this.state.filters.findIndex(f => f.key === col.ident);

        if (index !== -1) {
            let filters = this.state.filters;
            if (value === '') {
                filters.splice(index, 1);
            } else {
                filters[index].value = value;    
            }
            this.setState({
                ...this.state,
                filters,
            });
        } else {
            this.setState({
                ...this.state,
                filters: [...this.state.filters, {
                    key: col.colname ? col.colname : col.ident as string,
                    alias: col.alias,
                    op: col.op ? col.op : 'like',
                    filterType: 'string',
                    value,
                    likeStart: col.likeStart,
                }],
            });
        }
    }

    onFilterSubmit(event: any) {
        event?.preventDefault();
        this._retrieveData();
    }

    private _retrieveData() {
        if (this.props.idBand) {
            this._orgService.orgAll(
                this.state.filters, 
                this.state.page,
                this.state.size
            ).then(rows => {
                this.setState({
                    ...this.state,
                    data: [],
                });
                this.setState({
                    ...this.state,
                    data: rows.orgs,
                    pageCount: rows.pagination.pageCount,
                    totalItems: rows.pagination.itemCount,
                });
            })
        }
    }

    componentDidMount() {
    }

    render(): JSX.Element {
        if (this.props.idBand) {
            return(
                <div className="tablecont">
                    <TableContainer sx={{
                         '&::-webkit-scrollbar': {
                            width: '0.4em'
                          },
                          '&::-webkit-scrollbar-track': {
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,.1)',
                            outline: '1px solid slategrey'
                          }
                    }} className="tableinnercont">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={this.state.selected.length > 0 && this.state.selected.length < this.state.data.length}
                                            checked={this.state.data.length > 0 && this.state.selected.length === this.state.data.length}
                                            onChange={this.onSelectAllClick.bind(this)}
                                            inputProps={{
                                                'aria-label': 'Selectionner toutes les lignes visibles',
                                            }}
                                        />
                                    </TableCell>
                                    {
                                        this.state.layout.map((col) => (
                                            <TableCell
                                                key={col.ident}
                                                align={col.align ? col.align : 'right'}
                                                style={{ width: col.width }}>
                                                {col.label}
                                                <br />
                                                <form onSubmit={this.onFilterSubmit.bind(this)}>
                                                    <TextField 
                                                        sx={{
                                                            alignContent: col.align,
                                                        }}
                                                        size="small"
                                                        label="Filtrer"
                                                        variant="outlined"
                                                        value={this.state.layout.find(c => c.ident===col.ident)?.filter}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            this.onFilterChange.bind(this)(col, event.target.value);
                                                        }}
                                                    />
                                                </form>
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.data.map(row => {
                                        const isSelected = this.isItemSelected(row.id);
                                        return(
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isSelected}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            const handle = this.handleCheckBox.bind(this);
                                                            handle(event.target.checked, row);
                                                        }}
                                                    />
                                                </TableCell>
                                                {
                                                    this.state.layout.map(col => {
                                                        const val = row[col.ident];

                                                        return (
                                                            <TableCell key={col.ident} align={col.align}>
                                                                {
                                                                    col.format ? col.format(typeof val === 'number' ? val as number : val as OrgStatus) : val
                                                                }
                                                            </TableCell>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]} 
                        component="div"
                        count={this.state.totalItems as number}
                        rowsPerPage={this.state.size}
                        page={this.state.page}
                        onPageChange={this.handlePageChange.bind(this)}
                        onRowsPerPageChange={this.handleSizeChange.bind(this)}
                    />
                </div>
            );
        } else {
            return (
                <p>Veuillez sélectionner un groupe</p>
            )
        }
    }
}
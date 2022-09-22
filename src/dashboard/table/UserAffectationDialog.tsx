import { Label } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import React from "react";
import OrgService from "../../services/OrgService";
import { Org, TagResponse } from "../../types/orgapi";
import { User } from "../../types/userapi";

export interface UserAffectationProps {
    org: Org;
    idBand: number;
    open: boolean;
    onClose: () => void;
    onTagged: (user: User, response: TagResponse) => void;
    bandUsers: Array<User>;
}

export interface UserAffectationState {
    selected?: User;
    error: boolean;
}

export class UserAffectationDialog extends React.Component<
    UserAffectationProps,
    UserAffectationState
> {
    private _orgService = new OrgService();

    constructor(props: UserAffectationProps) {
        super(props);
        this.state = {
            error: false,
        };
    }

    handleChange(event: SelectChangeEvent) {
        event.stopPropagation();
        const found = this.props.bandUsers.find(
            (u) => u.id === Number.parseInt(event.target.value)
        );

        this.setState({
            ...this.state,
            selected: found,
        });
    }

    handleClose(event: any) {
        event.stopPropagation();
        this.props.onClose();
    }

    handleSubmit(event: any) {
        event.preventDefault();
        event.stopPropagation();
        if (this.state.selected) {
            this._orgService
                .tag(
                    this.props.idBand,
                    [this.props.org],
                    this.state.selected.id,
                    "todo"
                )
                .then((tr) => {
                    this.props.onTagged(this.state.selected as User, tr);
                });
        } else {
            this.setState({
                ...this.state,
                error: true,
            });
        }
    }

    render(): JSX.Element {
        return (
            <Dialog open={this.props.open}>
                <form noValidate onSubmit={this.handleSubmit.bind(this)}>
                    <DialogTitle>Affecter un membre</DialogTitle>
                    <DialogContent>
                        <br />
                        <FormControl fullWidth error={this.state.error}>
                            <InputLabel>Membre</InputLabel>
                            <Select
                                value={
                                    this.state.selected
                                        ? `${this.state.selected.id}`
                                        : ""
                                }
                                label="Membre"
                                onChange={this.handleChange.bind(this)}
                            >
                                {this.props.bandUsers.map((u) => {
                                    return (
                                        <MenuItem
                                            key={u.id}
                                            value={`${u.id}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                            }}
                                        >
                                            {u.pseudo}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            onClick={(event) => {
                                event.stopPropagation();
                                const handle = this.handleSubmit.bind(this);
                                handle(event);
                            }}
                        >
                            Sauvegarder
                        </Button>
                        <Button
                            type="button"
                            onClick={this.handleClose.bind(this)}
                        >
                            Fermer
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

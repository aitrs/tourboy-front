import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React from "react";
import UserService from "../../services/UserService";
import { FormValue } from "../../types/generic";
import { User } from "../../types/userapi";
import './Dialog.css';

export interface KickDialogProps {
    userToKick?: User,
    idBand?: number,
    open: boolean,
    onKick: (user: User, idBand: number) => void;
    onCancel: () => void,
}

export interface KickDialogState {
    formValues: {
        pwd: FormValue<string>,
    },
    errorMessage: string,
}

export class KickDialog extends React.Component<KickDialogProps, KickDialogState> {
    private _userService = new UserService();
    constructor(props: KickDialogProps) {
        super(props);

        this.state = {
            formValues: {
                pwd: {
                    value: '',
                    error: false,
                    errorMessage: 'Mot de passe requis',
                    validators: [],
                }
            },
            errorMessage: '',
        }
    }

    async handleSumbit(event: any) {
        event.preventDefault();

        if (this.state.formValues.pwd.value === '') {
            this.setState({
                ...this.state,
                formValues: {
                    ...this.state.formValues,
                    pwd: {
                        ...this.state.formValues.pwd,
                        error: true,
                    }
                }
            });
        } else {
            if (this.props.idBand && this.props.userToKick) {
                let resp = await this._userService.kickUserFromBand(
                    this.props.idBand,
                    this.props.userToKick.id,
                    this.state.formValues.pwd.value,
                );

                if (resp.kicked) {
                    this.props.onKick(this.props.userToKick, this.props.idBand);
                } else {
                    if (resp.reason) {
                        this.setState({
                            ...this.state,
                            errorMessage: resp.reason,
                        });
                    }
                }
            }
        }
    }

    handleCancel() {
        this.props.onCancel();
    }

    handlePwdChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        this.setState({
            ...this.state,
            formValues: {
                ...this.state.formValues,
                pwd: {
                    ...this.state.formValues.pwd,
                    value,
                }
            }
        });
    }

    render(): JSX.Element {
        return (
            <Dialog
                open={this.props.open}
            >
                <form onSubmit={this.handleSumbit.bind(this)}>
                        <DialogTitle>Enlever le membre d'un groupe</DialogTitle>
                        <DialogContent>
                            <TextField
                                id="pwd"
                                label="Mot de passe"
                                variant="outlined"
                                type="password"
                                value={this.state.formValues.pwd.value}
                                error={this.state.formValues.pwd.error}
                                helperText={this.state.formValues.pwd.errorMessage}
                                onChange={this.handlePwdChange.bind(this)}
                            />
                            <br />
                            <p>
                                {this.state.errorMessage}
                            </p>
                        </DialogContent>
                        <DialogActions className="dialogactions">
                            <Button type="submit">
                                Enlever
                            </Button>
                            <Button type="button" onClick={this.handleCancel.bind(this)}>
                                Annuler
                            </Button>
                        </DialogActions>
                </form>
            </Dialog>
        )
    }
}
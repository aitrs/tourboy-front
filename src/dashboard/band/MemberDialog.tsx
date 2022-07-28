import { Button, Card, CardActions, CardContent, CardHeader, Dialog, FormControlLabel, TextField, Checkbox } from "@mui/material";
import React from "react";
import UserService from "../../services/UserService";
import { FormValue } from "../../types/generic";
import { User } from "../../types/userapi";
import './Dialog.css';

export interface MemberDialogProps {
    bandId: number,
    open: boolean,
    onAdd: (user: User) => void,
    onCancel: () => void,
}

interface FormValues {
    email: FormValue<string>,
    isAdmin: FormValue<boolean>,
}

export interface MemberDialogState {
    formValues: FormValues,
    errorMessage: string,
}

export class MemberDialog extends React.Component<MemberDialogProps, MemberDialogState> {
    private _userService = new UserService();
    constructor(props: MemberDialogProps) {
        super(props);
        this.state = {
            formValues: {
                email: {
                    value: '',
                    error: false,
                    errorMessage: 'Email invalide',
                },
                isAdmin: {
                    value: false,
                    error: false,
                    errorMessage: '',
                }
            },
            errorMessage: '',
        }
    }

    async handleEmailChange(event: any) {
        const value = event.target.value;
        this.setState({
            ...this.state,
            formValues: {
                ...this.state.formValues,
                email: {
                    ...this.state.formValues.email,
                    value,
                }
            }
        });
    }

    async handleAdminCheck(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.checked;
        this.setState({
            ...this.state,
            formValues: {
                ...this.state.formValues,
                isAdmin: {
                    ...this.state.formValues.isAdmin,
                    value,
                }
            }
        });
    }

    async handleSubmit(event: any) {
        event.preventDefault();
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

        if (this.state.formValues.email.value.match(emailRegex)) {
            const eres = await this._userService.exists(this.state.formValues.email.value);
            if (eres.exists) {
                await this._userService.addUserInBand(
                    this.props.bandId,
                    this.state.formValues.email.value,
                    this.state.formValues.isAdmin.value,
                );
                this.props.onAdd(eres.user as User);
            } else {
                this.setState({
                    ...this.state,
                    errorMessage: `Aucun utilisateur n'a l'email ${this.state.formValues.email.value}`,
                });
            }
        } else {
            this.setState({
                ...this.state,
                formValues: {
                    ...this.state.formValues,
                    email: {
                        ...this.state.formValues.email,
                        error: true,
                    }
                }
            });
        }
    }

    async handleCancel() {
        this.props.onCancel();
    }

    renderCb(): JSX.Element {
        return (
            <Checkbox onChange={this.handleAdminCheck.bind(this)} />
        )
    }

    render(): JSX.Element {
        const cb = this.renderCb();
        return(
            <Dialog
                open={this.props.open}>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Card className="dialogcard" sx={{ minWidth: 300 }} >
                        <CardHeader title="Ajouter un membre" />
                        <CardContent>
                            <TextField
                                id="email"
                                label="Email"
                                variant="outlined"
                                value={this.state.formValues.email.value}
                                error={this.state.formValues.email.error}
                                helperText={this.state.formValues.email.errorMessage}
                                onChange={this.handleEmailChange.bind(this)}
                            />
                            <br />
                            <FormControlLabel
                                control={cb}
                                label="Admin"
                            />
                            <br />
                            <p>
                                {this.state.errorMessage}
                            </p>
                        </CardContent>
                        <CardActions className="dialogactions" id="memberactions">
                            <Button type="submit">
                                Ajouter
                            </Button>
                            <Button type="button" onClick={this.handleCancel.bind(this)}>
                                Annuler
                            </Button>
                        </CardActions>
                    </Card>   
                </form>        
            </Dialog>
        )
    }
}
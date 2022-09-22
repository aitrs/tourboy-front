import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    TextField,
} from "@mui/material";
import React from "react";
import { Validators } from "./lib/validators";
import UserService from "./services/UserService";
import { FormValue, isFormValid, validateForm } from "./types/generic";
import "./UserCreation.css";

interface FormValues {
    pseudo: FormValue<string>;
    name: FormValue<string>;
    firstname: FormValue<string>;
    email: FormValue<string>;
    pwd: FormValue<string>;
}

export interface UserCreationState {
    formValues: FormValues;
    newId?: number;
}

export class UserCreation extends React.Component<{}, UserCreationState> {
    private _userService: UserService;
    constructor(props: {}) {
        super(props);
        this._userService = new UserService();
        this.state = {
            formValues: {
                pseudo: {
                    value: "",
                    error: false,
                    errorMessage: "Pseudo vide ou invalide",
                    validators: [
                        Validators.Required,
                        Validators.Pattern(/[a-zA-Z0-9_\-@]+/),
                    ],
                },
                name: {
                    value: "",
                    error: false,
                    errorMessage: "Nom vide ou invalide",
                    validators: [
                        Validators.Required,
                        Validators.Pattern(/[a-zA-Z ]+/),
                    ],
                },
                firstname: {
                    value: "",
                    error: false,
                    errorMessage: "Prénom vide ou invalide",
                    validators: [
                        Validators.Required,
                        Validators.Pattern(/[a-zA-Z ]+/),
                    ],
                },
                email: {
                    value: "",
                    error: false,
                    errorMessage: "Email vide ou invalide",
                    validators: [Validators.Required, Validators.Email],
                },
                pwd: {
                    value: "",
                    error: false,
                    errorMessage: "Mot de passe vide ou invalide",
                    validators: [Validators.Required],
                },
            },
            newId: undefined,
        };
    }

    async changeValue(key: string, event: any) {
        let formValues = this.state.formValues;
        (formValues[key as keyof Object] as any).value = event.target.value;
    }

    onBlur(_ev: any) {
        this.setState({
            ...this.state,
            formValues: validateForm(this.state.formValues),
        });
    }

    fvalue(key: string): string {
        return (this.state.formValues[key as keyof Object] as any).value;
    }

    ferror(key: string): boolean {
        return (this.state.formValues[key as keyof Object] as any).error;
    }

    fhelper(key: string): boolean {
        return (this.state.formValues[key as keyof Object] as any).errorMessage;
    }
    async handleSubmit(event: any) {
        event.preventDefault();
        const form = validateForm(this.state.formValues);
        if (isFormValid(form)) {
            try {
                const resp = await this._userService.register({
                    pseudo: this.fvalue("pseudo"),
                    name: this.fvalue("name"),
                    firstname: this.fvalue("firstname"),
                    email: this.fvalue("email"),
                    pwd: this.fvalue("pwd"),
                });

                this.setState({
                    ...this.state,
                    newId: resp.id,
                });
            } catch (e) {
                alert(e);
            }
        }
    }
    render(): JSX.Element {
        const body: JSX.Element =
            this.state.newId === undefined ? (
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Card>
                        <CardHeader title="S'inscrire" />
                        <CardContent>
                            <TextField
                                id="pseudo"
                                label="Pseudo"
                                variant="outlined"
                                error={this.ferror("pseudo")}
                                onChange={(ev) => {
                                    this.changeValue("pseudo", ev);
                                }}
                                onBlur={this.onBlur.bind(this)}
                            />
                            <br />
                            <br />
                            <TextField
                                id="name"
                                label="Nom"
                                variant="outlined"
                                error={this.ferror("name")}
                                onChange={(ev) => {
                                    this.changeValue("name", ev);
                                }}
                                onBlur={this.onBlur.bind(this)}
                            />
                            <br />
                            <br />
                            <TextField
                                id="firstname"
                                label="Prénom"
                                variant="outlined"
                                error={this.ferror("firstname")}
                                onChange={(ev) => {
                                    this.changeValue("firstname", ev);
                                }}
                                onBlur={this.onBlur.bind(this)}
                            />
                            <br />
                            <br />
                            <TextField
                                id="email"
                                label="Email"
                                variant="outlined"
                                error={this.ferror("email")}
                                onChange={(ev) => {
                                    this.changeValue("email", ev);
                                }}
                                onBlur={this.onBlur.bind(this)}
                            />
                            <br />
                            <br />
                            <TextField
                                id="pwd"
                                label="Mot de passe"
                                type="password"
                                variant="outlined"
                                error={this.ferror("pwd")}
                                onChange={(ev) => {
                                    this.changeValue("pwd", ev);
                                }}
                                onBlur={this.onBlur.bind(this)}
                            />
                        </CardContent>
                        <CardActions>
                            <Button className="subbutton" type="submit">
                                S'inscrire
                            </Button>
                        </CardActions>
                    </Card>
                </form>
            ) : (
                <Card>
                    <CardContent>
                        <p>
                            Utilisateur créé avec succès avec l'ID{" "}
                            {this.state.newId}
                        </p>
                        <p>
                            Un email de vérification vous a été envoyé sur votre
                            adresse email.
                        </p>
                    </CardContent>
                </Card>
            );
        return body;
    }
}

import { Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Validators } from "./lib/validators";
import UserService from "./services/UserService";
import { FormValue, isFormValid, validateFormValue } from "./types/generic";
import { VerifyResponse } from "./types/userapi";

export function UserForgot(): JSX.Element {
    const { id, chain } = useParams();
    const [resp, setResp] = useState<VerifyResponse>();
    const [pwd, setPwd] = useState<FormValue<string>>({
        value: '',
        error: false,
        errorMessage: 'Champ requis',
        validators: [Validators.Required],
    });
    const [pwdv, setPwdv] = useState<FormValue<string>>({
        value: '',
        error: false,
        errorMessage: 'Champ requis',
        validators: [Validators.Required],
    });
    const [mismatchMessage, setMismatch] = useState<string>();
    const userService = new UserService();

    return (
        resp ?
            resp.id && resp.verified ?
            <Card>
                <CardContent>
                    <p>
                        Votre mot de passe a été modifié avec succès
                    </p>
                    <p>
                        Vous pouvez à présent vous <Link to="/login">connecter</Link>
                    </p>
                </CardContent>
            </Card>
            :
            <Card>
                <CardContent>
                    <p>Une erreur est survenue</p>
                    <p>Veuillez <a href="mailto:dorian.vuolo@gmail.com">contacter</a> l'administrateur de ce site </p>
                </CardContent>
            </Card>
        :
        <form
            onSubmit={(event) => {
                event.preventDefault();
                const form = {
                    pwd: pwd,
                    pwdv: pwdv,
                };
                console.log(form);
                if (isFormValid(form) && id && chain) {
                    const nid = Number.parseInt(id);
                    if (nid) {
                        if (pwd.value === pwdv.value) {
                            userService.changePassword({
                                id: nid,
                                chain: chain,
                                pwd: pwd.value
                            }).then(response => setResp(response));
                        } else {
                            setMismatch('Les mots de passe ne sont pas identiques');
                        }
                    }
                }
            }}
        >
            <Card>
                <CardHeader title="Réinitialisez votre mot de passe" />
                <CardContent>
                    <TextField
                        id="pwd"
                        label="Mot de passe"
                        variant="outlined"
                        error={pwd.error}
                        type="password"
                        helperText={pwd.error ? pwd.errorMessage:''}
                        onChange={(event) => setPwd({
                            ...pwd,
                            value: event.target.value,
                        })}
                        onBlur={(_e) => {
                            setPwd({
                                ...pwd,
                                error: !validateFormValue(pwd),
                            });
                        }}
                    />
                    <br />
                    <br />
                    <TextField
                        id="pwdv"
                        label="Vérifiez votre mot de passe"
                        variant="outlined"
                        type="password"
                        error={pwdv.error}
                        helperText={pwdv.error ? pwdv.errorMessage : ''}
                        onChange={(event) => setPwdv({
                            ...pwdv,
                            value: event.target.value,
                        })}
                        onBlur={(_e) => {
                            setPwdv({
                                ...pwdv,
                                error: !validateFormValue(pwdv),
                            });
                        }}
                    />
                    <br />
                    <br />
                    <div>{mismatchMessage}</div>
                </CardContent>
                <CardActions>
                    <Button
                        type="submit"
                        sx={{
                            display: 'block',
                            width: '100px',
                            margin: 'auto',
                        }}>
                        Envoyer
                    </Button>
                </CardActions>
            </Card>
        </form>
    )
}
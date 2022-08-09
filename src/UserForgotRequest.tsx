import { Button, Card, CardActions, CardContent, TextField } from "@mui/material";
import { display } from "@mui/system";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Validators } from "./lib/validators";
import UserService from "./services/UserService";
import { FormValue, isFormValid, validateFormValue } from "./types/generic";
import { VerifyResponse } from "./types/userapi";

export function UserForgotRequest(): JSX.Element {
    const userService = new UserService();
    const [resp, setResp] = useState<VerifyResponse>();
    const [email, setEmail] = useState<FormValue<string>>({
        value: '',
        error: false,
        errorMessage: 'Email invalide',
        validators: [
            Validators.Required,
            Validators.Email,
        ]
    });

    return(
        resp ? 
            resp.id ? 
            <Card>
                <CardContent>
                    <p>
                        Un email contenant un lien pour réinitialiser Votre
                        mot de passe a été envoyé sur votre addresse.
                    </p>
                    <p>
                        Veuillez vérifier vos mails.
                    </p>
                    <Link to="/login">Accueil</Link>
                </CardContent>
            </Card>
            :
            <Card>
                <CardContent>
                    <p>
                        Impossible de trouver un utilisateur valide 
                        utilisant ce mot de passe.
                    </p>
                    <p>
                        Veuillez rééssayer ultérieurement 
                    </p>
                    <Link to="/login">Accueil</Link>
                </CardContent>
            </Card>
        :
        <form onSubmit={(event) => {
            event.preventDefault();
            const form = {
                email: email,
            };
            if (isFormValid(form)) {
                userService.forgotPasswordRequest({
                    email: email.value,
                }).then(resp => {
                    setResp(resp);
                });
            }
        }}>
            <Card>
                <CardContent>
                    <div>
                        Veuillez saisir votre adresse Email
                    </div>
                    <br />
                    <div>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            onChange={(event) => {
                                setEmail({
                                    ...email,
                                    value: event.target.value,
                                });
                            }}
                            onBlur={(_e) => {
                                setEmail({
                                    ...email,
                                    error: !validateFormValue(email),
                                })
                            }}
                        />
                    </div>
                </CardContent>
                <CardActions>
                    <Button sx={{
                            display: 'block',
                            width: '100px',
                            margin: 'auto',
                        }}
                        type="submit">
                        Envoyer
                    </Button>
                </CardActions>
            </Card>
        </form>
    )
}
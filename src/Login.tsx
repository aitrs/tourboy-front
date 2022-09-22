import Button from "@mui/material/Button/Button";
import Card from "@mui/material/Card/Card";
import CardActions from "@mui/material/CardActions/CardActions";
import CardContent from "@mui/material/CardContent/CardContent";
import CardHeader from "@mui/material/CardHeader/CardHeader";
import TextField from "@mui/material/TextField/TextField";
import React from "react";
import BaseService from "./services/BaseService";
import LoginService from "./services/UserService";
import "./Login.css";
import { Link } from "react-router-dom";

interface LoginState {
    email?: string;
    pwd?: string;
    loginError: string;
}

export default class Login extends React.Component {
    private _loginService = new LoginService();

    constructor(props: Object) {
        super(props);
        let st: LoginState = {
            email: undefined,
            pwd: undefined,
            loginError: "",
        };

        this.state = st;
    }

    pwdChange(event: any) {
        let st: LoginState = this.state as unknown as LoginState;
        st.pwd = event.currentTarget.value;
        this.setState(st);
    }

    emailChange(event: any) {
        let st: LoginState = this.state as unknown as LoginState;
        st.email = event.currentTarget.value;
        this.setState(st);
    }

    async googleResponse(user: any) {
        console.log(user);
    }

    async submit(event: any) {
        event.preventDefault();
        let st = this.state as unknown as LoginState;
        if (st.email && st.pwd) {
            const resp = await this._loginService.login(st.email, st.pwd);
            if (resp.status) {
                BaseService.jwt = resp.jwt;
                const win: Window = window;
                win.location = "/";
            } else {
                st.loginError = "Mauvais identifiants";
                this.setState(st);
            }
        } else {
            st.loginError = "Identifiants vides";
            this.setState(st);
        }
    }

    moveToRegister() {
        const win: Window = window;
        win.location = "/register";
    }

    render(): JSX.Element {
        return (
            <form onSubmit={this.submit.bind(this)}>
                <Card id="card" sx={{ minWidth: 300 }}>
                    <CardHeader title="Login" />
                    <CardContent>
                        {(this.state as unknown as LoginState).loginError}
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            onChange={this.emailChange.bind(this)}
                        />
                        <br />
                        <br />
                        <TextField
                            id="pwd"
                            label="Password"
                            variant="outlined"
                            type="password"
                            onChange={this.pwdChange.bind(this)}
                        />
                        <br />
                        <Link to="/forgot">Mot de passe oublié</Link>
                    </CardContent>
                    <CardActions className="accactions">
                        <Button className="accbutton" type="submit">
                            Login
                        </Button>
                        <Button
                            onClick={this.moveToRegister}
                            className="accbutton"
                            type="button"
                        >
                            S'inscrire
                        </Button>
                    </CardActions>
                </Card>
                <p>
                    <a href="https://github.com/aitrs/tourboy-front/issues/new">
                        Je rencontre un bug
                    </a>
                </p>
            </form>
        );
    }
}

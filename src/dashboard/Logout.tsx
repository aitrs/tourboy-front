import { Button } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import BaseService from "../services/BaseService";

export default class Logout extends React.Component {
    constructor(props: any) {
        super(props);
    }

    click() {
        BaseService.removeJwt();
        const win: Window = window;
        win.location = "/";
    }

    render(): JSX.Element {
        return <Button onClick={this.click.bind(this)}>Logout</Button>;
    }
}

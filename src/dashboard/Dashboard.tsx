import React from "react";
import Logout from "./Logout";

export default class Dashboard extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <div className="dashboard">
                <Logout />
                <p>Dashboard</p>
            </div>
        );
    }
}
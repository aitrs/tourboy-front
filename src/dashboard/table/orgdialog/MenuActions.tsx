import { Button, Icon, Menu, MenuItem } from "@mui/material";
import React from "react";
import { Org, OrgStatus } from "../../../types/orgapi";

export interface MenuActionsProps {
    org: Org,
    idUser?: number,
    idBand?: number,
    isAdmin?: boolean,
    isAffected?: boolean,
    onAffectation: (org: Org) => void,
    onStatusAffectation: (org: Org, status: OrgStatus, idUser: number) => void,
}

export interface MenuActionState {
    anchorEl?: HTMLElement,
    subMenuAnchor?: HTMLElement,
}

export class MenuActions extends React.Component<MenuActionsProps, MenuActionState> {
    constructor(props: MenuActionsProps) {
        super(props);
        this.state = {
        };
    }

    handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        this.setState({
            ...this.state,
            anchorEl: event.currentTarget,
        });
    }

    handleClose(event: any) {
        event.stopPropagation();
        this.setState({
            ...this.state,
            anchorEl: undefined,
            subMenuAnchor: undefined,
        });
    }

    handleStateClick(event: any) {
        event.stopPropagation();
        this.setState({
            ...this.state,
            subMenuAnchor: event.currentTarget,
        });
    }

    handleChangeState(event: any, state: OrgStatus) {
        event.stopPropagation();
        this.props.onStatusAffectation(this.props.org, state, this.props.idUser as  number);
        this.setState({
            ...this.state,
            anchorEl: undefined,
            subMenuAnchor: undefined,
        })
    }

    handleAffectation(event: any, org: Org) {
        event.stopPropagation();
        this.props.onAffectation(org);
        this.setState({
            ...this.state,
            anchorEl: undefined,
        });
    }

    render(): JSX.Element {
        const open = Boolean(this.state.anchorEl);
        const handleState = this.handleChangeState.bind(this);
        return(
            <div className="menuactions">
                
                <Button
                    onClick={this.handleClick.bind(this)}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Icon>more_vert</Icon>
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={this.state.anchorEl}
                    open={open}
                    onClose={this.handleClose.bind(this)}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem disabled={!this.props.isAffected} onClick={this.handleStateClick.bind(this)}>
                        Etat
                        <Menu
                            anchorEl={this.state.subMenuAnchor}
                            open={Boolean(this.state.subMenuAnchor)}
                            
                            onClose={this.handleClose.bind(this)}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={(e) => { handleState(e, 'raise')} }>Relancer</MenuItem>
                            <MenuItem onClick={(e) => { handleState(e, 'success')} }>Succès</MenuItem>
                            <MenuItem onClick={(e) => { handleState(e, 'failure')} }>Echec</MenuItem>
                            <MenuItem onClick={(e) => { handleState(e, 'pending')} }>En Attente</MenuItem>
                            <MenuItem onClick={(e) => { handleState(e, 'todo')} }>Todo</MenuItem>
                        </Menu>
                    </MenuItem>
                    <MenuItem disabled={!this.props.isAdmin} onClick={(event) => {
                        const handleAffectation = this.handleAffectation.bind(this);
                        handleAffectation(event, this.props.org);
                    }}>Affecter
                    </MenuItem>
                </Menu>
            </div>
        )
    }
}
import React from "react";
import Logout from "./Logout";
import UserService from '../services/UserService';
import BandList from "./band/BandList";
import { Band, User } from "../types/userapi";
import BaseService from "../services/BaseService";
import { Chip, Drawer, ListItem, Paper } from "@mui/material";
import './Dashboard.css';
import { KickDialog } from "./band/KickDialog";
import { OrgTable } from "./table/OrgTable";

interface DashboardState {
    bands: Array<Band>,
    currentMembers: Array<User>,
    allRetrieved: boolean,
    kickOpened: boolean,
    selected?: Band,
    bandAdmin?: Array<User>,
    userToKick?: User,
}

export default class Dashboard extends React.Component<{}, DashboardState> {
    private userService = new UserService();

    constructor(props: any) {
        super(props);

        this.state = {
            bands: [],
            currentMembers: [],
            allRetrieved: false,
            kickOpened: false,
        };

        if(BaseService.isJwtExpired) {
            const w: Window = window;
            w.location = 'login';
        }
    }

    componentDidMount() {
        this.userService.getBands().then(bands => {
          this.setState({
            bands,
            allRetrieved: true,
          })  
        });
    }

    handleMembers(members: Array<User>) {
        this.setState({
            ...this.state,
            currentMembers: members,
        })
    }

    handleMemberRemoval(user: User) {
        this.setState({
            ...this.state,
            kickOpened: true,
            userToKick: user,
        })
    }

    handleKick(user: User, idBand: number) {
        if (this.state.bands.find(b => b.id === idBand)) {
            const index = this.state.currentMembers.findIndex(m => m.id === user.id);
            
            if (index !== -1) {
                this.state.currentMembers.splice(index, 1);
                this.setState({
                    ...this.state,
                    kickOpened: false,
                })
            }
        }
    }

    handleMemberAdd(member: User) {
        this.setState({
            ...this.state,
            currentMembers: [...this.state.currentMembers, member],
        })
    }

    handleAddBand(band: Band, create: boolean) {
        if (create) {
            this.state.bands.push(band);
        } else {
            const i = this.state.bands.findIndex(b => b.id === band.id);
            if (i !== -1) {
                let bands = this.state.bands;

                bands[i].name = band.name;
                this.setState({
                    ...this.state,
                    bands,
                })
            }
        }
    }

    handleKickCancel() {
        this.setState({
            ...this.state,
            kickOpened: false,
        });
    }

    handleSelected(band: Band) {
        this.setState({
            ...this.state,
            selected: band,
        })
    }

    handleAdmins(users: Array<User>) {
        this.setState({
            ...this.state,
            bandAdmin: users,
        })
    }

    renderChips() {
        return(
            <Paper
                sx={{
                display: 'flex',
                flexDirection: 'horizontal',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
                }}
                className="topbandchips"
                title="Membres"
            >
                {this.state.currentMembers.map(m => {
                    return (
                        <ListItem
                            key={m.id}
                            className="memberlistitem"
                        >
                            <Chip
                                label={m.pseudo}
                                onDelete={m.isAdmin ? undefined : (event) => {
                                    const handleRemoval = this.handleMemberRemoval.bind(this);
                                    handleRemoval(m);
                                }}
                            />
                        </ListItem>
                    );
                })}
            </Paper>
        )
    }

    render() {
        if (this.state.allRetrieved) {
            const chips = this.renderChips();
            return (
                <div className="dashboard">
                    <Logout />
                    <div className="topband">
                        <BandList
                            bands={this.state.bands} 
                            onMembers={this.handleMembers.bind(this)}
                            onAddMember={this.handleMemberAdd.bind(this)}
                            onAddBand={this.handleAddBand.bind(this)}
                            onSelected={this.handleSelected.bind(this)}
                            onAdmins={this.handleAdmins.bind(this)}
                        />
                        {chips}
                        <KickDialog
                            open={this.state.kickOpened}
                            onKick={this.handleKick.bind(this)}
                            onCancel={this.handleKickCancel.bind(this)}
                            idBand={this.state.selected ? this.state.selected.id : undefined}
                            userToKick={this.state.userToKick as User}
                        />
                    </div>
                    <OrgTable bandUsers={this.state.currentMembers} idBand={this.state.selected?.id} bandAdmins={this.state.bandAdmin} />
                </div> 
            );
        } else {
            return (
                <div className="dashboard">
                    Chargement...
                </div>
            );
        }
    }
}
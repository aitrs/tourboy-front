import { Button, FormControl, Icon, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import React from "react";
import BandService from "../../services/BandService";
import { Band, User } from "../../types/userapi";
import { BandDialog } from "./BandDialog";
import './BandList.css';
import { MemberDialog } from "./MemberDialog";
export interface BandListProps {
    bands: Array<Band>,
    onAddMember: (member: User) => void;
    onAddBand: (band: Band, create: boolean) => void;
    onSelected: (band: Band, members: Array<User>, admins: Array<User>) => void;
    userToKick?: User,
}

export interface BandListState {
    dialogOpened: boolean,
    memberOpened: boolean,
    kickOpened: boolean,
    bands: Array<Band>,
    selected?: Band,
    isAdministed: boolean,
}

export default class BandList extends React.Component<BandListProps, BandListState> {
    private _bandService = new BandService();
    constructor(props: BandListProps) {
        super(props);
        this.state = {
            dialogOpened: false,
            memberOpened: false,
            kickOpened: this.props.userToKick ? true : false,
            bands: this.props.bands,
            isAdministed: false,
        };
    }

    handleBandChange(event: any) {
        const id = event.target.value;
        const found = this.state.bands.find(b => b.id === id);
        if (found) {
            this.setState({
                ...this.state,  
                selected: found,
            });
            this._bandService.members(id).then(mr => {
                this._bandService.admins(id).then(admins => {
                    this.props.onSelected(found, mr.members, admins);
                })
            });
            this._bandService.isAdmin(id).then(resp => {
                this.setState({
                    ...this.state,
                    isAdministed: resp.isAdmin,
                });
            });
        }
    }

    clickCreate() {
        this.setState({
            ...this.state,
            selected: undefined,
            dialogOpened: true,
        });
    }

    clickEdit() {
        this.setState({
            ...this.state,
            dialogOpened: true,
        })
    }

    clickMember() {
        this.setState({
            ...this.state,
            memberOpened: true,
        })
    }

    async handleDialogSubmit(value: string, id?: number) {
        if (id) {
            try {
                await this._bandService.updateBand(value, id);
                const index = this.state.bands.findIndex(b => b.id === id);
                if (index !== -1) {
                    this.state.bands[index].name = value;
                    this.props.onAddBand({
                        id,
                        name: value,
                    }, false);
                }

            } catch(e) {
                alert(JSON.stringify(e));
            }
        } else {
            try {
                const resp = await this._bandService.createBand(value);
                this.state.bands.push({
                    id: resp.id,
                    name: value,
                });
                this.props.onAddBand({
                    id: resp.id,
                    name: value,
                }, true)
            } catch(e) {
                alert(JSON.stringify(e));
            }
        }
        this.setState({
            ...this.state,
            dialogOpened: false,
        });
    }

    async handleAddMember(member: User) {
        this.props.onAddMember(member);
        this.setState({
            ...this.state,
            memberOpened: false,
        });
    }

    async handleMemberCancel() {
        this.setState({
            ...this.state,
            memberOpened: false,
        });
    }

    private _genTooltipTag(title: string, inner: JSX.Element): JSX.Element {
        if ((this.state.selected === undefined) || !this.state.isAdministed) {
            return(inner);
        } else {
            return(
                <Tooltip title={title} >
                    {inner}
                </Tooltip>
            );
        }
    }

    render() {
        let options = [];
        for(let b of this.props.bands) {
            options.push(
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
            );
        }

        return (
            <div className="band-selector">
                <FormControl fullWidth>
                    <InputLabel id="band-select-label">Groupe</InputLabel>
                    <Select 
                        labelId="band-select-label"
                        id="band-select"
                        label="Groupe"
                        value={this.state.selected? `${this.state.selected.id}` : ''}
                        onChange={this.handleBandChange.bind(this)}
                    >
                        {options}
                    </Select>
                </FormControl>
                <br />
                <br />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
                <div className="bandlistbuttons">
                    <Tooltip title="Ajouter un groupe">
                        <Button className="bandlistbuttonitem"
                            onClick={this.clickCreate.bind(this)}
                        >
                            <Icon>add</Icon>
                        </Button>
                    </Tooltip>
                    {this._genTooltipTag("Editer le nom du groupe",
                        <Button className="bandlistbuttonitem"
                            onClick={this.clickEdit.bind(this)}
                            disabled={(this.state.selected === undefined) || !this.state.isAdministed}
                        >
                            <Icon>edit</Icon>
                        </Button>
                    )}
                    {this._genTooltipTag("Ajouter un membre",
                        <Button className="bandlistbuttonitem"
                            onClick={this.clickMember.bind(this)}
                            disabled={(this.state.selected === undefined) || !this.state.isAdministed}
                        >
                            <Icon>people</Icon>
                        </Button>
                    )}
                </div>
                <BandDialog
                    open={this.state.dialogOpened}
                    onSubmit={this.handleDialogSubmit.bind(this)}
                    name={this.state.selected ? this.state.selected.name : undefined}
                    id={this.state.selected ? this.state.selected.id : undefined}
                />
                <MemberDialog
                    open={this.state.memberOpened}
                    onAdd={this.handleAddMember.bind(this)}
                    bandId={this.state.selected ? this.state.selected.id : -1}
                    onCancel={this.handleMemberCancel.bind(this)}
                />
            </div>
        )
    }
}
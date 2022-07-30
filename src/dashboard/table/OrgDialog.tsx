import { Button, Card, CardActions, CardContent, CardHeader, Chip, Dialog, Icon, ListItem, Paper } from "@mui/material";
import React from "react";
import NoteService from "../../services/NoteService";
import OrgService from "../../services/OrgService";
import { Note } from "../../types/noteapi";
import { Contact, Org } from "../../types/orgapi";
import './OrgDialog.css';

export interface OrgDialogProps {
    idBand: number,
    org: Org,
    open: boolean,
    onCancel: () => void,
}

export interface OrgDialogState {
    contactDialogOpened: boolean,
    contactDialogData?: Contact,
    contacts: Array<Contact>,
    notes: Array<Note>,
    loaded: boolean,
}

export class OrgDialog extends React.Component<OrgDialogProps, OrgDialogState> {
    private _orgService = new OrgService();
    private _noteService = new NoteService();

    constructor(props: OrgDialogProps) {
        super(props);
        this.state = {
            contactDialogOpened: false,
            contacts: [],
            notes: [],
            loaded: false,
        };
    }

    private _load() {
        this._orgService.getContacts(this.props.org.idOrg, this.props.idBand)
            .then(contacts => {
                this.setState({
                    ...this.state,
                    contacts,
                }, () => {
                    this._noteService
                        .readNotes(this.props.org.idActivity, this.props.idBand)
                        .then(notes => {
                            this.setState({
                                ...this.state,
                                notes,
                            }, () => {
                                this.setState({
                                    ...this.state,
                                    loaded: true,
                                });
                            })
                        });
                });
            });
    }

    componentDidUpdate() {
        if(this.props.org && !this.state.loaded) {
            this._load();
        }
    }

    handleCancel(_event: any) {
        this.props.onCancel();
    }
 
    renderChips(): JSX.Element {
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
                    minHeight: 20,
                }}
                className="contactchips"
                title="Contacts"
            >
                {this.state.contacts.map(m => {
                    return (
                        <ListItem
                            key={m.id}
                            className="memberlistitem"
                        >
                            <Chip
                                label={`${m.first_name} ${m.name}`}
                                onDelete={(_event) => {
                                }}
                            />
                        </ListItem>
                    );
                })}
            </Paper>
        )
    }

    renderNotes(): JSX.Element {
        return(
            <Paper
                className="notepaper"
                title="Notes"
                sx={{
                    minHeight: 20,
                }}
            >
                {
                    this.state.notes.map((n) => {
                        return(
                            <p className="notep">
                                <div className="notephead">
                                    <span className="notepheadtime">
                                        {n.creationStamp.toLocaleString()}
                                    </span>
                                    <span className="notepheaduser">
                                        {n.user ? n.user.pseudo : ''}
                                    </span>
                                </div>
                                <div className="notepbody">{n.note}</div>
                            </p>
                        )
                    })
                }
            </Paper>
        )
    }

    render(): JSX.Element {
        const porg = this.props.org;
        if (this.state.loaded) {
            const chips = this.renderChips();
            const notes = this.renderNotes();

            return(
                <Dialog
                    open={this.props.open}
                    fullWidth={true}
                    maxWidth={'lg'}
                >
                    <Card>
                        <CardHeader
                            title="Organisme"
                        />
                        <CardContent className="orgdialogcontent">
                            <div className="orgdialogflextop">
                                <div className="orgfirsthalf">
                                    <strong>Id:</strong><br />
                                    <strong>Nom:</strong><br />
                                    <strong>Description:</strong><br />
                                    <strong>Activité:</strong><br />
                                    <strong>Ville:</strong><br />
                                    <strong>Code Postal:</strong><br />
                                    <strong>Catégorie:</strong><br />
                                    <strong>Date de création:</strong><br />
                                </div>
                                <div className="orgsecondhalf">
                                    {porg.idActivity}<br />
                                    {porg.name}<br />
                                    {porg.description1}<br />
                                    {porg.description2}<br />
                                    {porg.city}<br />
                                    {porg.zipCode}<br />
                                    {porg.category}<br />
                                    {porg.creationStamp.toLocaleString()}<br />
                                </div>
                            </div>
                            {chips}
                            {notes}
                            <div className="orginneractions">
                                <Button className="orginnerbutton">
                                    Ajouter contact
                                    <Icon>people</Icon>
                                </Button>
                                <Button className="orginnerbutton">
                                    Ajouter note
                                    <Icon>edit</Icon>
                                </Button>
                            </div>
                        </CardContent>
                        <CardActions id="bandactions">
                            <Button
                                onClick={this.handleCancel.bind(this)}
                            >
                                <Icon>cancel</Icon>
                            </Button>
                        </CardActions>
                    </Card>
                </Dialog>
            )
        } else {
            return(<div>Chargement...</div>)
        }
    }
}
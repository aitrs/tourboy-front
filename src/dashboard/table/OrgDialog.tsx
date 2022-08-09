import { Button, Card, CardActions, CardContent, CardHeader, Chip, Dialog, Divider, Icon, ListItem, Paper } from "@mui/material";
import React from "react";
import { dateFormatAny } from "../../lib/lib";
import NoteService from "../../services/NoteService";
import OrgService from "../../services/OrgService";
import { Note } from "../../types/noteapi";
import { Contact, Org } from "../../types/orgapi";
import { User } from "../../types/userapi";
import { ContactDialog } from "./ContactDialog";
import './OrgDialog.css';
import { NoteDialog } from "./orgdialog/NoteDialog";

export interface OrgDialogProps {
    idBand: number,
    org: Org,
    open: boolean,
    bandAdmins?: Array<User>,
    onCancel: () => void,
}

export interface OrgDialogState {
    contactDialogOpened: boolean,
    contactDialogData?: Contact,
    contacts: Array<Contact>,
    notes: Array<Note>,
    noteDialogOpen: boolean,
    currentEditedNote?: Note,
    currentEditedContact?: Contact,
    loaded: boolean,
    prevProps?: OrgDialogProps,
    contactDialogOpen: boolean,
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
            noteDialogOpen: false,
            loaded: false,
            contactDialogOpen: false,
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
        if (this.state.prevProps) {
            if (this.props !== this.state.prevProps) {
                this.setState({
                    ...this.state,
                    prevProps: this.props,
                }, () => {
                    this._load();
                });
            }
        } else {
            if (this.props.org) {
                this.setState({
                    ...this.state,
                    prevProps: this.props,
                }, () => {
                    this._load();
                });
            }
        }
    }

    handleCancel(_event: any) {
        this.setState({
            ...this.state,
            loaded: false,
        });
        this.props.onCancel();
    }

    handleNoteDialogOpen() {
        this.setState({
            ...this.state,
            currentEditedNote: undefined,
            noteDialogOpen: true,
        })
    }

    handleNoteDialogCancel() {
        this.setState({
            ...this.state,
            noteDialogOpen: false,
            currentEditedNote: undefined,
        });
    }

    handleNoteDialogSave(note: Note) {
        const newnotes = [note, ...this.state.notes];
        this.setState({
            ...this.state,
            notes: newnotes,
            noteDialogOpen: false,
            currentEditedNote: undefined,
        });
    }

    handleNoteDialogEdit(note: Note) {
        let notes = this.state.notes;
        const index = notes.findIndex(n => note.id === n.id);
        
        if(index !== -1) {
            notes[index].note = note.note;
            this.setState({
                ...this.state,
                notes,
                noteDialogOpen: false,
                currentEditedNote: undefined,
            });
        }
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
                            key={`${m.id}listcontacts`}
                            className="memberlistitem"
                        >
                            <Chip
                                onClick={(_ev) =>  {
                                    this.setState({
                                        ...this.state,
                                        currentEditedContact: m,
                                        contactDialogOpen: true,
                                    });
                                }}
                                label={`${m.firstName} ${m.name}`}
                                onDelete={(_event) => {
                                    this._orgService.deleteContact(m.id)
                                        .then(contact => {
                                            let contacts = this.state.contacts;
                                            const index = contacts.findIndex(c => c.id === contact.id);
                                            if(index !== -1) {
                                                contacts.splice(index, 1);
                                                this.setState({
                                                    ...this.state,
                                                    contacts,
                                                });
                                            }
                                        });
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
                    minHeight: '25vh',
                    maxHeight: '25vh',
                    scrollbarColor: 'gray',
                    overflowY: 'scroll', 
                    '&::-webkit-scrollbar': {
                        width: '0.4em'
                        },
                        '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        outline: '1px solid slategrey'
                        }
                }}
            >
                {
                    this.state.notes.map((n) => {
                        const isEditable: boolean = n.user ? n.user.id === this._noteService.userId : false;
                        const isDeletable: boolean = this.props.bandAdmins ? this.props.bandAdmins.findIndex(u => u.id === this._noteService.userId) !== -1 : false;
                        return(
                            <div className="notep" key={n.id}>
                                <div className="notephead">
                                    <span className="notepheaduser">
                                        {n.user ? n.user.pseudo : ''}
                                    </span>
                                    <span className="notepheadtime">
                                        {dateFormatAny(n.creationStamp.toLocaleString())}
                                    </span>
                                    {isEditable ? <Button onClick={(_e) => {
                                        this.setState({
                                            ...this.state,
                                            currentEditedNote: n,
                                        }, () => {
                                            this.setState({
                                                ...this.state,
                                                noteDialogOpen: true,
                                            })
                                        });
                                    }}>
                                        <Icon>edit</Icon>
                                    </Button> : 
                                    <span></span>}
                                    {
                                        isDeletable ?
                                            <Button onClick={async (_e) => {
                                                const note = await this._noteService.deleteNote(n.id, this.props.idBand);
                                                const index = this.state.notes.findIndex(nn => nn.id === note.id);
                                                if (index !== -1) {
                                                    let notes = this.state.notes;
                                                    notes.splice(index, 1);
                                                    this.setState({
                                                        ...this.state,
                                                        notes,
                                                    });
                                                }
                                            }}><Icon>delete</Icon></Button>
                                            :
                                            <span></span>
                                    }
                                </div>
                                <div className="notepbody">{n.note}</div>
                            </div>
                        )
                    })
                }
            </Paper>
        )
    }

    

    render(): JSX.Element {
        const porg = this.props.org;
        const chips = this.renderChips();
        const notes = this.renderNotes();
        const dialogInner: JSX.Element = 
        this.state.loaded ?
            <Card>
                <CardHeader
                    title="Organisme"
                >
                </CardHeader>
                <CardContent className="orgdialogcontent">
                    <div
                        style={{
                            textAlign: 'right',
                            marginTop: '-20px',
                        }}
                    >
                        <Button
                            onClick={this.handleCancel.bind(this)}
                        >
                            <Icon>cancel</Icon>
                        </Button>
                    </div>
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
                            {dateFormatAny(porg.creationStamp.toLocaleString())}<br />
                        </div>
                    </div>
                    <br />
                    <Divider>Contacts</Divider>
                    <div>
                        {chips}
                    </div>
                    <Divider>Notes</Divider>
                    <div>
                        {notes}
                    </div>
                    <div className="orginneractions">
                        <Button onClick={(_) => this.setState({...this.state, contactDialogOpen: true, currentEditedContact: undefined})} className="orginnerbutton">
                            Ajouter contact
                            <Icon>people</Icon>
                        </Button>
                        <Button className="orginnerbutton" onClick={this.handleNoteDialogOpen.bind(this)}>
                            Ajouter note
                            <Icon>edit</Icon>
                        </Button>
                    </div>
                </CardContent>
                <NoteDialog 
                    idActivity={this.props.org.idActivity}
                    idBand={this.props.idBand}
                    open={this.state.noteDialogOpen}
                    onCancel={this.handleNoteDialogCancel.bind(this)}
                    onEdit={this.handleNoteDialogEdit.bind(this)}
                    onSave={this.handleNoteDialogSave.bind(this)}
                    note={this.state.currentEditedNote}
                    key={this.state.currentEditedNote ? this.state.currentEditedNote.id : 0}
                />
                <ContactDialog
                    contact={this.state.currentEditedContact}
                    idOrg={this.props.org.idOrg}
                    idBand={this.props.idBand}
                    open={this.state.contactDialogOpen}
                    onCancel={() => this.setState({...this.state, contactDialogOpen: false})}
                    onSave={(contact) => {
                        if (this.state.currentEditedContact) {
                            let contacts = this.state.contacts;
                            const index = contacts.findIndex(c => c.id === contact.id);
                            if (index !== -1) {
                                contacts[index] = contact;
                                this.setState({
                                    ...this.state,
                                    contacts,
                                    contactDialogOpened: false,
                                });
                            }
                        } else {
                            let st = this.state;
                            this.setState({
                                ...this.state, 
                                contacts: [...this.state.contacts, contact],
                                contactDialogOpen: false,
                                currentEditedContact: undefined,
                            })
                        }
                    }}
                    key={this.state.currentEditedContact ? `${this.state.currentEditedContact.id}contdial` : '0contdial'}
                />
                <CardActions id="bandactions">
                </CardActions>
            </Card>
        :
            <div>Chargement...</div>;

        return(
            <Dialog
                open={this.props.open}
                fullWidth={true}
                maxWidth={'lg'}
            >
                {dialogInner}
            </Dialog>
        )
    }
}
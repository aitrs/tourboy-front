import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React from "react";
import NoteService from "../../../services/NoteService";
import { FormValue } from "../../../types/generic";
import { Note } from "../../../types/noteapi";

export interface NoteDialogProps {
    idBand: number,
    idActivity: number,
    open: boolean,
    onCancel:() => void,
    onSave:(note: Note) => void,
    onEdit:(note: Note) => void,
    note?: Note,
}

export interface FormValues {
    note: FormValue<string>,
}

export interface NoteDialogState {
    formValues: FormValues,
    saveId?: number,
    prevProps?: NoteDialogProps,
    fetched: boolean,
}

export class NoteDialog extends React.Component<NoteDialogProps, NoteDialogState> {
    private _noteService = new NoteService();
    constructor(props: NoteDialogProps) {
        super(props);
        this.state = {
            formValues: {
                note: {
                    value: this.props.note ? this.props.note.note : '',
                    error: false,
                    errorMessage: 'La note ne doit pas être vide',
                }
            },
            fetched: false,
        };
    }

    async handleSubmit(event: any) {
        event.preventDefault();
        if (this.state.formValues.note.value === '') {
            this.setState({
                ...this.state,
                formValues: {
                    note: {
                        ...this.state.formValues.note,
                        error: true,
                    }
                }
            });
        } else {
            if (this.state.saveId) {
                this._noteService.editNote(this.state.saveId, this.state.formValues.note.value)
                    .then(updated => {
                        this.props.onEdit(updated);
                    });
            } else {
                this._noteService.createNote(
                    this.props.idBand,
                    this.props.idActivity,
                    this.state.formValues.note.value,
                ).then(newnote => {
                    this.props.onSave(newnote);
                });

            }
        }
    }

    performUpdate() {
        if (this.props.note) {
            this.setState({
                ...this.state,
                formValues: {
                    note: {
                        ...this.state.formValues.note,
                        value: this.props.note.note,
                    },
                },
                saveId: this.props.note.id,
            });
        }
    }

    componentDidMount() {
        this.performUpdate();
    }

    async handleCancel(_event: any) {
        this.props.onCancel();
    }

    async handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        this.setState({
            ...this.state,
            formValues: {
                note: {
                    ...this.state.formValues.note,
                    value,
                }
            }
        });
    }

    render(): JSX.Element {
        return(
            <Dialog
                open={this.props.open}
            >
                <form onSubmit={this.handleSubmit.bind(this)}>
                        <DialogTitle>{"Note"}</DialogTitle>
                        <DialogContent
                            style={{ height: '25vh', width: '20vw'}}
                        >
                            <TextField
                                id="note"
                                label="Note"
                                variant="outlined"
                                multiline
                                fullWidth
                                rows={10}
                                value={this.state.formValues.note.value}
                                required
                                onChange={this.handleChange.bind(this)}
                            />
                        </DialogContent>
                        <DialogActions className="dialogactions">
                            <Button type="submit">
                                Sauvegarder  
                            </Button> 
                            <Button type="button" onClick={this.handleCancel.bind(this)}>
                                Annuler
                            </Button>
                        </DialogActions>
                </form>
            </Dialog>
        )
    }
}
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, TextField } from "@mui/material";
import React from "react";
import { FormValue } from "../../types/generic";

export interface BandDialogProps {
    name?: string,
    id?: number,
    open: boolean,
    onSubmit: (value: string, id?: number) => void,
}

export interface BandDialogState {
    formValues: FormValues,
}

interface FormValues {
    name: FormValue<string>,
}

export class BandDialog extends React.Component<BandDialogProps, BandDialogState> {

    constructor(props: BandDialogProps) {
        super(props);
        this.state = {
            formValues:  {
                name: {
                    value: '',
                    error: false,
                    errorMessage: 'Le nom ne peut pas être vide',
                    validators: [],
                }
            },
        };
    }

    async handleSubmit(event: any) {
        event.preventDefault();
        if (this.state.formValues.name.value === '') {
            this.setState({
                ...this.state,
                formValues: {
                    name: {
                        ...this.state.formValues.name,
                        error: true,
                    }
                }
            })
        } else {
            this.props.onSubmit(this.state.formValues.name.value, this.props.id);
        }
    }

    handleChange(event: any) {
        const value = event.target.value;
        this.setState({
            ...this.state,
            formValues: {
                name: {
                    ...this.state.formValues.name,
                    value,
                }
            }
        });
    }

    render(): JSX.Element {
        return (
            <Dialog 
                open={this.props.open}>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Card id="bandform" sx={{ minWidth: 300 }}>
                        <CardHeader
                            title="Edition Groupe"
                        />
                        <CardContent>
                            <TextField 
                                id="name" 
                                label="Nom" 
                                variant="outlined" 
                                value={this.state.formValues.name.value}
                                error={this.state.formValues.name.error}
                                required
                                helperText={this.state.formValues.name.error && this.state.formValues.name.errorMessage}
                                onChange={this.handleChange.bind(this)}
                                />
                            <br />
                        </CardContent>
                    </Card>
                    <CardActions id="bandactions">
                        <Button type="submit">
                            Sauvegarder
                        </Button>
                    </CardActions>
                </form>
            </Dialog>
        )
    }
}
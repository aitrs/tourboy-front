import React from "react";
import { Validators } from "../../lib/validators";
import { FormValue } from "../../types/generic";

export interface ContactDialogState {
    formValues: {
        name: FormValue<string>,
        firstname: FormValue<string>,
        email: FormValue<string>,
        phone: FormValue<string>,
        address: FormValue<string>,
        zipCode: FormValue<string>,
        city: FormValue<string>,
    }
}

export interface ContactDialogProps {
    open: boolean;
}

export class ContactDialog extends React.Component<ContactDialogProps, ContactDialogState> {
    constructor(props: ContactDialogProps) {
        super(props);
        this.state = {
            formValues: {
                name: {
                    error: false,
                    errorMessage: 'Nom requis',
                    value: '',
                    validators: [Validators.Required],
                },
                firstname: {
                    error: false,
                    errorMessage: 'Prénom invalide',
                    value: '',
                    validators: [Validators.Required],
                },
                email: {
                    error: false,
                    errorMessage: 'Email invalide',
                    value: '',
                    validators: [Validators.Required],
                },
                phone: {
                    error: false,
                    errorMessage: 'Téléphone invalide',
                    value: '',
                    validators: [Validators.Required],
                },
                address: {
                    error: false,
                    errorMessage: '',
                    value: '',
                    validators: []
                },
                zipCode: {
                    error: false,
                    errorMessage: 'Code postal invalide',
                    value: '',
                    validators: [Validators.Required],
                },
                city: {
                    error: false,
                    errorMessage: '',
                    value: '',
                    validators: [],
                }
            }
        };
    }



}
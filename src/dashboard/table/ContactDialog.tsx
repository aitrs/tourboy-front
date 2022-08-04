import React from "react";
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
                },
                firstname: {
                    error: false,
                    errorMessage: 'Prénom invalide',
                    value: '',
                },
                email: {
                    error: false,
                    errorMessage: 'Email invalide',
                    value: '',
                },
                phone: {
                    error: false,
                    errorMessage: 'Téléphone invalide',
                    value: '',
                },
                address: {
                    error: false,
                    errorMessage: '',
                    value: '',
                },
                zipCode: {
                    error: false,
                    errorMessage: 'Code postal invalide',
                    value: '',
                },
                city: {
                    error: false,
                    errorMessage: '',
                    value: '',
                }
            }
        };
    }



}
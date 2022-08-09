import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { Validators } from "../../lib/validators";
import OrgService from "../../services/OrgService";
import { FormValue, isFormValid, validateFormValue } from "../../types/generic";
import { Contact } from "../../types/orgapi";

export interface ContactDialogProps {
    open: boolean,
    idBand: number,
    idOrg: number,
    contact?: Contact,
    onSave: (c: Contact) => void,
    onCancel: () => void,
}

function valorempty(field?: string) {
    return field ? field : '';
}

export function ContactDialog(props: ContactDialogProps): JSX.Element {
    const orgService = new OrgService();
    const [name, setName] = useState<FormValue<string>>({
        value: valorempty(props.contact?.name),
        errorMessage: 'Nom requis',
        error: false,
        validators: [Validators.Required], 
    });
    const [firstname, setFirstname] = useState<FormValue<string>>({
        value: valorempty(props.contact?.firstName),
        errorMessage: '',
        error: false,
        validators: [],
    });
    const [email, setEmail] = useState<FormValue<string>>({
        value: valorempty(props.contact?.email),
        errorMessage: 'Email invalide',
        error: false,
        validators: [Validators.Email],
    });
    const [phone, setPhone] = useState<FormValue<string>>({
        value: valorempty(props.contact?.phone),
        error: false,
        errorMessage: 'Téléhpone invalide',
        validators: [],
    });
    const [address, setAddress] = useState<FormValue<string>>({
        value: valorempty(props.contact?.address),
        error: false,
        errorMessage: 'Adresse invalide',
        validators: [],
    });
    const [zipCode, setZipCode] = useState<FormValue<string>>({
        error: false,
        value: valorempty(props.contact?.zipCode),
        errorMessage: 'Code postal invalide',
        validators: [],
    });
    const [city, setCity] = useState<FormValue<string>>({
        value: valorempty(props.contact?.city),
        error: false,
        errorMessage: '',
        validators: [],
    });

    const formValues = [
        {id: 'name',        label: 'Nom',          field: name,       setter: setName}, 
        {id: 'firstname',   label: 'Prénom',       field: firstname,  setter: setFirstname}, 
        {id: 'email',       label: 'Email',        field: email,      setter: setEmail}, 
        {id: 'phone',       label: 'Téléphone',    field: phone,      setter: setPhone}, 
        {id: 'address',     label: 'Adresse',      field: address,    setter: setAddress}, 
        {id: 'city',        label: 'Ville',        field: city,       setter: setCity},
        {id: 'zipCode',     label: 'Code postal',  field: zipCode,    setter: setZipCode},
    ];

    return(
        <Dialog
            open={props.open}
            >
            <DialogTitle>Ajouter un contact</DialogTitle>
            <form onSubmit={(ev) => {
                ev.preventDefault();
                let form = {
                    name: name,
                    firstname: firstname,
                    email: email,
                    phone: phone,
                    address: address,
                    city: city,
                    zipCode: zipCode,
                };
                if (isFormValid(form)) {
                    if (props.contact) {
                        orgService.updateContact({
                            id: props.contact.id,
                            name: name.value,
                            firstName: firstname.value,
                            email: email.value,
                            phone: phone.value,
                            address: address.value,
                            city: city.value,
                            zipCode: zipCode.value,
                            creationStamp: props.contact.creationStamp,
                        }).then(contact =>{
                            props.onSave(contact);
                        })
                    } else {
                        orgService.addContact(
                            props.idOrg,
                            props.idBand,
                            {
                                name: name.value,
                                firstName: firstname.value,
                                email: email.value,
                                phone: phone.value,
                                address: address.value,
                                city: city.value,
                                zipCode: zipCode.value,
                            },
                        ).then(contact => {
                            props.onSave(contact);
                        });
                    }
                }
            }}>
                <DialogContent>
                    {formValues.map(fv => {
                        return (
                            <div key={`contdialcont${fv.id}`}>
                                <TextField
                                    key={`condialfield${fv.id}`}
                                    id={fv.id}
                                    label={fv.label}
                                    value={fv.field.value}
                                    error={fv.field.error}
                                    helperText={fv.field.error ? fv.field.errorMessage : ''}
                                    onChange={(ev) => fv.setter({...fv.field, value: ev.target.value})}
                                    onBlur={(_) => fv.setter({
                                        ...fv.field,
                                        error: !validateFormValue(fv.field),
                                    })} 
                                />
                                <br />
                                <br />
                            </div>
                        )
                    })}
                </DialogContent>
                <DialogActions>
                    <div style={{width: '250px', margin: 'auto', display: 'flex'}}>
                        <Button
                            sx={{
                                flex: 1,
                            }}
                            type="submit">
                            Sauvegarder
                        </Button>
                        <Button 
                            onClick={(_) => props.onCancel()}
                            sx={{
                                flex: 1,
                            }}
                            type="button">
                            Fermer
                        </Button>
                    </div>

                </DialogActions>
            </form>
        </Dialog>
    )
}
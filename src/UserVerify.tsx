import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import UserService from "./services/UserService";
import { VerifyResponse } from "./types/userapi";

export interface UserVerifyState {
    resp?: VerifyResponse,
}

export function UserVerify() {
    const _userService = new UserService();
    const { id, chain } = useParams();
    const [resp, setResp] = useState<VerifyResponse>();

    useEffect(() => {
        if (id && chain && !resp) {
            const idn = Number.parseInt(id);
            if(idn) {
                _userService.verify(idn, chain)
                    .then(r => {
                        setResp(r);
                    })
            }
        }
    });

    const body = resp ?
        <Card>
            <CardContent>
                {
                    resp.verified ?
                        <p>
                            Votre compte a été vérifié.
                            Vous pouvez vous <Link to="/login">connecter</Link>. 
                        </p>
                        :
                        <p>
                            Impossible de vous vérifier.
                            Veuillez rééssayer ultérieurement.
                        </p>
                }
            </CardContent>
        </Card>
        :
        <Card>
            <CardContent>
                Un instant...
            </CardContent>
        </Card>
    return body;
}
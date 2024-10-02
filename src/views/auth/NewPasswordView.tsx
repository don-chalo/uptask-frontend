import { useState } from "react";

import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPassForm from "@/components/auth/NewPasswordForm";
import { ConfirmToken } from "@/types/index";

function NewPasswordView() {

    const [token, setToken] = useState<ConfirmToken['token']>('');
    const [isValidToken, setIsValidaToken] = useState(false);

    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer contraseña</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el c&oacute;digo que recibiste {''}
                <span className=" text-fuchsia-500 font-bold">por email</span>
            </p>
            {
                !isValidToken ?
                    <NewPasswordToken token={token} setToken={setToken} setIsValidaToken={setIsValidaToken} /> :
                    <NewPassForm token={token} />
            }
        </>
    );
}

export default NewPasswordView;
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import ErrorMessage from "@/components/ErrorMessage";
import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updatePassword } from "@/api/AuthAPI";
import { useState } from "react";

type NewPassFormProps = {
    token: ConfirmToken['token']
};

export default function NewPassForm({ token }: NewPassFormProps) {
    const navigate = useNavigate()
    const initialValues: NewPasswordForm = {
        password: '',
        'password-confirmation': '',
    };
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
    const [loading, setLoading] = useState(false);
    const { mutate } = useMutation({
        mutationFn: updatePassword,
        onError: (error) => {
            toast.error(error.message);
            setLoading(false);
        },
        onSuccess: (res) => {
            toast.success(res.message);
            setLoading(false);
            reset();
            navigate('/auth/login');
        }
    });

    const handleNewPassword = (formData: NewPasswordForm) => {
        setLoading(true);
        mutate({ formData, token });
    };

    const password = watch('password');

    return (
        <>
            <form className="space-y-8 p-10 bg-white mt-10"
                onSubmit={handleSubmit(handleNewPassword)}
                noValidate
            >

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-2xl">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "El Password es obligatorio",
                            minLength: {
                                value: 8,
                                message: 'El Password debe ser mínimo de 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir Password</label>

                    <input
                        id="password-confirmation"
                        type="password"
                        placeholder="Repite Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password-confirmation", {
                            required: "Repetir Password es obligatorio",
                            validate: value => value === password || 'Los Passwords no son iguales'
                        })}
                    />

                    {errors['password-confirmation'] && (
                        <ErrorMessage>{errors['password-confirmation'].message}</ErrorMessage>
                    )}
                </div>

                <input className={`bg-fuchsia-600 w-full p-3 text-white font-black text-xl ${loading ? 'opacity-40 cursor-default' : 'hover:bg-fuchsia-700 cursor-pointer'}`}
                    disabled={loading}
                    type="submit"
                    value='Establecer Password'
                />
            </form>
        </>
    )
}
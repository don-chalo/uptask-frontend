import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ErrorMessage from "@/components/ErrorMessage";
import { UserLoginForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "@/api/AuthAPI";

export default function LoginView() {
    const initialValues: UserLoginForm = {
        email: '',
        password: '',
    }
    const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: authenticateUser,
        onError: (err: any) => {
            toast.error(err.message);
            setLoading(false);
        },
        onSuccess: (res) => {
            localStorage.setItem('AUTH_TOKEN', res.token);
            navigate('/');
            setLoading(false);
        }
    });

    const handleLogin = async (formData: UserLoginForm) => {
        setLoading(true);
        mutate(formData);
    };

    return (
        <>
            <h1 className="text-5xl font-black text-white">Iniciar Sesi&oacute;n</h1>
            <p className="text-2xl font-light text-white mt-5">
                Comienza a planear tus proyectos {''}
                <span className=" text-fuchsia-500 font-bold"> iniciando sesi&oacute;n en este formulario</span>
            </p>        
            <form className="space-y-8 p-10 mt-10 bg-white"
                onSubmit={handleSubmit(handleLogin)}
                noValidate>
                <div className="flex flex-col gap-5">
                    <label className="font-normal text-2xl">
                        Email
                    </label>

                    <input className="w-full p-3 border-gray-300 border"
                        id="email"
                        placeholder="Email de Registro"
                        type="email"
                        {...register("email", {
                            required: "El Email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-2xl">
                        Password
                    </label>

                    <input className="w-full p-3  border-gray-300 border"
                        placeholder="Password de Registro"
                        type="password"
                        {...register("password", {
                            required: "El Password es obligatorio",
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input className={`bg-fuchsia-600 w-full p-3 text-white font-black text-xl cursor-pointer ${loading ? ' opacity-40 cursor-default' : 'hover:bg-fuchsia-700'}`}
                    disabled={loading}
                    type="submit"
                    value='Iniciar Sesión'
                />
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link to={'/auth/register'} className="text-center text-gray-300 font-normal">
                    ¿No tienes cuenta? Crear una
                </Link>
                <Link to={'/auth/forgot-password'} className="text-center text-gray-300 font-normal">
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </nav>
        </>
    )
}
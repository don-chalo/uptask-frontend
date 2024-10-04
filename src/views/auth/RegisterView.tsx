import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import { useState } from "react";

export default function RegisterView() {

    const initialValues: UserRegistrationForm = {
        name: '',
        email: '',
        password: '',
        'password-confirmation': '',
    }

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message);
            setLoading(false);
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
            setLoading(false);
        }
    });
    
    const password = watch('password');

    const handleRegister = (formData: UserRegistrationForm) => {
        setLoading(true);
        mutate(formData);
    }

    return (
        <>
            <h1 className="text-5xl font-black text-white">Crear Cuenta</h1>
            <p className="text-2xl font-light text-white mt-5">
                Llena el formulario para {''}
                <span className=" text-fuchsia-500 font-bold"> crear tu cuenta</span>
            </p>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className="space-y-8 p-10 bg-white mt-10"
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="email"
                    >Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full p-3 border-gray-300 border"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
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
                        Nombre
                    </label>
                    <input
                        type="name"
                        placeholder="Nombre de Registro"
                        className="w-full p-3 border-gray-300 border"
                        {...register("name", {
                            required: "El Nombre de usuario es obligatorio",
                        })}
                    />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-2xl">
                        Password
                    </label>
                    <input className="w-full p-3  border-gray-300 border"
                        type="password"
                        placeholder="Password de Registro"
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
                    <label className="font-normal text-2xl">
                        Repetir Password
                    </label>
                    <input className="w-full p-3 border-gray-300 border"
                        id="password-confirmation"
                        type="password"
                        placeholder="Repite Password de Registro"
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
                    value='Registrarme'
                />
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link to={'/auth/login'} className="text-center text-gray-300 font-normal">
                    ¿Ya tienes cuenta? Iniciar sesión
                </Link>
                <Link to={'/auth/forgot-password'} className="text-center text-gray-300 font-normal">
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </nav>
        </>
    )
}
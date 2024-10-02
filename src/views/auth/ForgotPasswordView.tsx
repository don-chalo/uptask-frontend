import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { forgotPassowrd } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = {
        email: ''
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

      const { mutate } = useMutation({
        mutationFn: forgotPassowrd,
        onError: (res) => {
            toast.error(res.message);
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
        }
      })

    const handleForgotPassword = (formData: ForgotPasswordForm) => {
        mutate(formData);
    };

    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer contraseña</h1>
            <p className="text-2xl font-light text-white mt-5">
                ¿Olvidaste tu contraseña? coloca tu e-mail {''}
                <span className=" text-fuchsia-500 font-bold"> y reestablécela</span>
            </p>
            <form className="space-y-8 p-10 mt-10 bg-white"
                onSubmit={handleSubmit(handleForgotPassword)}
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label className="font-normal text-2xl" htmlFor="email">
                        Email
                    </label>
                    <input className="w-full p-3  border-gray-300 border"
                        id="email"
                        placeholder="Email de Registro"
                        type="email"
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

                <input className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    type="submit"
                    value='Enviar Instrucciones'
                />
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link className="text-center text-gray-300 font-normal" to='/auth/login'>
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>
                <Link className="text-center text-gray-300 font-normal" to='/auth/register'>
                    ¿No tienes cuenta? Crea una
                </Link>
            </nav>
        </>
    )
}
import { useState } from "react";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import ErrorMessage from "@/components/ErrorMessage"
import { UpdatePasswordForm } from "@/types/index";
import { changePassword } from "@/api/ProfileAPI";

export default function ChangePasswordView() {
  const initialValues: UpdatePasswordForm = {
    'current-password': '',
    password: '',
    'password-confirmation': ''
  };
  const [loading, setLoading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      toast.error(error.message)
      setLoading(false);
    },
    onSuccess: () => {
      toast.success('Contraseña actualizada exitosamente');
      setLoading(false);
      reset();
    }
  });
  const { register, reset, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: initialValues });
  const password = watch('password');
  const handleChangePassword = (formData: UpdatePasswordForm) => {
    mutate(formData);
    setLoading(true);
  }

  return (
    <>
      <div className="mx-auto max-w-3xl">

        <h1 className="text-5xl font-black ">Cambiar Password</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Utiliza este formulario para cambiar tu password</p>

        <form className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleChangePassword)}
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current-password"
            >Password Actual</label>
            <input
              id="current-password"
              type="password"
              placeholder="Password Actual"
              className="w-full p-3  border border-gray-200"
              {...register("current-password", {
                required: "El password actual es obligatorio",
              })}
            />
            {errors['current-password'] && (
              <ErrorMessage>{errors['current-password'].message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="password"
            >Nuevo Password</label>
            <input
              id="password"
              type="password"
              placeholder="Nuevo Password"
              className="w-full p-3  border border-gray-200"
              {...register("password", {
                required: "El Nuevo Password es obligatorio",
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
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password-confirmation"
              className="text-sm uppercase font-bold"
            >Repetir Password</label>

            <input
              id="password-confirmation"
              type="password"
              placeholder="Repetir Password"
              className="w-full p-3  border border-gray-200"
              {...register("password-confirmation", {
                required: "Este campo es obligatorio",
                validate: value => value === password || 'Los Passwords no son iguales'
              })}
            />
            {errors['password-confirmation'] && (
              <ErrorMessage>{errors['password-confirmation'].message}</ErrorMessage>
            )}
          </div>

          <input className={`bg-fuchsia-600 w-full p-3 text-white uppercase font-bold transition-colors ${loading ? 'opacity-40 cursor-default' : 'hover:bg-fuchsia-700 cursor-pointer'}`}
            disabled={loading}
            type="submit"
            value='Cambiar Password'
          />
        </form>
      </div>
    </>
  )
}
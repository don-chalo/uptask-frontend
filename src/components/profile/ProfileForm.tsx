import { useForm } from "react-hook-form"

import ErrorMessage from "../ErrorMessage"
import { User, UserProfileForm } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/ProfileAPI";
import { toast } from "react-toastify";

type ProfileFormProps = {
    data: User
};

export default function ProfileForm({ data }: ProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: data })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Perfil actualizado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["user"] });
        }
    });

    const handleEditProfile = (formData: UserProfileForm) => mutate(formData);

    return (
        <>
            <div className="mx-auto max-w-3xl g">
                <h1 className="text-5xl font-black">Mi Perfil</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Aquí puedes actualizar tu información</p>

                <form className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-l"
                    onSubmit={handleSubmit(handleEditProfile)}
                    noValidate
                >
                    <div className="mb-5 space-y-3">
                        <label className="text-sm uppercase font-bold" htmlFor="name">
                            Nombre
                        </label>
                        <input className="w-full p-3  border border-gray-200"
                            id="name"
                            placeholder="Tu Nombre"
                            type="text"
                            {...register("name", {
                                required: "Nombre de usuario es obligatoro",
                            })}
                        />
                        {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label className="text-sm uppercase font-bold" htmlFor="password">
                            E-mail
                        </label>
                        <input className="w-full p-3 border border-gray-200"
                            id="text"
                            placeholder="Tu Email"
                            type="email"
                            {...register("email", {
                                required: "EL e-mail es obligatorio",
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
                    <input className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
                        type="submit"
                        value='Guardar Cambios'
                    />
                </form>
            </div>
        </>
    )
}
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import ErrorMessage from "../ErrorMessage";
import { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamAPI";
import SearchResult from "@/components/team/SearchResult";

export default function AddMemberForm() {
    const initialValues: TeamMemberForm = {
        email: ''
    }
    const params = useParams()
    const projectId = params.projectId!

    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const mutation = useMutation({
        mutationFn: findUserByEmail,
        onError: () => {
            setLoading(false);
        },
        onSuccess: () => {
            setLoading(false);
        }
    })

    const handleSearchUser = async (formData: TeamMemberForm) => {
        setLoading(true);
        const data = { projectId, formData };
        mutation.mutate(data);
    }

    const resetData = () => {
        reset();
        mutation.reset();
    }

    return (
        <>

            <form className="mt-10 space-y-5"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >

                <div className="flex flex-col gap-3">
                    <label className="font-normal text-2xl" htmlFor="name">
                        E-mail de Usuario
                    </label>
                    <input className="w-full p-3  border-gray-300 border"
                        id="name"
                        placeholder="E-mail del usuario a Agregar"
                        type="text"
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

                <input className={`bg-fuchsia-600 w-full p-3 text-white font-black text-xl ${loading ? 'opacity-40 cursor-default' : 'hover:bg-fuchsia-700 cursor-pointer'}`}
                    disabled={loading}
                    type="submit"
                    value='Buscar Usuario'
                />
            </form>
            <div className="mt-5">
                {
                    mutation.isPending && <p className="text-center">Cargando...</p>
                }
                {
                    mutation.error && <p className="text-center">{mutation.error.message}</p>
                }
                {
                    mutation.data && <SearchResult user={mutation.data} reset={resetData} />
                }
            </div>
        </>
    )
}
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { updateProject } from "@/api/ProjectAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectFormData } from "@/types/index";
import ProjectForm from "./ProjectForm";

type EditProjectFormProps = {
    data: ProjectFormData,
    projectId: string
};

function EditProjectForm({data, projectId}: EditProjectFormProps) {

    const navigate = useNavigate();

    const { formState: { errors }, handleSubmit, register } = useForm({
        defaultValues: {
            projectName: data.projectName,
            clientName: data.clientName,
            description: data.description
        }
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: () => {
            toast.error('Error al actualizar proyecto');
        },
        onSuccess: () => {
            // Se invalidan los datos cacheados para la query 'projects' y 'editProject'.
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] });
            toast.success('Proyecto actualizado correctamente');
            navigate('/');
        }
    });

    const handleForm = (formData: ProjectFormData) => {
        mutate({ projectId, formData });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">
                Editar proyecto
            </h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
                Llena el siguiente formulario para editar el proyecto
            </p>

            <nav className="my-5">
                <Link className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    to="/">
                    Volver a proyectos
                </Link>
            </nav>

            <form className="mt-10 bg-white shadow-log p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate>
                <ProjectForm register={register} errors={errors} />
                <input className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    type="submit"
                    value="Guardar cambios"
                />
            </form>
        </div>
    );
}

export default EditProjectForm;

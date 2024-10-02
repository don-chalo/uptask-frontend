import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ProjectFormData } from "@/types/index";
import ProjectForm from "@/components/proyects/ProjectForm";
import { createProject } from "@/api/ProjectAPI";
import { useMutation } from "@tanstack/react-query";

function CreateProjectView() {
    const navigate = useNavigate();
    const initialValues: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    };

    const { formState: { errors }, handleSubmit, register } = useForm({ defaultValues: initialValues });

    const mutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            toast.success(`Proyecto creado con éxito`);
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleForm = (formData: ProjectFormData) => mutation.mutate(formData);

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">
                Crear proyecto
            </h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
                Llena el siguiente formulario para crear un nuevo proyecto
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
                    value="Crear proyecto"
                />
            </form>
        </div>
    );
}

export default CreateProjectView;
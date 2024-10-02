import { NoteFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createNote } from "@/api/NoteAPI";
import { useLocation, useParams } from "react-router-dom";

function AddNoteForm() {

    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const projectId = params.projectId!;
    const taskId = queryParams.get('view-task')!;

    const queryClient = useQueryClient();

    const initialValues: NoteFormData = {
        content: ''
    };

    const { formState: {errors}, handleSubmit, register, reset } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Nota creada exitosamente');
            reset();
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
        }
    });

    const handleAddNote = (formData: NoteFormData) => {
        mutate({ projectId, taskId, formData });
    };

    return (
        <form className="space-y-3" noValidate onSubmit={handleSubmit(handleAddNote)}>
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="content">Crear Nota</label>
                <input className="w-full p-3 border border--gray-300"
                    id="content"
                    placeholder="Contenido de la nota"
                    type="text"
                    {
                        ...register(
                            'content',
                            {
                                required: 'El contenido de la nota es obligatorio',
                            }
                        )
                    }
                />
                {
                    errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>
                }
            </div>
            <input className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-bold cursor-pointer"
                type="submit"
                value="Crear Nota"
            />
        </form>
    );
}

export default AddNoteForm;
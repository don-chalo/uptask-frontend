import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Dialog, Transition } from '@headlessui/react';
import { Task, TaskFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/api/TaskAPI';
import TaskForm from './TaskForm';

type EditTaskModal = {
    task: Task;
    taskId: Task['_id'];
}

export default function EditTaskModal({ task, taskId }: EditTaskModal) {

    const navigate = useNavigate();
    const params = useParams();
    const projectId = params.projectId!;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({defaultValues: { name: task.name, description: task.description }});
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);

    const { mutate } = useMutation({
        mutationFn: updateTask,
        onError: () => {
            toast.error('Error al actualizar la tarea');
            setLoading(false);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
            toast.success('Tarea actualizada con éxito');
            setLoading(false);
            reset();
            navigate(location.pathname, { replace: true });
        }
    });

    const handleEditTask = (formData: TaskFormData) => {
        setLoading(true);
        mutate({ projectId, taskId, formData });
    };
    
    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true }) }>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >
                                    Editar Tarea
                                </Dialog.Title>

                                <p className="text-xl font-bold">Realiza cambios a una tarea en {''}
                                    <span className="text-fuchsia-600">este formulario</span>
                                </p>

                                <form className="mt-10 space-y-3"
                                    noValidate
                                    onSubmit={handleSubmit(handleEditTask)}
                                >

                                    <TaskForm errors={errors} register={register} />

                                    <input className={`bg-fuchsia-600 w-full p-3 text-white font-black text-xl ${ loading ? 'opacity-40 cursor-default' : 'hover:bg-fuchsia-700 cursor-pointer'}`}
                                        disabled={loading}
                                        type="submit"
                                        value='Guardar Tarea'
                                    />
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
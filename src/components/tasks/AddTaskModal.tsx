import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import { createTask } from '@/api/TaskAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function AddTaskModal() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const queryParams = new URLSearchParams(location.search);
    const showModal = !!queryParams.get('new-task');

    const initialValues: TaskFormData = {
        name: '', description: ''
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: initialValues});

    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message);
            setLoading(false);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', params.projectId] });
            toast.success('Tarea creada con éxito');
            setLoading(false);
            reset();
            navigate(location.pathname, { replace: true });
        } 
    });

    const handleCreateTask = (formData: TaskFormData) => {
        setLoading(true);
        mutate({projectId: params.projectId!, formData});
    };

    return (
        <Transition appear show={!!showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true})}>
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
                                    Nueva Tarea
                                </Dialog.Title>

                                <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                    <span className="text-fuchsia-600">una tarea</span>
                                </p>

                                <form className="mt-10 space-y-3" noValidate onSubmit={handleSubmit(handleCreateTask)}>
                                    <TaskForm errors={ errors } register={ register } />
                                    <input className={`bg-fuchsia-600 w-full p-3 text-white uppercase font-bold transition-colors ${loading ? 'opacity-40 cursor-default' : 'hover:bg-fuchsia-700 cursor-pointer'}`}
                                        disabled={loading}
                                        type="submit"
                                        value="Guardar Tarea" />
                                </form>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
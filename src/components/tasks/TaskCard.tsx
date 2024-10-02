import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";

import { TaskProject } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";

type TaskCardProps = {
    task: TaskProject,
    canEdit: boolean
};

function TaskCard({ task, canEdit }: TaskCardProps) {

    const { attributes, listeners , setNodeRef, transform} = useDraggable({
        id: task._id
    });
    const navigate = useNavigate();
    const params = useParams();
    const projectId = params.projectId!;

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: () => {
            toast.error("Error al eliminar la tarea");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            toast.success("Tarea eliminada correctamente");
        }
    });

    const style = transform ?
        {
            backgroundColor: "#fff",
            borderColor: "rgb(203 213 225 / var(--tw-border-opacity)",
            borderWidth: "1px",
            display: "flex",
            padding: "1.23rem",
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            width: "300px"
        } :
        undefined;

    return (
        <li className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
            <div className="min-w-0 flex flex-col gap-y-4"
                {...listeners}
                {...attributes}
                ref={setNodeRef}
                style={style}
                >
                <p className="text-xl font-bold text-slate-600 text-left">
                    {task.name}
                </p>
                <p className="text-slate-500">{task.description}</p>
            </div>
            <div className="flex shrink-0 gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                                <button className='block px-3 py-1 text-sm leading-6 text-gray-900'
                                    type='button'
                                    onClick={() => navigate(`${location.pathname}?view-task=${task._id}`)}>
                                    Ver Tarea
                                </button>
                            </Menu.Item>
                            {
                                canEdit &&
                                <>
                                    <Menu.Item>
                                        <button className='block px-3 py-1 text-sm leading-6 text-gray-900'
                                            type='button'
                                            onClick={ () => navigate(`${location.pathname}?edit-task=${task._id}`) }>
                                            Editar Tarea
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button className='block px-3 py-1 text-sm leading-6 text-red-500'
                                            type='button'
                                            onClick={() => mutate({ projectId, taskId: task._id })}> 
                                            Eliminar Tarea
                                        </button>
                                    </Menu.Item>
                                </>
                            }
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </li>
    );
}

export default TaskCard;
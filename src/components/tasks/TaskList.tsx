import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { updateStatus } from "@/api/TaskAPI";

type TaskListProps = {
    tasks: TaskProject[],
    canEdit: boolean
}

type GroupedTasks = {
    [key: string]: TaskProject[]
}

const initialGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
};

const statusStyle : { [key: string]: string } = {
    pending: "border-t-slate-500",
    onHold: "border-t-red-500",
    inProgress: "border-t-blue-500",
    underReview: "border-t-amber-500",
    completed: "border-t-emerald-500"
};

function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams();
    const projectId = params.projectId!;

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialGroups);

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e;
        if (over && over.id) {
            const taskId = active.id.toString();
            const status = over.id as TaskStatus;
            mutate({ projectId, taskId, status });
            queryClient.setQueryData(['project', projectId], (prevData: Project) => {
                const updatedTasks = prevData.tasks.map((task) => {
                    if (task._id === taskId) {
                        return {
                            ...task,
                            status
                        }
                    }
                    return task;
                });
                return {
                    ...prevData,
                    tasks: updatedTasks
                };
            });
        }
    };
    
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: () => {
            toast.error('Error al actualizar el estado de la tarea', { toastId: 'error' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            toast.success('Estado de la tarea actualizado con éxito', { toastId:'success' });
        }
    });

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>
            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[250px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3 className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 text-center ${statusStyle[status]}`}>
                                {statusTranslations[status]}
                            </h3>
                            <DropTask status={status} />
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    );
}

export default TaskList;
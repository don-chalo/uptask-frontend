import { isAxiosError } from "axios";

import { Project, Task, TaskFormData, taskSchema } from "../types";
import api from "@/lib/axios";

type TaskAPI = {
    formData: TaskFormData,
    projectId: Project['_id'],
    taskId: Task['_id'],
    status: Task['status']
};

export async function createTask({ projectId, formData }: Pick<TaskAPI, 'formData' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/tasks`;
        await api.post(url, formData);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.message);
        }
        console.error("Error creating task:", error);
    }
}

export async function getTaskById({ projectId, taskId } : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`;
        const { data } = await api.get(url);
        const response = taskSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.message);
        }
        console.error("Error creating task:", error);
    }
}

export async function updateTask({ projectId, taskId, formData } : Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`;
        const { data } = await api.put(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.message);
        }
        console.error("Error creating task:", error);
    }
}

export async function deleteTask({ projectId, taskId } : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`;
        const { data } = await api.delete(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.message);
        }
        console.error("Error creating task:", error);
    }
}

export async function updateStatus({ projectId, taskId, status } : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`;
        const { data } = await api.post(url, { status });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.message);
        }
        console.error("Error creating task:", error);
    }
}
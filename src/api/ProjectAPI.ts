import { isAxiosError } from "axios";

import api from "@/lib/axios";
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "@/types/index";

export async function createProject(formData: ProjectFormData) {
    try {
        const { data } = await api.post("/projects", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        console.error("Error creating project", error);
    }
};

export async function getProjects() {
    try {
        const { data } = await api.get("/projects");
        const response = dashboardProjectSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        console.error("Error getting projects", error);
    }
};

export async function getProjectById(id: string) {
    try {
        const { data } = await api.get(`/projects/${id}`);
        const response = editProjectSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        console.error("Error getting project", error);
    }
};

export async function getFullProject(id: string) {
    try {
        const { data } = await api.get(`/projects/${id}`);
        const response = projectSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        console.error("Error getting project", error);
    }
};

export async function updateProject({ projectId, formData }: { projectId: Project['_id'], formData: ProjectFormData }) {
    try {
        await api.put(`/projects/${projectId}`, formData);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        console.error("Error updating projects", error);
    }
};

export async function deleteProject(projectId: Project['_id']) {
    try {
        await api.delete(`/projects/${projectId}`);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        console.error("Error updating projects", error);
    }
};

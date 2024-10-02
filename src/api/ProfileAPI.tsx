import { isAxiosError } from "axios";

import { UpdatePasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

export async function updateProfile(formData: UserProfileForm) {
    try {
        const { data } = await api.put('/auth/profile', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function changePassword(formData: UpdatePasswordForm) {
    try {
        const { data } = await api.post('/auth/change-password', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}
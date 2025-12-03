import { User, UserRole } from "@/types";
import { API } from "../api";

export const getAdminUsersList = async (pageNumber: number = 0, pageSize: number = 100) => {
    try {
        const response = await API.get(`/api/admin/users?page=${pageNumber}&size=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin users:", error);
        throw error;
    }
}

export const updateUserApi = async (userId: string | number, payload: Partial<User> ) => {
    try {
        const payloadData = {
            id: payload.id,
            fullName: payload.name,
            email: payload.email,
            role: payload.role === UserRole.ADMIN ? UserRole.ROLE_ADMIN : UserRole.ROLE_USER
        };
        const response = await API.put("/api/admin/users", payloadData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export const roleChangeApi = async (ids: (number | string)[], role: UserRole) => {
    try {
        const payload = { 
            ids, 
            role: role === UserRole.ADMIN ? UserRole.ROLE_ADMIN : UserRole.ROLE_USER 
        };
        const response = await API.put("/api/admin/users/change-role", payload);
        return response.data;

    } catch (error) {
        console.error("Error updating role:", error);
        throw error;
    }
};

export const userDeleteApi = async (ids: (number | string)[]) => {
    try {
        const response = await API.delete("/api/admin/users", {
            data: { ids }   // ✅ DELETE body must be inside `data`
        });

        return response.data;

    } catch (error) {
        console.error("Error deleting users:", error);
        throw error;
    }
};





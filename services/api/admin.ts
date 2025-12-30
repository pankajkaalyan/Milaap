import { User, UserRole } from "@/types";
import { API } from "../api";

export const getAdminUsersList = async (pageNumber: number = 0, pageSize: number = 10000) => {
    try {
        const response = await API.get(`/api/admin/users?page=${pageNumber}&size=${pageSize}&ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin users:", error);
        throw error;
    }
}

export const getVerificationReviewAPI = async () => {
    try {
        // Include a timestamp to avoid caching issues
        const response = await API.get(`/api/admin/verification/review?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pending verifications:", error);
        throw error;
    }
}

/**
 * Approve a user's verification submission
 * POST /api/admin/verification/review/approve
 */
export const approveVerificationAPI = async (userId: string | number, note?: string) => {
    try {
        const payload = { id: userId, status: "VERIFIED", comment: note };
        const response = await API.patch(`/api/admin/verification/review/approve`, payload);
        return response.data;
    } catch (error) {
        console.error("Error approving verification:", error);
        throw error;
    }
}

/**
 * Reject a user's verification submission
 * POST /api/admin/verification/review/reject
 */
export const rejectVerificationAPI = async (userId: string | number, reason?: string) => {
    try {
        const payload = { id: userId, status: "REJECTED", comments: reason };
        const response = await API.patch(`/api/admin/verification/review/reject`, payload);
        return response.data;
    } catch (error) {
        console.error("Error rejecting verification:", error);
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


export const getServiceRequestsAPI = async (pageNumber: number = 0, pageSize: number = 10000) => {
    try {
        const response = await API.get(`api/admin/sr?page=${pageNumber}&size=${pageSize}&ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin users:", error);
        throw error;
    }
}

/**
 * Fetch user reports (paginated)
 * GET /api/admin/user-report?page=0&size=10
 */
export const getUserReportsAPI = async (pageNumber: number = 0, pageSize: number = 10000) => {
    try {
        const response = await API.get(`/api/admin/user-report?page=${pageNumber}&size=${pageSize}&ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user reports:", error);
        throw error;
    }
}





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

/**
 * Warn a customer associated with a user report
 * POST /api/admin/user-report/actions/{reportId}/warn-customer (no body)
 */
export const putWarnUserAPI = async (reportId: string | number) => {
    try {
        const response = await API.put(`/api/admin/user-report/actions/${reportId}/warn-customer?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error warning customer for report:", error);
        throw error;
    }
}


/**
 * Dismiss a user report
 * PUT /api/admin/user-report/actions/{reportId}/dismiss-report (no body)
 */
export const putDismissReportAPI = async (reportId: string | number) => {
    try {
        const response = await API.put(
            `/api/admin/user-report/actions/${reportId}/dismiss-report?ts=${Date.now()}`
        );
        return response.data;
    } catch (error) {
        console.error("Error dismissing report:", error);
        throw error;
    }
};

/**
 * Suspend chat for a user report
 * PUT /api/admin/user-report/actions/{reportId}/suspend-chat (no body)
 */
export const putSuspendChatAPI = async (reportId: string | number) => {
    try {
        const response = await API.put(
            `/api/admin/user-report/actions/${reportId}/suspend-chat?ts=${Date.now()}`
        );
        return response.data;
    } catch (error) {
        console.error("Error suspending chat for report:", error);
        throw error;
    }
};

/**
 * Suspend a customer associated with a user report
 * PUT /api/admin/user-report/actions/{reportId}/suspend-customer (no body)
 */
export const putSuspendCustomerAPI = async (reportId: string | number) => {
    try {
        const response = await API.put(
            `/api/admin/user-report/actions/${reportId}/suspend-customer?ts=${Date.now()}`
        );
        return response.data;
    } catch (error) {
        console.error("Error suspending customer for report:", error);
        throw error;
    }
};


/**
 * Get all pending chat reports for admin moderation
 * GET /api/admin/chat-reports/pending
 */
export const getPendingChatReportsAPI = async () => {
  try {
    const response = await API.get(
      `/api/admin/chat-reports/pending?ts=${Date.now()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching pending chat reports:', error);
    throw error;
  }
};


/**
 * Get chat report details by report ID for admin moderation
 * GET /api/admin/chat-reports/{reportId}
 */
export const getChatReportByIdAPI = async (
  reportId: string | number
) => {
  try {
    const response = await API.get(
      `/api/admin/chat-reports/${reportId}?ts=${Date.now()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chat report by ID:', error);
    throw error;
  }
};


/**
 * Warn a user associated with a chat report
 * PUT /api/admin/chat-reports/warn
 */
export const putWarnUserForChatReportAPI = async (payload: {
  chatReportId: string | number;
  userId: string | number;
}) => {
  try {
    const response = await API.put(
      `/api/admin/chat-reports/warn?ts=${Date.now()}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error warning user for chat report:', error);
    throw error;
  }
};


/**
 * Suspend a chat associated with a chat report
 * PUT /api/admin/chat-reports/suspend-chat
 */
export const putSuspendChatForChatReportAPI = async (payload: {
  chatReportId: string | number;
  userId: string | number;
}) => {
  try {
    const response = await API.put(
      `/api/admin/chat-reports/suspend-chat?ts=${Date.now()}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error suspending chat for chat report:', error);
    throw error;
  }
};

/**
 * Get admin dashboard data
 * GET /api/admin/dashboard
 */
export const getAdminDashboardAPI = async () => {
  try {
    const response = await API.get(
      `/api/admin/dashboard?ts=${Date.now()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};











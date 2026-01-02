import { API } from "../api";

export const fetchCurrentUserAPI = async () => {
    try {
        const response = await API.get(`/api/profile/me?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};

export const getProfileByIdAPI = async (profileId) => {
    try {
        const response = await API.get(`/api/profile/${profileId}?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const updateProfileAPI = async (
    profileData: any,
    photos: File[] = [],
    video: File[] = []
) => {
    try {
        console.log("Updating profile with data:", profileData);

        const formData = new FormData();

        // Attach JSON profile data
        const profileBlob = new Blob([JSON.stringify(profileData)], {
            type: "application/json",
        });
        formData.append("profile", profileBlob);

        // Attach photos (multiple)
        if (photos && Array.isArray(photos)) {
            photos.forEach((photo) => {
                if (photo) {
                    formData.append("photos", photo);
                }
            });
        }

        // Attach video (single)
        if (video && Array.isArray(video)) {
            video.forEach((vid) => {
                if (vid) {
                    formData.append("video", vid);
                }
            });
        }

        // Send request
        const response = await API.post(`/api/profile/update`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};


export const fetchSuccessStoriesAPI = async () => {
    try {
        const response = await API.get(`/api/success-stories?ts=${Date.now()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching success stories:", error);
        throw error;
    }
};

export const submitSuccessStoryAPI = async (storyData) => {
    try {
        console.log("Submitting success story:", storyData);

        const formData = new FormData();

        // Append JSON data as Blob
        const storyPayload = {
            coupleNames: storyData.coupleNames,
            weddingDate: storyData.weddingDate,
            story: storyData.story,
        };

        const storyBlob = new Blob([JSON.stringify(storyPayload)], {
            type: "application/json",
        });

        formData.append("story", storyBlob);

        // Attach image only if provided
        if (storyData.couplePhoto) {
            formData.append("image", storyData.couplePhoto);
        }

        console.log("FormData prepared. Sending request...");

        const response = await API.post("/api/success-stories", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch (error) {
        console.error("❌ Failed to submit success story:", error.response?.data || error);
        throw error;
    }
};


export const rejectSuccessStoryAPI = async (id: number | string) => {
    try {
        const response = await API.put(
            "/api/admin/verification/success-story/reject",
            { id }
        );
        return response.data;
    } catch (error: any) {
        console.error(
            "Error rejecting success story:",
            error.response?.data || error
        );
        throw error;
    }
};

export const approveSuccessStoryAPI = async (id: number | string) => {
    try {
        const response = await API.put(
            "/api/admin/verification/success-story/approve",
            { id }
        );
        return response.data;
    } catch (error: any) {
        console.error(
            "Error approving success story:",
            error.response?.data || error
        );
        throw error;
    }
};

export const verifyProfileAPI = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file); // file key

        const response = await API.patch(
            "/api/profile/verify",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error verifying profile:", error.response?.data || error);
        throw error;
    }
};


// Fetch list of blocked users
export const getBlockedUsersAPI = async () => {
    try {
        const response = await API.get(`/api/user-interactions/blocked?ts=${Date.now()}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching blocked users:", error.response?.data || error);
        throw error;
    }
};

export const deactivateProfileAPI = async () => {
    try {
        const response = await API.patch("/api/profile/deactivate");
        return response.data;
    } catch (error: any) {
        console.error("Error deactivating profile:", error.response?.data || error);
        throw error;
    }
};


export const deleteProfileAPI = async () => {
    try {
        const response = await API.delete("/api/profile");
        return response.data;
    } catch (error: any) {
        console.error("Error deleting profile:", error.response?.data || error);
        throw error;
    }
};


export const updatePasswordAPI = async (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
) => {
    try {
        const payload = {
            oldPassword,
            newPassword,
            confirmNewPassword
        };

        const response = await API.post(
            "/api/profile/update-password",
            payload
        );

        return response.data;
    } catch (error: any) {
        console.error("Error updating password:", error.response?.data || error);
        throw error;
    }
};

export const activateProfileAPI = async (token: string) => {
    try {
        const response = await API.post(
            `/api/auth/activate`, { token }
        );
        return response.data;
    } catch (error: any) {
        console.error(
            "Error activating profile:",
            error.response?.data || error
        );
        throw error;
    }
};










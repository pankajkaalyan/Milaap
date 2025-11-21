import { API } from "../api";

export const fetchCurrentUserAPI = async () => {
    try {
        const response = await API.get("/api/profile/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};

export const getProfileByIdAPI = async (profileId) => {
    try {
        const response = await API.get(`/api/profile/${profileId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const updateProfileAPI = async (
    profileData: any,
    photos: File[] = [],
    video?: File
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
        if (video instanceof File) {
            formData.append("video", video);
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
        const response = await API.get("/api/success-stories");
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

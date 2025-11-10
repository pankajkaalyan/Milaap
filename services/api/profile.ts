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

export const updateProfileAPI = async (profileData, photos: File[], video: File[]) => {
    console.log('Updating profile with data:', profileData, 'and photos:', photos);
    try {
        const formData = new FormData();
        const profileBlob = new Blob([JSON.stringify(profileData)], {
            type: "application/json",
        });
        formData.append("profile", profileBlob);
        
        photos?.forEach(photo => {
            formData.append("photos", photo);
        });

        video?.forEach(vid => {
            formData.append("video", vid);
        });

        const response = await API.post(`/api/profile/update`, formData);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

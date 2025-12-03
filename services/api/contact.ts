import { API } from "../api";

export const contactAPI = async (data: { fullName: string; email: string; message: string }) => {
    try {
        const response = await API.post("/api/contact", data);
        return response.data;
    } catch (error) {
        console.error("Error submitting contact form:", error);
        throw error;
    }
};

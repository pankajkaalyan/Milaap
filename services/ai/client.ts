import { GoogleGenAI } from "@google/genai";

class AIClient {
    private static instance: GoogleGenAI | null = null;

    private constructor() {
        // private constructor to prevent direct instantiation
    }

    public static getInstance(): GoogleGenAI | null {
        if (!AIClient.instance) {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                console.error("API_KEY environment variable not set.");
                return null;
            }
            AIClient.instance = new GoogleGenAI({ apiKey });
        }
        return AIClient.instance;
    }
}


export const getAiClient = () => {
    return AIClient.getInstance();
}

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};
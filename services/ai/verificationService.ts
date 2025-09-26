import { Type } from "@google/genai";
import { User } from '../../types';
import { getAiClient, fileToBase64 } from './client';

interface AIVerificationResult {
    fullName: string;
    dateOfBirth: string;
    isFaceMatch: boolean;
    reasoning: string;
}

export const verificationService = {
    async verifyUserWithAI(user: User, idDocument: File) {
        const ai = getAiClient();
        if (!ai) throw new Error("AI client not available.");
        if (!user.profile) throw new Error("User profile is missing for AI verification.");

        // 1. Get user's profile photo
        const profilePhotoUrl = user.profile.photos?.[0];
        if (!profilePhotoUrl) throw new Error("Please upload a profile photo first.");
        
        const response = await fetch(profilePhotoUrl);
        const imageBlob = await response.blob();
        const profilePhotoBase64 = await fileToBase64(new File([imageBlob], "profile.jpg", { type: imageBlob.type }));
        
        // 2. Convert ID document to base64
        const idDocumentBase64 = await fileToBase64(idDocument);

        // 3. Prepare parts for multimodal prompt
        const profilePhotoPart = { inlineData: { mimeType: imageBlob.type, data: profilePhotoBase64 } };
        const idDocumentPart = { inlineData: { mimeType: idDocument.type, data: idDocumentBase64 } };
        const textPart = {
            text: `You are a highly accurate identity verification assistant. Analyze the two provided images. Image 1 is the user's profile photo. Image 2 is their government-issued ID. 
            Perform two tasks:
            1. Extract the full name and date of birth (in YYYY-MM-DD format) from the ID document (Image 2).
            2. Compare the face in the profile photo (Image 1) with the face in the ID document (Image 2).
            
            Return your findings in a structured JSON format.`
        };

        // 4. Make the API call
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [profilePhotoPart, idDocumentPart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fullName: { type: Type.STRING },
                        dateOfBirth: { type: Type.STRING },
                        isFaceMatch: { type: Type.BOOLEAN },
                        reasoning: { type: Type.STRING, description: "Briefly explain your conclusion." }
                    },
                    required: ["fullName", "dateOfBirth", "isFaceMatch", "reasoning"],
                },
            },
        });

        const jsonStr = result.text.trim();
        const verificationResult: AIVerificationResult = JSON.parse(jsonStr);

        // 5. Compare results
        const isNameMatch = user.name.toLowerCase() === verificationResult.fullName.toLowerCase();
        const isDobMatch = user.profile.dateOfBirth === verificationResult.dateOfBirth;
        
        return { 
            success: isNameMatch && isDobMatch && verificationResult.isFaceMatch,
            details: {
                profile: { name: user.name, dob: user.profile.dateOfBirth },
                id_data: { name: verificationResult.fullName, dob: verificationResult.dateOfBirth },
                face_match: verificationResult.isFaceMatch,
                reasoning: verificationResult.reasoning,
            }
        };
    },
};

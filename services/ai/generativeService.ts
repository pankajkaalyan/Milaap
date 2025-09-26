import { ChatHistory } from '../../types';
import { getAiClient } from './client';

export const generativeService = {
    async generateProfileText(keywords: string): Promise<string> {
        const ai = getAiClient();
        if (!ai) throw new Error("AI client not available.");
        
        const prompt = `You are an expert profile writer for a Hindu matrimony website called Milaap. Your tone should be warm, genuine, and appealing, creating a positive and inviting impression. Based on these keywords, write a compelling 'About Me' section of about 50-70 words: "${keywords}"`;
      
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    },

    async getSupportResponseStream(chatHistory: ChatHistory[]) {
        const ai = getAiClient();
        if (!ai) throw new Error("AI client not available.");
        
        const systemInstruction = `You are a helpful and friendly support assistant for Milaap, a Hindu matrimony website. 
        Answer user questions about the platform based on its features: user registration, detailed profiles (including horoscope matching), 
        secure messaging, admin moderation, different membership plans (Free, Premium, Premium Plus), AI match suggestions, and AI Kundli reports.
        If you cannot answer, if the user asks for a human, or if the user seems frustrated, suggest they talk to a human agent. Keep your answers concise and helpful.`;

        const historyForPrompt = chatHistory
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join('\n');
        
        const prompt = `${systemInstruction}\n\nConversation History:\n${historyForPrompt}\n\nAI Response:`;

        return ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
    }
};

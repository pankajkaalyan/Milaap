import { Type } from "@google/genai";
import { AIMatchSuggestion, AIKundliReport, HoroscopeDetails, User, Match } from '../../types';
import { getAiClient } from './client';

export const matchmakingService = {
    async getAISuggestions(currentUser: User, potentialMatches: Match[]): Promise<AIMatchSuggestion[]> {
        const ai = getAiClient();
        if (!ai || !currentUser.profile) throw new Error("AI client or user profile not available.");

        const formatProfileForPrompt = (p: User | Match) => {
            const profile = 'role' in p ? p.profile : p;
            return `UserID: ${p.id}, Name: ${p.name}, Age: ${'age' in p ? p.age : ''}, Profession: ${profile?.profession}, About: ${profile?.about}, Family Values: ${profile?.family?.familyValues}, Horoscope: ${profile?.horoscope?.rashi}, Caste: ${profile?.caste}.`;
        };
    
        const currentUserForPrompt = formatProfileForPrompt(currentUser);
        const potentialMatchesForPrompt = potentialMatches.map(formatProfileForPrompt).join('\n');

        const prompt = `You are an expert matchmaker for a Hindu matrimony website. Analyze the current user's profile and find the 3 most compatible matches from the provided list. For each match, provide a brief, warm, one-sentence reason for the compatibility.

        Current User:
        ${currentUserForPrompt}

        Potential Matches:
        ${potentialMatchesForPrompt}

        Your task is to return a JSON array with exactly 3 objects, each containing 'userId' (as a number) and 'reason' (as a string).`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            userId: { type: Type.INTEGER },
                            reason: { type: Type.STRING },
                        },
                        required: ["userId", "reason"],
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    },

    async getAIKundliReport(currentUserHoroscope: HoroscopeDetails, targetUserHoroscope: HoroscopeDetails): Promise<AIKundliReport> {
        const ai = getAiClient();
        if (!ai) throw new Error("AI client not available.");

        const formatHoroscope = (h: HoroscopeDetails) => `Rashi (Moon Sign): ${h.rashi}, Nakshatra (Birth Star): ${h.nakshatra}, Mangal Dosha: ${h.mangalDosha}.`;
        const prompt = `You are a wise and modern Vedic astrologer for a matrimony website. Based on the provided astrological details of two individuals, generate a detailed Kundli compatibility report. The tone should be positive, insightful, and encouraging, even when mentioning challenges.

        Individual 1: ${formatHoroscope(currentUserHoroscope)}
        Individual 2: ${formatHoroscope(targetUserHoroscope)}
        
        Provide your analysis in a structured JSON format.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallCompatibility: { type: Type.STRING, description: "A short, encouraging summary of the match (e.g., 'A Harmonious and Blessed Union')." },
                        compatibilityScore: { type: Type.INTEGER, description: "A numerical Guna Milan score between 18 and 36." },
                        positiveAspects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 3-4 strings detailing the strengths of this pairing." },
                        potentialChallenges: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 2-3 strings describing areas that may require understanding and effort, framed constructively." },
                        spiritualGuidance: { type: Type.STRING, description: "A concluding paragraph of gentle advice for the couple's journey together." }
                    },
                    required: ["overallCompatibility", "compatibilityScore", "positiveAspects", "potentialChallenges", "spiritualGuidance"],
                },
            },
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    },
};

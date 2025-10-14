import { Interest, InterestStatus } from "../types";

// Note: The current logged-in user is assumed to have id: 1 ('Radha Sharma')

export const mockInterests: Interest[] = [
    // --- Interests RECEIVED by current user (id: 1) ---
    { 
        id: 1, 
        senderId: 2, // Rohan Verma
        recipientId: 1, 
        status: InterestStatus.PENDING, 
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
    },
    { 
        id: 2, 
        senderId: 3, // Priya Patel
        recipientId: 1, 
        status: InterestStatus.PENDING, 
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
    },
    { 
        id: 3, 
        senderId: 5, // Sneha Reddy
        recipientId: 1, 
        status: InterestStatus.ACCEPTED, 
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    { 
        id: 4, 
        senderId: 10, // Nikhil Gupta
        recipientId: 1, 
        status: InterestStatus.DECLINED, // User 1 declined this
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },

    // --- Interests SENT by current user (id: 1) ---
    { 
        id: 5, 
        senderId: 1, 
        recipientId: 4, // Vikram Singh
        status: InterestStatus.PENDING, 
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
    },
    { 
        id: 6, 
        senderId: 1, 
        recipientId: 7, // Kavya Nair
        status: InterestStatus.ACCEPTED, 
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    { 
        id: 7, 
        senderId: 1, 
        recipientId: 8, // Arjun Menon
        status: InterestStatus.DECLINED, 
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
    },
];

import { Report, SuccessStory, VerificationLog, AdminUser, AdminRole, AdminConversation, MessageStatus, MessageType, AdminAnalyticsData, SuccessStoryStatus } from "../types";
import { mockUsers } from "./mockUsers";

export const mockReports: Report[] = [
    {
        id: 'rep-1',
        reporterId: 3,
        reporterName: 'Priya Patel',
        reportedUserId: 2,
        reportedUserName: 'Rohan Verma',
        reason: 'Fake Profile',
        details: 'The user is using celebrity photos and their bio seems copied from somewhere else. They are not responding to messages either.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
    },
    {
        id: 'rep-2',
        reporterId: 5,
        reporterName: 'Sneha Reddy',
        reportedUserId: 4,
        reportedUserName: 'Vikram Singh',
        reason: 'Inappropriate Content/Behavior',
        details: 'This user sent me very rude and offensive messages. I have screenshots if needed.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
    },
    {
        id: 'rep-3',
        reporterId: 6,
        reporterName: 'Aditya Rao',
        reportedUserId: 10,
        reportedUserName: 'Nikhil Gupta',
        reason: 'Scamming or Fraud',
        details: 'The user asked for money for a personal emergency. This seems very suspicious.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
    }
];

export const mockPendingStories: SuccessStory[] = [
    {
        id: 101,
        coupleNames: 'Rina & Sameer',
        weddingDate: '2024-05-01',
        imageUrl: 'https://images.pexels.com/photos/1691921/pexels-photo-1691921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        story: "We are so grateful to ANZ Hindu Matrimony for helping us find each other. It was a match made in heaven and facilitated by technology. Thank you!",
        status: SuccessStoryStatus.PENDING,
    },
     {
        id: 102,
        coupleNames: 'John & Jane',
        weddingDate: '2024-04-20',
        imageUrl: 'https://images.pexels.com/photos/1309433/pexels-photo-1309433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        story: "A wonderful platform that connected us from two different cities. We are now happily married and starting our new life together. Highly recommended!",
        status: SuccessStoryStatus.PENDING,
    },
];

export const mockVerificationLogs: VerificationLog[] = mockUsers.slice(0, 10).map((user, i) => ({
    id: `log-${i}`,
    userId: user.id,
    userName: user.name,
    type: i % 2 === 0 ? 'EMAIL' : 'OTP',
    status: i % 3 === 0 ? 'Success' : i % 3 === 1 ? 'Failed' : 'Pending',
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
}));

export const mockAdminUsers: AdminUser[] = [
    {
        id: 'admin-super-1',
        name: 'Super Admin',
        email: 'admin@example.com',
        role: AdminRole.SUPER_ADMIN,
    },
    {
        id: 'admin-mod-1',
        name: 'Moderator User',
        email: 'moderator@example.com',
        role: AdminRole.MODERATOR,
    }
];

export const mockAdminConversations: AdminConversation[] = [
    {
        id: 'convo-1-2',
        participants: [mockUsers[0], mockUsers[1]],
        isFlagged: true,
        messages: [
            { id: '1-1', senderId: 1, content: 'Hey!', type: MessageType.TEXT, timestamp: new Date(Date.now() - 600000).toISOString(), status: MessageStatus.READ },
            { id: '1-2', senderId: 2, content: 'Stop messaging me.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 500000).toISOString(), status: MessageStatus.READ },
            { id: '1-3', senderId: 1, content: 'Why? I just want to talk.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 400000).toISOString(), status: MessageStatus.READ },
            { id: '1-4', senderId: 2, content: 'I already reported you.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 300000).toISOString(), status: MessageStatus.READ },
        ]
    },
    {
        id: 'convo-3-4',
        participants: [mockUsers[2], mockUsers[3]],
        isFlagged: false,
        messages: [
            { id: '2-1', senderId: 3, content: 'Hi Vikram, I really liked your profile.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), status: MessageStatus.READ },
            { id: '2-2', senderId: 4, content: 'Hi Priya, thank you! Yours is great as well. I see you are an architect, that is fascinating.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 86400000).toISOString(), status: MessageStatus.READ },
        ]
    },
    {
        id: 'convo-5-6',
        participants: [mockUsers[4], mockUsers[5]],
        isFlagged: false,
        messages: [
             { id: '3-1', senderId: 5, content: 'Hello Aditya.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 3600000).toISOString(), status: MessageStatus.READ },
        ]
    },
     {
        id: 'convo-7-8',
        participants: [mockUsers[6], mockUsers[7]],
        isFlagged: false,
        messages: [
             { id: '4-1', senderId: 7, content: 'I see you also live in Bangalore!', type: MessageType.TEXT, timestamp: new Date(Date.now() - 7200000).toISOString(), status: MessageStatus.READ },
             { id: '4-2', senderId: 8, content: 'Yes! We should meet up for coffee sometime.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 7000000).toISOString(), status: MessageStatus.READ },
             { id: '4-3', senderId: 7, content: 'I would love that.', type: MessageType.TEXT, timestamp: new Date(Date.now() - 6800000).toISOString(), status: MessageStatus.READ },
        ]
    }
];

export const mockAnalyticsData: AdminAnalyticsData = {
    keyMetrics: {
        newRegistrations: 75,
        activeUsers: 1890,
        matchesMade: 432,
        messagesSent: 12543,
    },
    registrationsLast7Days: [
        { day: 'Mon', count: 22 },
        { day: 'Tue', count: 35 },
        { day: 'Wed', count: 28 },
        { day: 'Thu', count: 45 },
        { day: 'Fri', count: 52 },
        { day: 'Sat', count: 68 },
        { day: 'Sun', count: 75 },
    ]
};
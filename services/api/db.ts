import { User, UserProfile, SuccessStory, Report, VerificationLog, AdminUser, Interest, Notification, UserRole, AdminRole, InterestStatus, SuccessStoryStatus, MembershipPlan } from '../../types';
import { mockUsers as initialMatchUsers } from '../../data/mockUsers';
import { mockSuccessStories } from '../../data/mockSuccessStories';
import { mockReports as initialReports, mockVerificationLogs as initialVerificationLogs, mockAdminUsers as initialAdminUsers, mockPendingStories } from '../../data/mockAdminData';
import { mockInterests as initialInterests } from '../../data/mockInterests';

// --- LOCALSTORAGE DATABASE SIMULATION ---

const DB_KEY = 'milaap_db';

const initialUsers: User[] = initialMatchUsers.map(m => ({
    id: m.id,
    name: m.name,
    email: `${m.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
    role: UserRole.CUSTOMER,
    createdAt: new Date(Date.now() - Math.random() * 1e11).toISOString(),
    profile: { ...m }
}));

const getInitialData = () => ({
  users: initialUsers,
  successStories: [...mockSuccessStories, ...mockPendingStories],
  reports: initialReports,
  verificationLogs: initialVerificationLogs,
  adminUsers: initialAdminUsers,
  interests: initialInterests,
  notifications: [] as Notification[],
  favourites: [] as number[], // Store only user IDs
});

export type Database = ReturnType<typeof getInitialData>;

export const getDb = (): Database => {
  try {
    const db = localStorage.getItem(DB_KEY);
    if (db) {
      const parsedDb = JSON.parse(db);
      // Ensure all keys from initial data are present
      return { ...getInitialData(), ...parsedDb };
    }
    const initialData = getInitialData();
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    console.error("Failed to read from localStorage, using initial data.", error);
    return getInitialData();
  }
};

export const saveDb = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// --- API SIMULATION HELPERS ---

export const simulateRequest = <T>(data: T, delay = 400): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));
};

export const simulateError = (message: string, status = 400) => {
  return new Promise((_, reject) => setTimeout(() => reject({ message, status }), 400));
};
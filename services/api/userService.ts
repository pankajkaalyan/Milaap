import { User, UserProfile, UserRole } from '../../types';
import { getDb, saveDb, simulateError, simulateRequest } from './db';

export const userService = {
  updateProfile: async (userId: string | number, profileUpdate: Partial<UserProfile>): Promise<User> => {
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id == userId);
    if (userIndex === -1) return simulateError('User not found', 404) as Promise<User>;

    const currentUser = db.users[userIndex];
    currentUser.profile = { ...currentUser.profile, ...profileUpdate };
    db.users[userIndex] = currentUser;
    
    saveDb(db);
    return simulateRequest(currentUser);
  },
  
  getAllUsers: async (): Promise<User[]> => {
      return simulateRequest(getDb().users);
  },
  
  updateUser: async(userId: string | number, userData: Partial<Pick<User, 'name' | 'role'>>): Promise<User> => {
      const db = getDb();
      const userIndex = db.users.findIndex(u => u.id == userId);
      if (userIndex === -1) return simulateError('User not found', 404) as Promise<User>;

      db.users[userIndex] = { ...db.users[userIndex], ...userData };
      saveDb(db);
      return simulateRequest(db.users[userIndex]);
  },
  
  addUser: async(name: string, email: string, role: UserRole): Promise<User> => {
      const db = getDb();
      const newUser: User = { id: `new-${Date.now()}`, name, email, role, createdAt: new Date().toISOString(), profile: { verificationStatus: 'Not Verified' } };
      db.users.unshift(newUser);
      saveDb(db);
      return simulateRequest(newUser);
  },

  deleteUsers: async(userIds: (string | number)[]): Promise<{success: true}> => {
      const db = getDb();
      db.users = db.users.filter(u => !userIds.includes(u.id));
      saveDb(db);
      return simulateRequest({success: true});
  },
};
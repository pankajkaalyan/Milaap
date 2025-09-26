import { AdminUser, AdminRole } from '../../types';
import { getDb, saveDb, simulateError, simulateRequest } from './db';

export const adminService = {
    getAdminUsers: async (): Promise<AdminUser[]> => {
      return simulateRequest(getDb().adminUsers);
    },
    
    updateAdminRole: async (userId: string | number, newRole: AdminRole): Promise<AdminUser> => {
      const db = getDb();
      const adminIndex = db.adminUsers.findIndex(u => u.id === userId);
      if (adminIndex === -1) return simulateError("Admin user not found", 404) as Promise<AdminUser>;
      db.adminUsers[adminIndex].role = newRole;
      saveDb(db);
      return simulateRequest(db.adminUsers[adminIndex]);
    },
};
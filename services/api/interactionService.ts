import { Interest, InterestStatus } from '../../types';
import { getDb, saveDb, simulateError, simulateRequest } from './db';

export const interactionService = {
  getFavourites: async (userId: number): Promise<number[]> => {
      const db = getDb();
      return simulateRequest(db.favourites || []);
  },
  
  toggleFavourite: async (userId: number, matchId: number): Promise<number[]> => {
      const db = getDb();
      const favs = new Set(db.favourites || []);
      if (favs.has(matchId)) {
          favs.delete(matchId);
      } else {
          favs.add(matchId);
      }
      db.favourites = Array.from(favs);
      saveDb(db);
      return simulateRequest(db.favourites);
  },

  getInterests: async (userId: number): Promise<Interest[]> => {
    const db = getDb();
    return simulateRequest(db.interests.filter(i => i.senderId === userId || i.recipientId === userId));
  },

  expressInterest: async (senderId: number, recipientId: number): Promise<Interest> => {
    const db = getDb();
    const existing = db.interests.find(i => i.senderId === senderId && i.recipientId === recipientId);
    if (existing) return simulateError("Interest already expressed", 409) as Promise<Interest>;
    
    const newInterest: Interest = {
      id: Date.now(),
      senderId,
      recipientId,
      status: InterestStatus.PENDING,
      timestamp: new Date().toISOString(),
    };
    db.interests.push(newInterest);
    saveDb(db);
    return simulateRequest(newInterest);
  },

  updateInterest: async (interestId: number, newStatus: InterestStatus): Promise<Interest> => {
    const db = getDb();
    const interestIndex = db.interests.findIndex(i => i.id === interestId);
    if (interestIndex === -1) return simulateError("Interest not found", 404) as Promise<Interest>;
    
    db.interests[interestIndex].status = newStatus;
    saveDb(db);
    return simulateRequest(db.interests[interestIndex]);
  },
};
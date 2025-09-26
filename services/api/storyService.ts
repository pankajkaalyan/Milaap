import { SuccessStory, SuccessStoryStatus } from '../../types';
import { getDb, saveDb, simulateError, simulateRequest } from './db';

export const storyService = {
  getSuccessStories: async (): Promise<SuccessStory[]> => {
    return simulateRequest(getDb().successStories);
  },
  
  submitSuccessStory: async (storyData: Omit<SuccessStory, 'id'|'status'>): Promise<SuccessStory> => {
    const db = getDb();
    const newStory: SuccessStory = {
        ...storyData,
        id: Date.now(),
        status: SuccessStoryStatus.PENDING,
    };
    db.successStories.unshift(newStory);
    saveDb(db);
    return simulateRequest(newStory);
  },
  
  updateStoryStatus: async(storyId: number, status: SuccessStoryStatus): Promise<SuccessStory> => {
      const db = getDb();
      const storyIndex = db.successStories.findIndex(s => s.id === storyId);
      if(storyIndex === -1) return simulateError("Story not found") as Promise<SuccessStory>;
      db.successStories[storyIndex].status = status;
      saveDb(db);
      return simulateRequest(db.successStories[storyIndex]);
  },
};
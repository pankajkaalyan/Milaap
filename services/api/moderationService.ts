import { Report, VerificationLog } from '../../types';
import { getDb, saveDb, simulateError, simulateRequest } from './db';

export const moderationService = {
    getReports: async (): Promise<Report[]> => {
      return simulateRequest(getDb().reports);
    },
    
    getVerificationLogs: async (): Promise<VerificationLog[]> => {
        return simulateRequest(getDb().verificationLogs);
    },
    
    updateReportStatus: async(reportId: string, status: 'Resolved' | 'Dismissed'): Promise<Report> => {
        const db = getDb();
        const reportIndex = db.reports.findIndex(r => r.id === reportId);
        if(reportIndex === -1) return simulateError("Report not found") as Promise<Report>;
        db.reports[reportIndex].status = status;
        saveDb(db);
        return simulateRequest(db.reports[reportIndex]);
    },
};
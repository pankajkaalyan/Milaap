import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { mockAdminConversations } from '../../data/mockAdminData';
import { useAppContext } from '../../hooks/useAppContext';
import { AdminChatReport, AdminConversation } from '../../types';
import FlagIcon from '../icons/FlagIcon';
import DotsVerticalIcon from '../icons/DotsVerticalIcon';
import { getChatReportByIdAPI, getPendingChatReportsAPI, putSuspendChatForChatReportAPI, putWarnUserForChatReportAPI } from '@/services/api/admin';
import ChatAvatar from './ChatAvatar';

const ChatMonitor: React.FC = () => {
    const { t, addToast } = useAppContext();
    const [conversations, setConversations] = useState<AdminConversation[]>(mockAdminConversations);
    const [selectedConvo, setSelectedConvo] = useState<AdminChatReport | null>(null);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    /** Prevent duplicate API calls (React 18 StrictMode safe) */
    const fetchedRef = useRef(false);

    const handleWarnUser = async (
        userName: string,
        userId: string | number,
        selectedConvo: AdminChatReport
    ) => {
        // 🚫 Guard: prevent API call
        if (!selectedConvo?.chatId || !userId) {
            addToast('Invalid user or chat report', 'error');
            setIsActionMenuOpen(false);
            return;
        }

        try {
            await putWarnUserForChatReportAPI({
                chatReportId: selectedConvo.chatId,
                userId,
            });

            addToast(
                t('toast.action.warn_user').replace('{name}', userName),
                'info'
            );
        } catch (error: any) {
            console.error(error);

            addToast(
                error?.response?.data?.errorMessage ||
                t('toast.error.warn_user') ||
                'Failed to warn user',
                'error'
            );
        } finally {
            setIsActionMenuOpen(false);
        }
    };


    const handleSuspendChat = async (
        selectedConvo: AdminChatReport
    ) => {
        try {
            await putSuspendChatForChatReportAPI({
                chatReportId: selectedConvo.chatId,
                userId: selectedConvo.reportedUserId,
            });

            addToast(
                t('toasts.action.suspend_chat') ||
                'Chat suspended successfully',
                'success'
            );
        } catch (error: any) {
            console.error(error);

            addToast(
                error?.response?.data?.errorMessage ||
                'Failed to suspend chat',
                'error'
            );
        } finally {
            setIsActionMenuOpen(false);
        }
    };




    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchReports = async () => {
            try {
                const reports = await getPendingChatReportsAPI();
                setConversations(reports);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReports();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isActionMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsActionMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActionMenuOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsActionMenuOpen(false);
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);



    const fetchChatReportById = async (reportId: string | number) => {
        try {
            const report = await getChatReportByIdAPI(reportId);
            setSelectedConvo(report);
            console.log('Fetched Chat Report:', selectedConvo);
            // ✅ Success toast
            addToast(
                'Chat report loaded successfully',
                'success'
            );

            return report;
        } catch (error) {
            console.error(error);

            // ❌ Error toast
            addToast(
                'Failed to load chat report',
                'error'
            );

            return null;
        }
    };


    return (
        <div className="flex flex-col md:flex-row h-[500px] gap-4 bg-black/20 rounded-lg border border-white/10 p-2">
            {/* Conversation List */}
            <div className="w-full md:w-1/3 border-r border-white/10 pr-2">
                <ul className="space-y-1 overflow-y-auto h-full">
                    {conversations.map(convo => (
                        <li key={convo.id}>
                            <button
                                onClick={() => fetchChatReportById(convo.id)}
                                className={`w-full text-left p-2 rounded-md flex justify-between items-center ${selectedConvo?.chatId === convo.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            >
                                <div>
                                    <p className="text-sm font-semibold text-white truncate">{convo.reportedByUserName} & {convo.reportedUserName}</p>
                                    <p className="text-xs text-gray-400">{selectedConvo?.messages?.length} messages</p>
                                </div>
                                {convo.isFlagged && (
                                    <div className="flex-shrink-0" title={t('admin.comm.chat_monitor.flagged')}>
                                        <FlagIcon />
                                    </div>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Chat Transcript */}
            <div className="w-full md:w-2/3 flex flex-col">
                {selectedConvo ? (
                    <>
                        <div className="p-2 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">{selectedConvo.reportedByUserName} & {selectedConvo.reportedUserName}</h3>
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setIsActionMenuOpen(prev => !prev)} className="p-1 rounded-full hover:bg-white/10 text-gray-300">
                                    <DotsVerticalIcon />
                                </button>
                                {isActionMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                                        <ul className="py-1">
                                            <li><button onClick={() => handleWarnUser(selectedConvo.reportedByUserName, selectedConvo.reportedByUserId, selectedConvo)} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">{t('admin.actions.warn')} {selectedConvo.reportedByUserName}</button></li>
                                            <li><button onClick={() => handleWarnUser(selectedConvo.reportedUserName, selectedConvo.reportedUserId, selectedConvo)} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">{t('admin.actions.warn')} {selectedConvo.reportedUserName}</button></li>
                                            <li><button onClick={() => handleSuspendChat(selectedConvo)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">{t('admin.actions.suspend_chat')}</button></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {selectedConvo.messages.map(msg => {
                                return (
                                    <div key={msg.id} className="flex items-start gap-2.5">
                                        <ChatAvatar
                                            name={msg.senderName}
                                            photo={msg.senderPhoto}
                                        />

                                        <div className="flex flex-col gap-1 w-full max-w-[320px]">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="text-sm font-semibold text-white">{msg.senderName}</span>
                                                <span className="text-xs font-normal text-gray-400">{new Date(msg.sentAt).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex flex-col leading-1.5 p-3 border-gray-200 bg-gray-700 rounded-e-xl rounded-es-xl">
                                                <p className="text-sm font-normal text-white">{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <p>{t('admin.communication.chat_monitor.select_chat')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMonitor;

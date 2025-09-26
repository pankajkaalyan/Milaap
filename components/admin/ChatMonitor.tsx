import React from 'react';
import { useState } from 'react';
import { mockAdminConversations } from '../../data/mockAdminData';
import { useAppContext } from '../../hooks/useAppContext';
import { AdminConversation } from '../../types';
import FlagIcon from '../icons/FlagIcon';
import DotsVerticalIcon from '../icons/DotsVerticalIcon';

const ChatMonitor: React.FC = () => {
    const { t, addToast } = useAppContext();
    const [conversations] = useState<AdminConversation[]>(mockAdminConversations);
    const [selectedConvo, setSelectedConvo] = useState<AdminConversation | null>(null);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    
    const handleWarnUser = (userName: string) => {
        addToast(t('toast.action.warn_user').replace('{name}', userName), 'info');
        setIsActionMenuOpen(false);
    };

    const handleSuspendChat = () => {
        addToast(t('toast.action.suspend_chat'), 'success');
        setIsActionMenuOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-[500px] gap-4 bg-black/20 rounded-lg border border-white/10 p-2">
            {/* Conversation List */}
            <div className="w-full md:w-1/3 border-r border-white/10 pr-2">
                <ul className="space-y-1 overflow-y-auto h-full">
                    {conversations.map(convo => (
                        <li key={convo.id}>
                            <button
                                onClick={() => setSelectedConvo(convo)}
                                className={`w-full text-left p-2 rounded-md flex justify-between items-center ${selectedConvo?.id === convo.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            >
                                <div>
                                    <p className="text-sm font-semibold text-white truncate">{convo.participants[0].name} & {convo.participants[1].name}</p>
                                    <p className="text-xs text-gray-400">{convo.messages.length} messages</p>
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
                            <h3 className="text-lg font-bold text-white">{selectedConvo.participants[0].name} & {selectedConvo.participants[1].name}</h3>
                            <div className="relative">
                                <button onClick={() => setIsActionMenuOpen(prev => !prev)} className="p-1 rounded-full hover:bg-white/10 text-gray-300">
                                    <DotsVerticalIcon />
                                </button>
                                {isActionMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                                        <ul className="py-1">
                                            <li><button onClick={() => handleWarnUser(selectedConvo.participants[0].name)} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">{t('admin.actions.warn')} {selectedConvo.participants[0].name}</button></li>
                                            <li><button onClick={() => handleWarnUser(selectedConvo.participants[1].name)} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">{t('admin.actions.warn')} {selectedConvo.participants[1].name}</button></li>
                                            <li><button onClick={handleSuspendChat} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">{t('admin.actions.suspend_chat')}</button></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {selectedConvo.messages.map(msg => {
                                const sender = selectedConvo.participants.find(p => p.id === msg.senderId);
                                return (
                                    <div key={msg.id} className="flex items-start gap-2.5">
                                        <img className="w-8 h-8 rounded-full object-cover" src={`https://picsum.photos/100/100?random=${msg.senderId}`} alt={sender?.name} />
                                        <div className="flex flex-col gap-1 w-full max-w-[320px]">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="text-sm font-semibold text-white">{sender?.name}</span>
                                                <span className="text-xs font-normal text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
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
                        <p>{t('admin.comm.chat_monitor.select_chat')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMonitor;

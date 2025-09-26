import React, { useState, useEffect, useRef } from 'react';
import { generativeService } from '../../services/ai/generativeService';
import { useAppContext } from '../../hooks/useAppContext';
import SendIcon from '../icons/SendIcon';
import CloseIcon from '../icons/CloseIcon';
import { ChatHistory, SupportChatMode } from '../../types';

interface SupportChatWindowProps {
  onClose: () => void;
}

const SupportChatWindow: React.FC<SupportChatWindowProps> = ({ onClose }) => {
    const { t, addToast } = useAppContext();
    const [messages, setMessages] = useState<ChatHistory[]>([]);
    const [userInput, setUserInput] = useState('');
    const [chatMode, setChatMode] = useState<SupportChatMode>(SupportChatMode.AI);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial welcome message
    useEffect(() => {
        setMessages([{ sender: 'ai', text: t('support.ai_welcome') }]);
    }, [t]);

    // Scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleTransferToHuman = () => {
        setChatMode(SupportChatMode.HUMAN);
        setMessages(prev => [...prev, { sender: 'system', text: t('support.human_agent_transfer') }]);
    };

    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatHistory = { sender: 'user', text: userInput };
        const currentMessages: ChatHistory[] = [...messages, userMessage];
        
        setMessages(currentMessages);
        setUserInput('');
        setIsLoading(true);

        if (chatMode === SupportChatMode.AI) {
            try {
                const responseStream = await generativeService.getSupportResponseStream(
                    currentMessages.filter(msg => msg.sender !== 'system')
                );
                
                setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
                
                let fullText = '';
                for await (const chunk of responseStream) {
                    const chunkText = chunk.text;
                    if (chunkText) {
                        fullText += chunkText;
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1].text = fullText;
                            return newMessages;
                        });
                    }
                }

            } catch (error) {
                console.error("Error with AI support chat:", error);
                addToast("Sorry, the AI assistant is currently unavailable.", 'error');
                handleTransferToHuman(); // Fail over to human
            }

        } else { // chatMode is 'human'
            setTimeout(() => {
                const agentResponse: ChatHistory = { sender: 'agent', text: t('support.response') };
                setMessages(prev => [...prev, agentResponse]);
            }, 1500);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[70vh] max-h-[500px] bg-gray-900 border border-white/20 rounded-xl shadow-2xl flex flex-col animate-fade-in-up md:bottom-8 md:right-8">
            {/* Header */}
            <div className="p-4 bg-white/5 rounded-t-xl flex justify-between items-center border-b border-white/10 shrink-0">
                <h3 className="text-lg font-bold text-white">{t('support.title')}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close support chat">
                    <CloseIcon />
                </button>
            </div>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => {
                     if (msg.sender === 'system') {
                        return (
                             <div key={index} className="text-center text-xs text-gray-400 italic py-2">
                                {msg.text}
                            </div>
                        )
                    }
                    return (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-xl ${
                                msg.sender === 'user' 
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none' 
                                    : 'bg-gray-700 text-white rounded-bl-none'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    )
                })}
                 {isLoading && messages[messages.length - 1]?.sender === 'user' && ( // Show typing only while waiting for the first chunk
                    <div className="flex items-end gap-2 justify-start">
                         <div className="max-w-xs px-4 py-3 rounded-xl bg-gray-700 text-white rounded-bl-none">
                            <span className="typing-indicator">
                                <span></span><span></span><span></span>
                            </span>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {chatMode === SupportChatMode.AI && (
                <div className="px-4 pb-2 text-center">
                    <button onClick={handleTransferToHuman} className="text-xs text-amber-400 hover:underline">
                        {t('support.human_agent_button')}
                    </button>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('support.type_message')}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        aria-label="Support chat input"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        className="p-2 text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={!userInput.trim() || isLoading}
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportChatWindow;
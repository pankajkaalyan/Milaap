import React, { useState, useRef } from 'react';
import { MessageType } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';
import StopIcon from '../../icons/StopIcon';
import SendIcon from '../../icons/SendIcon';
import ImageIcon from '../../icons/ImageIcon';
import MicIcon from '../../icons/MicIcon';
import VideoIcon from '../../icons/VideoIcon';

interface ChatInputProps {
  onSendMessage: (content: string, type: MessageType) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const { t, addToast } = useAppContext();
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text, MessageType.TEXT);
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  onSendMessage(event.target.result, MessageType.IMAGE);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  }
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  onSendMessage(event.target.result, MessageType.VIDEO);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    // The onstop event handler will do the rest.
  };

  const startRecording = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          addToast('Audio recording is not supported by your browser.', 'error');
          return;
      }

      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioChunksRef.current = [];
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                  audioChunksRef.current.push(event.data);
              }
          };

          recorder.onstop = () => {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const audioUrl = URL.createObjectURL(audioBlob);
              onSendMessage(audioUrl, MessageType.AUDIO);
              // Stop all tracks on the stream to turn off the mic indicator in the browser tab
              stream.getTracks().forEach(track => track.stop());
              setIsRecording(false);
          };

          recorder.start();
          setIsRecording(true);
      } catch (err) {
          console.error('Error accessing microphone:', err);
          if (err instanceof DOMException && err.name === "NotAllowedError") {
              addToast(t('toast.mic.permission_denied'), 'error');
          } else {
              addToast(t('toast.mic.error'), 'error');
          }
      }
  };

  const handleMicClick = () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isRecording ? t('message.chat.recording') : t('messages.chat.type_message')}
        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-white disabled:opacity-50"
        aria-label="Chat input"
        disabled={isRecording}
      />
       <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
       <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/*" className="hidden" />
      <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Upload image" disabled={isRecording}>
        <ImageIcon className="h-6 w-6" />
      </button>
      <button onClick={() => videoInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Upload video" disabled={isRecording}>
        <VideoIcon className="h-6 w-6" />
      </button>
       <button onClick={handleMicClick} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label={isRecording ? 'Stop recording' : 'Record audio'}>
        {isRecording ? <StopIcon className="text-red-500 animate-pulse" /> : <MicIcon className="h-6 w-6" />}
      </button>
      <button
        onClick={handleSend}
        className="p-2 text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!text.trim() || isRecording}
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default ChatInput;
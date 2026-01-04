import { useAppContext } from '../../../hooks/useAppContext';
import React, { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    selectedMessages: number[];
    reportReason: string;
  }) => void;
  selectedMessages: number[];
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedMessages,
}) => {
  const { t } = useAppContext();
  const [reportReason, setReportReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      selectedMessages,
      reportReason,
    });
    setReportReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-md p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-white mb-2">
          {t('report.messages.title') || 'Report Messages'}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4">
          {t('report.messages.selected_count') || 'Selected messages'}:{' '}
          {selectedMessages.length} / 10
        </p>

        {/* Textarea */}
        <textarea
          className="
            w-full min-h-[100px]
            bg-black/40 border border-white/10
            rounded-lg p-3 text-sm text-white
            focus:outline-none focus:ring-1 focus:ring-red-500
          "
          placeholder={
            t('report.messages.reason_placeholder') ||
            'Please provide a reason for reporting'
          }
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            {'Cancel'}
          </button>

          <button
            onClick={handleConfirm}
            disabled={!reportReason.trim() || !selectedMessages.length}
            className="
              px-4 py-2 rounded-lg
              bg-red-600 text-white
              hover:bg-red-700
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {t('report.messages.submit') || 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

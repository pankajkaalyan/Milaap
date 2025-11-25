import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import ClockIcon from '../../components/icons/ClockIcon';
import Spinner from '../../components/ui/Spinner';
import { SpinnerSize, ButtonVariant, AppEventStatus, VerificationStatus } from '../../types';
import { eventBus } from '@/utils/eventBus';

interface AILoadingIndicatorProps {
    message: string;
}

const AILoadingIndicator: React.FC<AILoadingIndicatorProps> = ({ message }) => (
    <div className="flex items-center justify-center space-x-3 text-lg text-gray-300">
        <Spinner size={SpinnerSize.SM} />
        <span>{message}</span>
    </div>
);


const Verification: React.FC = () => {
    const { user, t, submitVerification, verifyProfileWithAI, addToast } = useAppContext();
    const [document, setDocument] = useState<File[]>([]);
    const [isAIVerifying, setIsAIVerifying] = useState(false);
    const [aiStatusMessage, setAiStatusMessage] = useState('');
    const [currentStatus, setCurrentStatus] = useState(user?.profile?.verificationStatus || 'Not Verified');

    // let status = (user?.profile?.verificationStatus || 'Not Verified');

    const handleSubmit = () => {
        if (document.length === 0) {
            addToast('Please upload a document first.', 'error');
            return;
        }
        submitVerification(document[0]);
        // addToast(t('toasts.verification.submitted'), 'success');
    };

    const handleAIVerify = async () => {
        if (document.length === 0) {
            addToast('Please upload a document first.', 'error');
            return;
        }

        setIsAIVerifying(true);
        setAiStatusMessage(t('verification.ai.loading'));

        await new Promise(res => setTimeout(res, 1000));
        setAiStatusMessage(t('verification.ai.analyzing'));

        await new Promise(res => setTimeout(res, 2000));
        setAiStatusMessage(t('verification.ai.matching'));

        await verifyProfileWithAI(document[0]);
        setIsAIVerifying(false);
        setAiStatusMessage('');
    };
    const updateStatus = ({
        userId,
        newStatus,
    }: {
        userId: number | string;
        newStatus: VerificationStatus;
    }) => {
        console.log("Updating status for user:", userId);
        setCurrentStatus(newStatus);
    };

    useEffect(() => {
        eventBus.on(AppEventStatus.VERIFICATION_SUBMITTED, updateStatus);
        setCurrentStatus(user?.profile?.verificationStatus || 'Not Verified');
        return () => {
            eventBus.off(AppEventStatus.VERIFICATION_SUBMITTED, updateStatus);
        };
    }, [user]);


    const renderStatusContent = () => {
        switch (currentStatus.toLocaleLowerCase()) {
            case 'verified':
                return (
                    <div className="text-center p-8 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white">{t('verification.status.verified')}</h3>
                        <p className="text-gray-300 mt-2">{t('verification.success_message')}</p>
                    </div>
                );
            case 'pending':
                return (
                    <div className="text-center p-8 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <ClockIcon className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white">{t('verification.status.pending')}</h3>
                        <p className="text-gray-300 mt-2">{t('verification.review_message')}</p>
                    </div>
                );
            case 'not verified':
            case 'unverified':
            default:
                return (
                    <div>
                        <FileUpload
                            id="verification-doc"
                            label={t('verification.upload_prompt')}
                            description="Your document will be kept confidential and is used for verification purposes only."
                            onFilesChange={(files) => setDocument(files)}
                            accept="image/*,.pdf"
                        />
                        {isAIVerifying ? (
                            <div className="mt-6">
                                <AILoadingIndicator message={aiStatusMessage} />
                            </div>
                        ) : (
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <Button onClick={handleSubmit} disabled={document.length === 0} variant={ButtonVariant.SECONDARY}>
                                    {t('verification.submit')}
                                </Button>
                                <Button onClick={handleAIVerify} disabled={document.length === 0}>
                                    {t('verification.verify_with_ai')}
                                </Button>
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">{t('verification.title')}</h1>
                    <p className="text-gray-300 mb-8">{t('verification.subtitle')}</p>
                </div>

                <div className="mt-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-white">{t('verification.status_label')}:
                            <span className={`ml-2 ${status === 'Verified' ? 'text-green-400' :
                                status === 'Pending' ? 'text-orange-400' :
                                    'text-yellow-400'
                                }`}>
                                {status === 'Verified' && t('verification.status.verified')}
                                {status === 'Pending' && t('verification.status.pending')}
                                {status === 'Not Verified' && t('verification.status.not_verified')}
                            </span>
                        </h2>
                    </div>
                    {renderStatusContent()}
                </div>
            </Card>
        </div>
    );
};

export default Verification;
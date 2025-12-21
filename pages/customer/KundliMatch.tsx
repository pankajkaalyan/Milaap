import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import KundliReportDisplay from '../../components/customer/kundli/KundliReportDisplay';
import Spinner from '../../components/ui/Spinner';
import { Match, User, SpinnerSize, ButtonVariant } from '../../types';
import { getDashboardDataAPI } from '@/services/api/dashboard';

/* ----------------------------------------
   LOADING STATE
-----------------------------------------*/
interface LoadingStateProps {
    name: string;
    text: string;
    desc: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ name, text, desc }) => (
    <Card className="text-center py-16">
        <Spinner size={SpinnerSize.LG} message={text} />
        <p className="text-gray-300 max-w-md mx-auto mt-4">
            {desc.replace('{name}', name)}
        </p>
    </Card>
);

/* ----------------------------------------
   INITIAL STATE
-----------------------------------------*/
interface InitialStateProps {
    onGenerate: () => void;
    currentUser: User;
    otherUser: Match;
    t: (key: string) => string;
}

const InitialState: React.FC<InitialStateProps> = ({
    onGenerate,
    currentUser,
    otherUser,
    t,
}) => {
    const [imgError, setImgError] = useState(false);
    const [imgOtherUserError, setimgOtherUserError] = useState(false);

    const showInitials = imgError || !currentUser.profile.photos?.length;
    const showOtherUserInitials = imgOtherUserError || !otherUser.photos?.length;

    console.log('Current User Photos:', currentUser);
    console.log('Other User Photos:', otherUser);
    return (
        <div className="space-y-8">
            <Card className="flex flex-col md:flex-row items-center justify-around gap-8 py-12">
                {/* CURRENT USER */}
                <div className="text-center">
                    {!showInitials ? (
                        <img
                            src={currentUser.profile.photos?.[0]}
                            alt={currentUser.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-amber-500 mx-auto"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-amber-500 mx-auto bg-white/10 text-white flex items-center justify-center text-4xl font-bold">
                            {currentUser.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-white mt-4">
                        {currentUser.name}
                    </h3>
                </div>

                <div className="text-4xl font-bold text-amber-400">&amp;</div>

                {/* OTHER USER */}
                <div className="text-center">
                    {!showOtherUserInitials ? (
                        <img
                            src={otherUser.photos?.[0]}
                            alt={otherUser.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 mx-auto"
                            onError={() => setimgOtherUserError(true)}
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-orange-500 mx-auto bg-white/10 text-white flex items-center justify-center text-4xl font-bold">
                            {otherUser.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-white mt-4">
                        {otherUser.name}
                    </h3>
                </div>
            </Card>

            <div className="text-center">
                <Button onClick={onGenerate} className="max-w-xs mx-auto">
                    {t('kundli.generate_report')}
                </Button>
            </div>
        </div>
    );
};

/* ----------------------------------------
   MAIN COMPONENT
-----------------------------------------*/
const KundliMatch: React.FC = () => {
    const { t, user: currentUser, kundliReports, fetchAIKundliReport } =
        useAppContext();

    const { userId } = useParams<{ userId: string }>();
    const numericUserId = Number(userId);

    const [otherUser, setOtherUser] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /* ----------------------------------------
       FETCH USER FROM DASHBOARD API
    -----------------------------------------*/
    useEffect(() => {
        if (!numericUserId) {
            setIsLoading(false);
            return;
        }

        let mounted = true;

        const fetchUser = async () => {
            try {
                const dashboardUsers = await getDashboardDataAPI();
                const foundUser = dashboardUsers.find(
                    u => u.id === numericUserId
                );

                if (mounted) {
                    setOtherUser(foundUser || null);
                }
            } catch (err) {
                console.error('Dashboard API error:', err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchUser();

        return () => {
            mounted = false;
        };
    }, [numericUserId]);

    /* ----------------------------------------
       EARLY STATES
    -----------------------------------------*/
    if (isLoading) {
        return (
            <Card className="text-center py-16">
                <Spinner size={SpinnerSize.LG} />
            </Card>
        );
    }

    if (!currentUser || !otherUser) {
        return (
            <Card className="text-center">
                <p>User not found.</p>
                <Link
                    to="/matches"
                    className="text-amber-400 hover:underline mt-4 inline-block"
                >
                    Back to Matches
                </Link>
            </Card>
        );
    }

    /* ----------------------------------------
       KUNDLI LOGIC
    -----------------------------------------*/
    const reportKey = `${currentUser.id}-${otherUser.id}`;
    const report = kundliReports[reportKey];

    const handleGenerate = () => {
        fetchAIKundliReport(otherUser.id);
    };

    const renderContent = () => {
        if (report === 'loading') {
            return (
                <LoadingState
                    name={otherUser.name}
                    text={t('kundli.generating')}
                    desc={t('kundli.generating_desc')}
                />
            );
        }

        if (report === 'error') {
            return (
                <Card className="text-center py-16">
                    <p className="text-red-400 mb-4">{t('kundli.error')}</p>
                    <Button
                        onClick={handleGenerate}
                        variant={ButtonVariant.SECONDARY}
                        className="w-auto"
                    >
                        Try Again
                    </Button>
                </Card>
            );
        }

        if (typeof report === 'object') {
            return (
                <KundliReportDisplay
                    report={report}
                    users={{ currentUser, otherUser }}
                />
            );
        }

        return (
            <InitialState
                onGenerate={handleGenerate}
                currentUser={currentUser}
                otherUser={otherUser}
                t={t}
            />
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white">
                    {t('kundli.ai_title')}
                </h1>
                <p className="text-gray-300 mt-2 text-lg">
                    {t('kundli.between')
                        .replace('{name1}', currentUser.name)
                        .replace('{name2}', otherUser.name)}
                </p>
            </div>

            {renderContent()}
        </div>
    );
};

export default KundliMatch;

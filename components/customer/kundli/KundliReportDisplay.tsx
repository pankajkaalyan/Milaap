import React from 'react';
import { AIKundliReport, Match, User } from '../../../types';
import Card from '../../ui/Card';
import { useAppContext } from '../../../hooks/useAppContext';
import CircularProgressBar from '../../ui/CircularProgressBar';

interface KundliReportDisplayProps {
  report: AIKundliReport;
  users: {
    currentUser: User;
    otherUser: Match;
  };
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);
const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-1 2.053a1 1 0 01-.633.633l-2.053 1a1 1 0 000 1.788l2.053 1a1 1 0 01.633.633l1 2.053a1 1 0 001.788 0l1-2.053a1 1 0 01.633-.633l2.053-1a1 1 0 000-1.788l-2.053-1a1 1 0 01-.633-.633l-1-2.053zM15 8a1 1 0 100-2 1 1 0 000 2zM5 8a1 1 0 100-2 1 1 0 000 2zM8 15a1 1 0 100-2 1 1 0 000 2zM12 15a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

const KundliReportDisplay: React.FC<KundliReportDisplayProps> = ({ report }) => {
    const { t } = useAppContext();

    return (
        <div className="space-y-8 animate-fade-in">
            <Card className="text-center bg-gradient-to-br from-amber-900/50 to-orange-900/50">
                <h2 className="text-3xl font-bold text-white">{report.overallCompatibility}</h2>
            </Card>
            
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-white mb-4">{t('kundli.guna_milan')}</h3>
                    <CircularProgressBar value={report.compatibilityScore} maxValue={36} />
                    <p className="text-gray-400 mt-2">{t('kundli.out_of_36')}</p>
                </Card>
                <Card className="md:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center"><CheckIcon /> <span className="ml-2">{t('kundli.positive_aspects')}</span></h3>
                    <ul className="space-y-3">
                        {report.positiveAspects.map((aspect, index) => (
                            <li key={index} className="text-gray-300 pl-4 border-l-2 border-green-500/50">{aspect}</li>
                        ))}
                    </ul>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center"><AlertIcon /> <span className="ml-2">{t('kundli.potential_challenges')}</span></h3>
                 <ul className="space-y-3">
                    {report.potentialChallenges.map((challenge, index) => (
                        <li key={index} className="text-gray-300 pl-4 border-l-2 border-yellow-500/50">{challenge}</li>
                    ))}
                </ul>
            </Card>
             <Card>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center"><SparkleIcon /> <span className="ml-2">{t('kundli.spiritual_guidance')}</span></h3>
                <p className="text-gray-300 leading-relaxed italic">"{report.spiritualGuidance}"</p>
            </Card>

        </div>
    );
};

export default KundliReportDisplay;
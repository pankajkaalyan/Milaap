import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { MembershipPlan } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

interface Plan {
    name: string;
    plan: MembershipPlan;
    price: number;
    isPopular?: boolean;
    features: string[];
}

interface PlanCardProps {
    plan: Plan;
    isCurrentPlan: boolean;
    onChoosePlan: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrentPlan, onChoosePlan }) => {
    const { t } = useAppContext();

    return (
        <Card className={`flex flex-col h-full ${plan.isPopular ? 'border-2 border-amber-500 transform md:scale-105' : ''}`}>
            {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {t('membership.most_popular')}
                </div>
            )}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                <p className="text-4xl font-extrabold text-white">
                    ₹{plan.price}<span className="text-lg font-normal text-gray-400">{plan.price > 0 ? t('membership.price_month') : ''}</span>
                </p>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckIcon />
                        <span className="ml-3 text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-auto">
                {isCurrentPlan ? (
                    <div className="text-center py-3 font-semibold rounded-lg bg-white/10 text-amber-400">
                        {t('membership.current_plan')}
                    </div>
                ) : (
                    <Button onClick={onChoosePlan} disabled={isCurrentPlan}>
                        {t('membership.choose_plan')}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default PlanCard;
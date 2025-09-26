import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { MembershipPlan } from '../types';
import PlanCard from '../components/membership/PlanCard';

const Membership: React.FC = () => {
    const { t, user, upgradePlan } = useAppContext();
    const currentPlan = user?.profile?.membership || MembershipPlan.FREE;

    const plans = [
        { 
            name: t('membership.plan.free'),
            plan: MembershipPlan.FREE,
            price: 0, 
            features: [
                t('membership.feature.view_profiles'),
                t('membership.feature.send_interests'),
                t('membership.feature.kundli_match'),
                t('membership.feature.messaging'),
            ] 
        },
        { 
            name: t('membership.plan.premium'),
            plan: MembershipPlan.PREMIUM,
            price: 499,
            isPopular: true,
            features: [
                t('membership.feature.view_profiles'),
                t('membership.feature.send_interests'),
                t('membership.feature.kundli_match'),
                t('membership.feature.unlimited_messaging'),
                t('membership.feature.view_visitors'),
                t('membership.feature.view_contact'),
                t('membership.feature.premium_badge'),
            ] 
        },
        { 
            name: t('membership.plan.premium_plus'),
            plan: MembershipPlan.PREMIUM_PLUS,
            price: 999,
            features: [
                t('membership.feature.view_profiles'),
                t('membership.feature.send_interests'),
                t('membership.feature.kundli_match'),
                t('membership.feature.unlimited_messaging'),
                t('membership.feature.view_visitors'),
                t('membership.feature.view_contact'),
                t('membership.feature.premium_badge'),
                t('membership.feature.profile_boost'),
                t('membership.feature.dedicated_support'),
            ] 
        },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('membership.title')}</h1>
                <p className="text-lg text-gray-300">{t('membership.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((planInfo) => (
                    <PlanCard 
                        key={planInfo.plan}
                        plan={planInfo}
                        isCurrentPlan={currentPlan === planInfo.plan}
                        onChoosePlan={() => upgradePlan(planInfo.plan)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Membership;

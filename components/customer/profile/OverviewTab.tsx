import React from 'react';
import { Link } from 'react-router-dom';
import { Match, ButtonVariant, UserRole } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import CompatibilityChecklist from '../CompatibilityChecklist';
import { useAppContext } from '../../../hooks/useAppContext';

interface OverviewTabProps {
    user: Match;
    showContact: boolean;
    onViewContact: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ user, showContact, onViewContact }) => {
    const { t } = useAppContext();
    const logedInUser = useAppContext().user;
    return (
        <div className="space-y-8">
            <CompatibilityChecklist targetUser={user} />

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="text-center">
                    <Button onClick={onViewContact} className="w-full">
                        {t('profile.view_contact')}
                    </Button>
                    {showContact && (
                        <div className="mt-4 p-4 bg-white/10 rounded-lg animate-fade-in">
                            <p className="text-white font-semibold">Phone: +91 98765 43210</p>
                        </div>
                    )}
                </Card>
                {logedInUser.role !== UserRole.ADMIN && (
                    <Card className="text-center">
                        <Link to={`/kundli-match/${user.id}`}>
                            <Button
                                className="w-full"
                                variant={ButtonVariant.SECONDARY}
                            >
                                {t('kundli.check_match')}
                            </Button>
                        </Link>
                    </Card>
                )}

            </div>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">{t('profile.about')}</h2>
                <p className="text-gray-300 leading-relaxed">{user.about || 'No information provided yet.'}</p>
            </Card>
        </div>
    );
};

export default OverviewTab;
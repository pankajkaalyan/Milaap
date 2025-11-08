import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import CheckIcon from '../components/icons/CheckIcon';
import BoltIcon from '../components/icons/BoltIcon';
import LockIcon from '../components/icons/LockIcon';
import SEO from '../components/ui/SEO';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const Home: React.FC = () => {
    const { t } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
        <Card className="text-center transform hover:-translate-y-2">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
        </Card>
    );

    return (
        <>
            <SEO
                title={`${t('nav.home')} | Milaap`}
                description={t('home.subtitle')}
            />
            <div className="text-center">
                <PageHeader title={t('home.title')} subtitle={t('home.subtitle')} />

                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Button onClick={() => navigate('/register')} className="max-w-xs mx-auto">
                        {t('home.cta')}
                    </Button>
                </div>

                <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <FeatureCard
                            title={t('home.features.verified.title')}
                            description={t('home.features.verified.desc')}
                            icon={<CheckIcon className="h-8 w-8 text-white" />}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                        <FeatureCard
                            title={t('home.features.horoscope.title')}
                            description={t('home.features.horoscope.desc')}
                            icon={<BoltIcon className="h-8 w-8 text-white" />}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                        <FeatureCard
                            title={t('home.features.secure.title')}
                            description={t('home.features.secure.desc')}
                            icon={<LockIcon className="h-8 w-8 text-white" />}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;


import React from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import SEO from '../components/ui/SEO';

const About: React.FC = () => {
    const { t } = useAppContext();
    const aboutDescription = "Learn about ANZ Hindu Matrimony, the premier matrimonial platform for the Hindu community. Our mission is to blend tradition with technology for a safe and user-friendly experience.";

    return (
        <>
            <SEO 
                title={`${t('nav.about')} | ANZ Hindu Matrimony`}
                description={aboutDescription}
            />
            <div className="max-w-4xl mx-auto">
                <Card>
                    <h1 className="text-4xl font-bold text-white mb-6 text-center">{t('nav.about')}</h1>
                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p>
                            Welcome to ANZ Hindu Matrimony, the premier matrimonial platform dedicated to helping the Hindu community find their soulmates. Our mission is to blend tradition with technology, creating a safe, secure, and user-friendly environment for individuals and families to connect.
                        </p>
                        <p>
                            At ANZ Hindu Matrimony, we understand the cultural nuances and values that are integral to Hindu marriages. We offer detailed profiles that include essential information about family background, education, profession, and, most importantly, astrological compatibility through advanced horoscope matching.
                        </p>
                        <h2 className="text-2xl font-semibold text-white pt-4">Our Commitment</h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Authenticity:</strong> We employ a rigorous verification process to ensure all profiles are genuine.</li>
                            <li><strong>Privacy:</strong> You have complete control over your data. Choose who can view your profile and contact information.</li>
                            <li><strong>Technology:</strong> Our platform uses modern algorithms to provide you with highly compatible matches, saving you time and effort in your search for a life partner.</li>
                        </ul>
                        <p>
                            Join us on this sacred journey of finding a life partner. We are committed to helping you find a 'union' of hearts, minds, and souls.
                        </p>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default About;
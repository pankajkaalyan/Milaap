
import React from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';

const Privacy: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <h1 className="text-4xl font-bold text-white mb-6 text-center">{t('staticPages.privacy.title')}</h1>
                <div className="space-y-4 text-gray-300 leading-relaxed prose prose-invert max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        Your privacy is important to us. It is ANZ Hindu Matrimony's policy to respect your privacy regarding any information we may collect from you across our website.
                    </p>
                    <h2 className="text-2xl font-semibold text-white pt-4">1. Information We Collect</h2>
                    <p>
                        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
                    </p>
                    <h2 className="text-2xl font-semibold text-white pt-4">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to operate, maintain, and provide you the features and functionality of the Service, to analyze how the Service is used, diagnose service or technical problems, maintain security, and personalize content.
                    </p>
                    <h2 className="text-2xl font-semibold text-white pt-4">3. Security</h2>
                    <p>
                        We take security seriously and take reasonable measures to protect your information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
                    </p>
                    <h2 className="text-2xl font-semibold text-white pt-4">4. Links to Other Sites</h2>
                    <p>
                        Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Privacy;

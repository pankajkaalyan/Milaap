
import React from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';

const Terms: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <h1 className="text-4xl font-bold text-white mb-6 text-center">{t('staticPages.terms.title')}</h1>
                <div className="space-y-4 text-gray-300 leading-relaxed prose prose-invert max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                    </p>
                    <h2 className="text-2xl font-semibold text-white pt-4">1. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials on Milaap's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                    <h2 className="text-2xl font-semibold text-white pt-4">2. Disclaimer</h2>
                    <p>
                        The materials on Milaap's website are provided "as is". Milaap makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                    </p>
                    <h2 className="text-2xl font-semibold text-white pt-4">3. Limitations</h2>
                    <p>
                        In no event shall Milaap or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Milaap's website.
                    </p>
                     <h2 className="text-2xl font-semibold text-white pt-4">4. Governing Law</h2>
                    <p>
                        Any claim relating to Milaap's website shall be governed by the laws of the website's home jurisdiction without regard to its conflict of law provisions.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Terms;

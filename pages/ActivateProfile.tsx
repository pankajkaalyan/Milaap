import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { activateProfileAPI } from '@/services/api/profile';

const ActivateProfile = () => {
    const { t, addToast } = useAppContext();
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    const [loading, setLoading] = useState(true);
    const [activated, setActivated] = useState(false);


    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const callKey = `activate-profile-${token}`;

        // 🔁 API already called
        if (sessionStorage.getItem(callKey)) {
            setActivated(true);      // ✅ update UI
            setLoading(false);       // ✅ stop loader
            return;
        }

        sessionStorage.setItem(callKey, 'true');

        const activateProfile = async () => {
            try {
                await activateProfileAPI(token);
                setActivated(true);
                addToast(t('activateProfile.success'), 'success');
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.errorMessage || error?.errorMessage;

                if (errorMessage?.toLowerCase().includes('already activated')) {
                    addToast(t('activateProfile.alreadyActivated'), 'info');
                    navigate('/login');
                    return;
                }

                addToast(t('activateProfile.failure'), 'error');
            } finally {
                setLoading(false);
            }
        };

        activateProfile();
    }, [token, navigate, t, addToast]);



    return (
        <div className="max-w-md mx-auto">
            <Card>
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    {activated
                        ? t('activateProfile.activatedTitle')
                        : t('activateProfile.title')}
                </h2>

                {loading ? (
                    <p className="text-center text-gray-300">
                        {t('activateProfile.processing')}
                    </p>
                ) : (
                    <Button onClick={() => navigate('/login')}>
                        {t('activateProfile.login_cta')}
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default ActivateProfile;

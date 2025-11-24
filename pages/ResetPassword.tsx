import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useForm } from '../hooks/useForm';
import { required, minLength, passwordsMatch } from '../utils/validators';
import { ResetPasswordFormData } from '../types';
import { changePasswordAPI } from '@/services/api/auth';

const ResetPassword = () => {
    const { t, addToast } = useAppContext();
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    const { formData, errors, handleInputChange, handleSubmit } = useForm<ResetPasswordFormData>(
        { password: '', confirmPassword: '' },
        {
            password: [required(t, t('resetPassword.new_password')), minLength(t, 6)],
            confirmPassword: [
                required(t, t('resetPassword.confirm_password')),
                passwordsMatch(t, 'password'),
            ],
        },
        async (data: ResetPasswordFormData) => {
            console.log('Password reset for token:', token);
            try {
                // call API to change password (use token and new password)
                await changePasswordAPI(token, data.password);
                addToast(t('resetPassword.success'), 'success');
            } catch (err) {
                console.error('Forgot password failed:', err);
                addToast(t('forgotPassword.failure'), 'error');
            }
            
            navigate('/login');
        }
    );

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <h2 className="text-3xl font-bold text-center text-white mb-6">{t('resetPassword.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="password"
                        name="password"
                        label={t('resetPassword.new_password')}
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                        placeholder="********"
                        required
                    />
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        label={t('resetPassword.confirm_password')}
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                        placeholder="********"
                        required
                    />
                    <Button type="submit">{t('resetPassword.cta')}</Button>
                </form>
            </Card>
        </div>
    );
};

export default ResetPassword;
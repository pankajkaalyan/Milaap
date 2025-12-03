import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useForm } from '../hooks/useForm';
import { required, minLength, passwordsMatch } from '../utils/validators';
import { updatePasswordAPI } from '@/services/api/profile';

interface ChangePasswordFormData {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ChangePassword = () => {
    const { t, addToast, logout } = useAppContext();
    const navigate = useNavigate();

    const { formData, errors, handleInputChange, handleSubmit } =
        useForm<ChangePasswordFormData>(
            {
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            },
            {
                oldPassword: [required(t, t('changePassword.old_password'))],
                newPassword: [
                    required(t, t('changePassword.new_password')),
                    minLength(t, 6),
                ],
                confirmNewPassword: [
                    required(t, t('changePassword.confirm_password')),
                    passwordsMatch(t, 'newPassword'),
                ],
            },
            async (data) => {
                try {
                    await updatePasswordAPI(
                        data.oldPassword,
                        data.newPassword,
                        data.confirmNewPassword,
                    );
                    addToast(t('changePassword.success'), 'success');
                    logout();
                    navigate('/login');
                } catch (err) {
                    addToast(t('changePassword.failure'), 'error');
                }
            }
        );

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    {t('changePassword.title')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <Input
                        id="oldPassword"
                        name="oldPassword"
                        label={t('changePassword.old_password')}
                        type="password"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        error={errors.oldPassword}
                        placeholder="********"
                        required
                    />

                    <Input
                        id="newPassword"
                        name="newPassword"
                        label={t('changePassword.new_password')}
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        error={errors.newPassword}
                        placeholder="********"
                        required
                    />

                    <Input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        label={t('changePassword.confirm_password')}
                        type="password"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        error={errors.confirmNewPassword}
                        placeholder="********"
                        required
                    />

                    <Button type="submit">{t('changePassword.cta')}</Button>
                </form>
            </Card>
        </div>
    );
};

export default ChangePassword;

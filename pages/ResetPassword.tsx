import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useForm } from '../hooks/useForm';
import { required, minLength, passwordsMatch } from '../utils/validators';
import { ResetPasswordFormData } from '../types';

const ResetPassword = () => {
  const { t, addToast } = useAppContext();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { formData, errors, handleInputChange, handleSubmit } = useForm<ResetPasswordFormData>(
    { password: '', confirmPassword: '' },
    {
      password: [required(t, t('reset_password.new_password')), minLength(t, 6)],
      confirmPassword: [
        required(t, t('reset_password.confirm_password')),
        passwordsMatch(t, 'password'),
      ],
    },
    () => {
      console.log('Password reset for token:', token);
      addToast(t('reset_password.success'), 'success');
      navigate('/login');
    }
  );

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h2 className="text-3xl font-bold text-center text-white mb-6">{t('reset_password.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="password"
            name="password"
            label={t('reset_password.new_password')}
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="********"
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            label={t('reset_password.confirm_password')}
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            placeholder="********"
          />
          <Button type="submit">{t('reset_password.cta')}</Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
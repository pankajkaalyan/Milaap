import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useForm } from '../hooks/useForm';
import { required, email } from '../utils/validators';
import { ForgotPasswordFormData } from '../types';

const ForgotPassword = () => {
  const { t, addToast } = useAppContext();
  const navigate = useNavigate();

  const { formData, errors, handleInputChange, handleSubmit } = useForm<ForgotPasswordFormData>(
    { email: '' },
    { email: [required(t, t('login.email')), email(t)] },
    (data) => {
      // In a real app, you would make an API call here.
      console.log('Password reset requested for:', data.email);
      addToast(t('forgot_password.success'), 'success');
      navigate('/login');
    }
  );

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h2 className="text-3xl font-bold text-center text-white mb-2">{t('forgot_password.title')}</h2>
        <p className="text-gray-400 text-center mb-6">{t('forgot_password.subtitle')}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            name="email"
            label={t('login.email')}
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="e.g., user@example.com"
          />
          <Button type="submit">{t('forgot_password.cta')}</Button>
        </form>
         <p className="mt-6 text-center text-sm text-gray-400">
            Remember your password? <Link to="/login" className="font-medium text-amber-400 hover:text-amber-300 cursor-pointer">{t('nav.login')}</Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;
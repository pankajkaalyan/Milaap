import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole, LoginFormData, ButtonVariant, SpinnerSize, AppEventStatus } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import GoogleIcon from '../components/icons/GoogleIcon';
import FacebookIcon from '../components/icons/FacebookIcon';
import { useForm } from '../hooks/useForm';
import { required, email } from '../utils/validators';
import SEO from '../components/ui/SEO';
import Spinner from '../components/ui/Spinner';
import { loginAPI } from '@/services/api/auth';
import { eventBus } from '@/utils/eventBus';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, addToast, t, trackEvent } = useAppContext();
  const [isSocialLoginLoading, setIsSocialLoginLoading] = useState<null | 'google' | 'facebook'>(null);

  const { formData, errors, handleInputChange, handleSubmit } = useForm<LoginFormData>(
    { email: '', password: '' },
    {
      email: [required(t, t('login.email')), email(t)],
      password: required(t, t('login.password')),
    },
    (data) => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("user");
      localStorage.removeItem("expiresIn");
      const isAdminLogin = data.email === 'admin@example.com' || data.email === 'moderator@example.com';
      const role = isAdminLogin ? UserRole.ADMIN : UserRole.CUSTOMER;
      const credentials = { username: data.email, password: data.password };
      loginAPI(credentials)
        .then(async (res) => {
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("refreshToken", res.refreshToken);
          localStorage.setItem("expiresIn", JSON.stringify(res.expiresIn));
          localStorage.setItem("loginTime", Date.now().toString());
          login(credentials.username, role, undefined, res.accessToken);
          trackEvent('login_success', { email: data.email, role });
          addToast('Login successful!', 'success');
          // const result = await refreshTokenAPI();
          // console.log('Token refreshed after login:', result);
          // localStorage.setItem("token", result.accessToken);
          // localStorage.setItem("refreshToken", result.refreshToken);
          // localStorage.setItem("expiresIn", String(result.expiresIn));
          // localStorage.setItem("loginTime", Date.now().toString());
        })
        .catch((err) => {
          console.error('Login failed:', err);
          addToast('Login failed. Please check your credentials and try again.', 'error');
        });
    }
  );

  const loggedInHandler = () => {
    navigate('/dashboard');
  }
  useEffect(() => {
    // localStorage.removeItem("token");
    eventBus.on(AppEventStatus.LOGIN_SUCCESS, loggedInHandler);
    return () => {
      eventBus.off(AppEventStatus.LOGIN_SUCCESS, loggedInHandler);
    };

  }, []);
  const handleGoogleLogin = () => {
    setIsSocialLoginLoading('google');
    addToast('Redirecting to Google...', 'info');
    setTimeout(() => {
      const mockEmail = 'google.user@example.com';
      login(mockEmail, UserRole.CUSTOMER);
      trackEvent('social_login_success', { provider: 'google', email: mockEmail });
      addToast('Signed in with Google successfully!', 'success');
      setIsSocialLoginLoading(null);
      navigate('/dashboard');
    }, 1500);
  };

  const handleFacebookLogin = () => {
    setIsSocialLoginLoading('facebook');
    addToast('Redirecting to Facebook...', 'info');
    setTimeout(() => {
      const mockEmail = 'facebook.user@example.com';
      login(mockEmail, UserRole.CUSTOMER);
      trackEvent('social_login_success', { provider: 'facebook', email: mockEmail });
      addToast('Signed in with Facebook successfully!', 'success');
      setIsSocialLoginLoading(null);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <>
      <SEO
        title={`${t('nav.login')} | Milaap`}
        description="Login to your Milaap account to connect with potential partners and continue your search for a life partner."
      />
      <div className="max-w-md mx-auto">
        <Card className="animate-fade-in-scale">
          <h2 className="text-3xl font-bold text-center text-white mb-6">{t('login.title')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <Input
                id="password"
                name="password"
                label={t('login.password')}
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="********"
              />
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-sm font-medium text-amber-400 hover:text-amber-300 cursor-pointer">
                  {t('login.forgot_password')}
                </Link>
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={isSocialLoginLoading !== null}>{t('login.cta')}</Button>
            </div>
          </form>
          <p className="text-xs text-center text-gray-500 mt-4">
            Admin users: admin@example.com, moderator@example.com
          </p>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">{t('login.social_intro')}</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <div className="space-y-3">
            <Button
              variant={ButtonVariant.TERTIARY}
              className="flex items-center justify-center"
              onClick={handleGoogleLogin}
              disabled={isSocialLoginLoading !== null}
            >
              {isSocialLoginLoading === 'google' ? (
                <Spinner size={SpinnerSize.SM} />
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5 mr-2" /> Sign in with Google
                </>
              )}
            </Button>
            <Button
              variant={ButtonVariant.TERTIARY}
              className="flex items-center justify-center"
              onClick={handleFacebookLogin}
              disabled={isSocialLoginLoading !== null}
            >
              {isSocialLoginLoading === 'facebook' ? (
                <Spinner size={SpinnerSize.SM} />
              ) : (
                <>
                  <FacebookIcon className="w-5 h-5 mr-2" /> Sign in with Facebook
                </>
              )}
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            {t('login.no_account')} <Link to="/register" className="font-medium text-amber-400 hover:text-amber-300 cursor-pointer">{t('nav.register')}</Link>
          </p>
        </Card>
      </div>
    </>
  );
};

export default Login;
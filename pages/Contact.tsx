import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useForm } from '../hooks/useForm';
import { required, email, alphaOnly } from '../utils/validators';
import { ContactFormData } from '../types';
import { contactAPI } from '@/services/api/contact';

const Contact: React.FC = () => {
  const { t, addToast } = useAppContext();

  const { formData, errors, handleInputChange, handleSubmit, setFormData } = useForm<ContactFormData>(
    { name: '', email: '', message: '' },
    {
      name: [required(t, t('contact.name')), alphaOnly(t, t('contact.name'))],
      email: [required(t, t('contact.email')), email(t)],
      message: required(t, t('contact.message')),
    },
    (data) => {
      console.log('Contact form submitted:', data);
      const requestBody = { fullName: data.name, email: data.email, message: data.message };
      contactAPI(requestBody).then(() => {
        // Optionally handle success response
        console.log('Contact form successfully submitted');
        addToast(t('contact.success'), 'success');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      }).catch((error) => {
        addToast(t('contact.error'), 'error');
      });
    }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="text-4xl font-bold text-white mb-2 text-center">{t('contact.title')}</h1>
        <p className="text-gray-300 text-center mb-8">{t('contact.subtitle')}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="name"
            name="name"
            label={t('contact.name')}
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="e.g., Krishna Patel"
          />
          <Input
            id="email"
            name="email"
            label={t('contact.email')}
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="e.g., user@example.com"
          />
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              {t('contact.message')}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.message
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-600 focus:ring-amber-500'
              }`}
              placeholder="Your message here..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>
          <Button type="submit">{t('contact.cta')}</Button>
        </form>
      </Card>
    </div>
  );
};

export default Contact;
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useForm } from '../hooks/useForm';
import { required, email, alphaOnly } from '../utils/validators';
import { ContactFormData } from '../types';
import { contactAPI } from '@/services/api/contact';
import FormLabel from '@/components/ui/FormLabel';
import SEO from '../components/ui/SEO';
import PageHeader from '../components/ui/PageHeader';

const Contact: React.FC = () => {
  const { t, addToast } = useAppContext();

  const { formData, errors, handleInputChange, handleSubmit, setFormData } =
    useForm<ContactFormData>(
      { name: '', email: '', message: '' },
      {
        name: [required(t, t('contact.name')), alphaOnly(t, t('contact.name'))],
        email: [required(t, t('contact.email')), email(t)],
        message: required(t, t('contact.message')),
      },
      (data) => {
        const requestBody = {
          fullName: data.name,
          email: data.email,
          message: data.message,
        };

        contactAPI(requestBody)
          .then(() => {
            addToast(t('contact.success'), 'success');
            setFormData({ name: '', email: '', message: '' });
          })
          .catch(() => {
            addToast(t('contact.error'), 'error');
          });
      }
    );

  return (
    <>
      <SEO
        title={`${t('nav.contact')} | ANZ Hindu Matrimony`}
        description={t('contact.subtitle')}
      />

      {/* ================= HERO ================= */}
      <section className="pb-24 text-center">
        <PageHeader
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="px-4 mb-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-black/30 p-8 shadow-2xl shadow-amber-500/10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Let’s Connect
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Have questions about registration, profile verification, or
                subscriptions? Our team is here to guide you every step of the way.
              </p>

              <ul className="space-y-3 text-sm text-gray-300">
                <li>✔ Trusted & secure platform</li>
                <li>✔ Dedicated support team</li>
                <li>✔ Your privacy is always respected</li>
              </ul>
            </div>

            {/* RIGHT FORM */}
            <Card className="rounded-3xl bg-black/40 backdrop-blur-md shadow-xl p-6 md:p-8">
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
                  required
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
                  required
                />

                <div>
                  <label
                    htmlFor="message"
                    className="flex items-center gap-1 text-sm font-medium text-gray-300 mb-1"
                  >
                    <span>{t('contact.message')}</span>
                    <FormLabel id="" label="" required />
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl bg-white/10 px-4 py-3 text-white border transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.message
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:ring-amber-500'
                    }`}
                    placeholder="Write your message here..."
                  />

                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  {t('contact.cta')}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

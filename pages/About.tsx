import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import { useAppContext } from '../hooks/useAppContext';
import SEO from '../components/ui/SEO';

/* ================= SHARED IMAGE BOX ================= */
const ImageBox: React.FC<{ src: string; alt: string; height?: string }> = ({
  src,
  alt,
  height = 'h-72',
}) => (
  <div
    className={`relative ${height} w-full overflow-hidden rounded-3xl 
    shadow-xl shadow-black/40
    transition-all duration-500
    hover:-translate-y-2 hover:shadow-2xl`}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
  </div>
);

const About: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();

  const aboutDescription =
    'ANZ Hindu Matrimony is a trusted matrimonial platform for Hindu communities across Australia and New Zealand, blending tradition with modern technology.';

  return (
    <>
      <SEO
        title={`${t('nav.about')} | ANZ Hindu Matrimony`}
        description={aboutDescription}
      />

      {/* ================= HERO ================= */}
      <section className="pb-24 text-center">
        <PageHeader
          title="About ANZ Hindu Matrimony"
          subtitle="A trusted platform connecting hearts, families, and traditions across Australia & New Zealand"
        />
      </section>

      {/* ================= ABOUT INTRO ================= */}
      <section className="px-4">
        <div className="mx-auto max-w-6xl rounded-3xl bg-black/30 p-8 shadow-2xl shadow-amber-500/10 md:p-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Who We Are
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                ANZ Hindu Matrimony is a dedicated matrimonial platform designed
                exclusively for the Hindu community in Australia and New
                Zealand. We understand the importance of culture, family values,
                and tradition when it comes to choosing a life partner.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our goal is to simplify the journey of marriage by combining
                age-old traditions with secure, modern technology — ensuring a
                meaningful and trustworthy matchmaking experience.
              </p>
            </div>

            <ImageBox
              src="./images/home-hero-section.avif"
              alt="Hindu Couple"
            />
          </div>
        </div>
      </section>

      {/* ================= MISSION & VALUES ================= */}
      <section className="px-4 mt-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-black/20 p-8 shadow-2xl shadow-amber-500/10 md:p-14">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Our Mission & Values
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Built on trust, respect, and cultural understanding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="rounded-3xl bg-black/40 backdrop-blur-md p-6 text-center hover:-translate-y-2 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">
                Authentic Profiles
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every profile goes through a verification process to ensure
                genuine, serious members only.
              </p>
            </Card>

            <Card className="rounded-3xl bg-black/40 backdrop-blur-md p-6 text-center hover:-translate-y-2 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">
                Privacy First
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your data is secure and fully controlled by you. Decide who can
                view and contact your profile.
              </p>
            </Card>

            <Card className="rounded-3xl bg-black/40 backdrop-blur-md p-6 text-center hover:-translate-y-2 transition-all">
              <h3 className="text-xl font-semibold text-white mb-3">
                Tradition + Technology
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Horoscope matching and smart filters help you find compatible
                matches faster and easier.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= WHY ANZ ================= */}
      <section className="px-4 mt-24 mb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-black/30 p-8 shadow-2xl shadow-amber-500/10 md:p-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Why Choose ANZ Hindu Matrimony
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Because finding a life partner deserves trust, care, and cultural
              understanding
            </p>
          </div>

          <div className="space-y-6 text-gray-300 leading-relaxed max-w-4xl mx-auto text-center">
            <p>
              We are more than just a matrimonial website. We are a community-driven
              platform that respects traditions while embracing modern lifestyles.
            </p>
            <p>
              Whether you are looking for a partner within Australia or New
              Zealand, ANZ Hindu Matrimony bridges distances and families with
              trust and transparency.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Button
              onClick={() => navigate('/register')}
              className="mx-auto max-w-xs"
            >
              Register Free
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

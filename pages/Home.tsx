import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import CheckIcon from '../components/icons/CheckIcon';
import BoltIcon from '../components/icons/BoltIcon';
import LockIcon from '../components/icons/LockIcon';
import SEO from '../components/ui/SEO';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

interface CoupleCardProps {
  image: string;
  name: string;
}

/* ================= SHARED IMAGE BOX ================= */
const ImageBox: React.FC<{ src: string; alt: string; height?: string }> = ({
  src,
  alt,
  height = 'h-56',
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
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
  </div>
);

const Home: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  /* ================= FEATURE CARD ================= */
  const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    image,
  }) => (
    <Card className="rounded-3xl overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <ImageBox src={image} alt={title} height="h-40" />

      <div className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );

  /* ================= COUPLE CARD ================= */
  const CoupleCard: React.FC<CoupleCardProps> = ({ image, name }) => (
    <div className="rounded-3xl bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <ImageBox src={image} alt={name} />
      <div className="p-4 text-center">
        <p className="text-lg font-semibold text-white">{name}</p>
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title={`${t('nav.home')} | ANZ Hindu Matrimony`}
        description={t('home.subtitle')}
      />

      {/* ================= HERO ================= */}
      <section className="text-center pb-24">
        <PageHeader title={t('home.title')} subtitle={t('home.subtitle')} />

        <div className="animate-fade-in-up mt-6">
          <Button
            onClick={() => navigate('/register')}
            className="mx-auto max-w-xs"
          >
            {t('home.cta')}
          </Button>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="px-4">
        <div className="mx-auto max-w-6xl rounded-3xl bg-black/30 p-8 shadow-2xl shadow-amber-500/10 md:p-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                About ANZ Hindu Matrimony
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                ANZ Hindu Matrimony is a trusted platform helping Hindu singles
                across Australia and New Zealand find their life partner.
              </p>
              <p className="mb-6 text-gray-300 leading-relaxed">
                We combine tradition with modern technology — verified profiles,
                horoscope matching, and complete privacy.
              </p>

              <Button onClick={() => navigate('/register')} className="max-w-xs">
                Register Free
              </Button>
            </div>

            <ImageBox
              src="./images/home-hero-section.avif"
              alt="Happy Hindu Couple"
              height="h-80"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-4 mt-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-black/20 p-8 shadow-2xl shadow-amber-500/10 md:p-14">
          
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Why Choose ANZ Hindu Matrimony
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Built on trust, tradition, and technology to help you find the
              right life partner with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              title={t('home.features.verified.title')}
              description={t('home.features.verified.desc')}
              icon={<CheckIcon className="h-7 w-7 text-white" />}
              image="./images/home-verified.avif"
            />
            <FeatureCard
              title={t('home.features.horoscope.title')}
              description={t('home.features.horoscope.desc')}
              icon={<BoltIcon className="h-7 w-7 text-white" />}
              image="./images/home-hs.png"
            />
            <FeatureCard
              title={t('home.features.secure.title')}
              description={t('home.features.secure.desc')}
              icon={<LockIcon className="h-7 w-7 text-white" />}
              image="./images/home-ps.avif"
            />
          </div>
        </div>
      </section>

      {/* ================= HAPPY COUPLES ================= */}
      <section className="px-4 mt-24 mb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-black/30 p-8 shadow-2xl shadow-amber-500/10 md:p-14">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Happy Matches</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Real stories of successful marriages from our community
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <CoupleCard
              image="./images/home-hm-1.png"
              name="Amit & Kavya"
            />
            <CoupleCard
              image="./images/home-hm-2.png"
              name="Rahul & Sneha"
            />
            <CoupleCard
              image="./images/home-hm-3.png"
              name="Arjun & Meera"
            />
            <CoupleCard
              image="./images/home-hm-4.png"
              name="Rohit & Ananya"
            />
            <CoupleCard
              image="./images/home-hm-5.png"
              name="Suresh & Priya"
            />
            <CoupleCard
              image="./images/home-hm-6.png"
              name="Vikram & Nisha"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

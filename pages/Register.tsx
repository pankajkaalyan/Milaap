import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole, UserProfile, RegisterFormData, ButtonVariant } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Stepper from '../components/ui/Stepper';
import { useForm } from '../hooks/useForm';
import { required, email, minLength, isNumber, dateNotInFuture, alphaOnly } from '../utils/validators';
import Step1Account from '../components/auth/register/Step1Account';
import Step2Personal from '../components/auth/register/Step2Personal';
import Step3Caste from '../components/auth/register/Step3Cast';
import Step4Family from '../components/auth/register/Step4Family';
import Step5Uploads from '../components/auth/register/Step5Uploads';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import SEO from '../components/ui/SEO';
import { registerAPI } from '@/services/api/register';

const Register: React.FC = () => {
    const { login, addToast, t, trackEvent } = useAppContext();
    const navigate = useNavigate();

    const steps = [
        t('register.steps.account'),
        t('register.steps.personal'),
        t('register.steps.cast'),
        t('register.steps.family'),
        t('register.steps.uploads')
    ];

    const { currentStep, next, back, isFirstStep, isLastStep } = useMultiStepForm(steps.length);

    const { formData, errors, handleInputChange, setFieldValue, validate } = useForm<RegisterFormData>(
        {
            name: '', email: '', password: '', dateOfBirth: '', timeOfBirth: '', gender: '', mobileNumber: null,
            height: '', profession: '', education: '', caste: '', subCaste: '', rashi: '', nakshatra: '',
            gotra: '', mangalDosha: 'No', fatherName: '', motherName: '',
            siblings: '', familyValues: 'Moderate', photos: [] as File[], video: null,
        },
        {
            name: [required(t, t('register.name')), alphaOnly(t, t('register.name'))],
            email: [required(t, t('login.email')), email(t)],
            password: [required(t, t('login.password')), minLength(t, 6)],
            dateOfBirth: [required(t, t('register.dob')), dateNotInFuture(t, t('register.dob'))],
            gender: [required(t, t('profile.gender'))],
            mobileNumber: [required(t, t('register.height')), isNumber(t, t('register.height'))],
            timeOfBirth: required(t, t('register.tob')),
            height: [required(t, t('register.height')), isNumber(t, t('register.height'))],
            caste: [required(t, t('register.caste')), alphaOnly(t, t('register.caste'))],
            fatherName: alphaOnly(t, t('profile.details.father_name')),
            motherName: alphaOnly(t, t('profile.details.mother_name')),
            gotra: [required(t, t('profile.details.gotra')), alphaOnly(t, t('profile.details.gotra'))],
        }
    );

    const handleDropdownChange = (id: keyof RegisterFormData, value: string) => {
        setFieldValue(id, value);
    };

    const handleFileChange = (id: keyof RegisterFormData, files: File[]) => {
        setFieldValue(id, files);
    };

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const fieldsPerStep: (keyof RegisterFormData)[][] = [
            ['name', 'email', 'password'],
            ['dateOfBirth', 'timeOfBirth', 'gender', 'height', 'profession', 'education', 'mobileNumber'],
            ['caste', 'subCaste', 'gotra', 'mangalDosha', 'rashi', 'nakshatra'],
            ['fatherName', 'motherName', 'siblings', 'familyValues'],
            ["photos", "video"] // No validation needed for uploads on "Next"
        ];
        if (validate(fieldsPerStep[currentStep])) {
            if (!isLastStep) {
                next();
            }
        } else {
            addToast(t('toasts.form_errors'), 'error');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        if (!isLastStep) return;
        e.preventDefault();
        const allFields = Object.keys(formData) as (keyof RegisterFormData)[];
        if (validate(allFields)) {
            const userProfile: UserProfile = {
                fullName: formData.name,
                email: formData.email,
                password: formData.password,
                dob: formData.dateOfBirth,
                timeOfBirth: formData.timeOfBirth,
                gender: formData.gender,
                contactNumber: formData.mobileNumber ? Number(formData.mobileNumber) : null,
                heightInCm: formData.height ? Number(formData.height) : 0,
                profession: formData.profession,
                highestEducation: formData.education,
                // Convert File objects to base64 strings or URLs as needed
                caste: formData.caste,
                subCaste: formData.subCaste,
                horoscope: {
                    gotra: formData.gotra,
                    mangalDosha: formData.mangalDosha,
                    rashi: formData.rashi,
                    nakshatra: formData.nakshatra,
                },
                familyDetails: {
                    fatherName: formData.fatherName,
                    motherName: formData.motherName,
                    siblings: formData.siblings,
                    familyValues: formData.familyValues,
                },
                photos: formData.photos.length > 0 ? formData.photos.map(file => URL.createObjectURL(file)) : [],
                video: (formData.video ? formData.video : null) as any,
                audio: '',
                about: '',
                joiningDate: new Date().toISOString().split('T')[0],
                isVerified: false,
                chatSuspended: false,
            };

            registerAPI(userProfile).then(() => {
                console.log('User registered successfully');
                login(formData.email, UserRole.CUSTOMER, userProfile);
                trackEvent('registration_success', { email: formData.email });
                addToast('Registration successful! Welcome!', 'success');
                navigate('/dashboard');
            }).catch((error) => {
                console.error('Registration failed:', error);
                addToast('Registration failed. Please try again.', 'error');
            });


        } else {
            addToast(t('toasts.form_errors'), 'error');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <Step1Account formData={formData} errors={errors} handleInputChange={handleInputChange} t={t} />;
            case 1:
                return <Step2Personal formData={formData} errors={errors} handleInputChange={handleInputChange} handleDropdownChange={handleDropdownChange} t={t} />;
            case 2:
                return <Step3Caste formData={formData} errors={errors} handleInputChange={handleInputChange} handleDropdownChange={handleDropdownChange} t={t} />;
            case 3:
                return <Step4Family formData={formData} errors={errors} handleInputChange={handleInputChange} handleDropdownChange={handleDropdownChange} t={t} />;
            case 4:
                return <Step5Uploads formData={formData} errors={errors} handleFileChange={handleFileChange} t={t} />;
            default: return null;
        }
    }

    return (
        <>
            <SEO
                title={`${t('nav.register')} | Milaap`}
                description="Create your profile on Milaap for free. Join the most trusted Hindu matrimony service and start your search for a perfect life partner."
            />
            <div className="max-w-2xl mx-auto">
                <Card className="animate-fade-in-scale">
                    <h2 className="text-3xl font-bold text-center text-white mb-6">{t('register.title')}</h2>
                    <div className="mb-12 mt-8">
                        <Stepper steps={steps} currentStep={currentStep} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        {renderStepContent()}
                        <div className="flex justify-between items-center pt-8">
                            {!isFirstStep && (
                                <Button type="button" onClick={back} variant={ButtonVariant.SECONDARY} className="w-auto mr-8">
                                    {t('register.prev')}
                                </Button>
                            )}
                            {/* <div className="flex-grow" /> */}
                            {!isLastStep ? (
                                <Button type="button" onClick={handleNext} className="w-auto">
                                    {t('register.next')}
                                </Button>
                            ) : (
                                <Button type="submit" className="w-auto">
                                    {t('register.finish')}
                                </Button>
                            )}
                        </div>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-400">
                        {t('register.have_account')} <Link to="/login" className="font-medium text-amber-400 hover:text-amber-300 cursor-pointer">{t('nav.login')}</Link>
                    </p>
                </Card>
            </div>
        </>
    );
};

export default Register;

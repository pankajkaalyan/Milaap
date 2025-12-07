import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { UserProfile, EditProfileFormData, FamilyDetails, HoroscopeDetails, PartnerPreferences, ButtonVariant, ModalSize, User, UserRole } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import AIProfileAssistantModal from './AIProfileAssistantModal';
import FileUpload from '../ui/FileUpload';
import Dropdown from '../ui/Dropdown';
import { useForm } from '../../hooks/useForm';
import Modal from '../ui/Modal';
import UserPlusIcon from '../icons/UserPlusIcon';
import { fetchCurrentUserAPI, updateProfileAPI } from '@/services/api/profile';
import { findIntrest } from '@/transform/transformMutualUser';

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-1 2.053a1 1 0 01-.633.633l-2.053 1a1 1 0 000 1.788l2.053 1a1 1 0 01.633.633l1 2.053a1 1 0 001.788 0l1-2.053a1 1 0 01.633-.633l2.053-1a1 1 0 000-1.788l-2.053-1a1 1 0 01-.633-.633l-1-2.053zM15 8a1 1 0 100-2 1 1 0 000 2zM5 8a1 1 0 100-2 1 1 0 000 2zM8 15a1 1 0 100-2 1 1 0 000 2zM12 15a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserProfile, t, addToast } = useAppContext();
    const [photos, setPhotos] = useState<File[] | null>(null);
    const { formData, setFormData, setFieldValue, handleSubmit } = useForm<EditProfileFormData>(
        { photos: [] as string[] },
        {},
        (data) => {
            const finalProfileData: Partial<UserProfile> = {
                about: data.about,
                horoscope: {
                    gotra: data.horoscope?.gotra,
                    mangalDosha: data.horoscope?.mangalDosha,
                    rashi: data.horoscope?.rashi,
                    nakshatra: data.horoscope?.nakshatra,
                },
                familyDetails: {
                    fatherName: data.familyDetails?.fatherName,
                    motherName: data.familyDetails?.motherName,
                    siblings: data.familyDetails?.siblings,
                    familyValues: data.familyDetails?.familyValues,
                },
                partnerPreferences: {
                    ageRange: data.partnerPreferences?.ageRange,
                    heightRange: data.partnerPreferences?.heightRange,
                    mangalDosha: data.partnerPreferences?.mangalDosha,
                    castes: data.partnerPreferences?.castes ? data.partnerPreferences.castes.split(',').map(c => c.trim()) : [],
                    professions: data.partnerPreferences?.professions ? data.partnerPreferences.professions.split(',').map(p => p.trim()) : [],
                },
            };
            // console.log('Submitting profile update with data:', finalProfileData);
            updateProfileAPI(finalProfileData, photos, videoFile).then(updatedProfile => {
                // console.log('Profile updated successfully:', updatedProfile);
                addToast(t('profile.update_success'), 'success');
                onClose();
                updateUserProfile(updatedProfile);
            }).catch(error => {
                addToast(t('profile.update_error'), 'error');
            });
        }
    );

    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [videoFile, setVideoFile] = useState<File[]>([]);
    const photoUploadRef = useRef<HTMLInputElement>(null);

    // Drag and Drop state for photos
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        if (user?.profile) {
            // console.log('Initializing edit profile form with user data:', user);
            const { partnerPreferences, ...restOfProfile } = user.profile;
            const initialFormState: EditProfileFormData = {
                ...restOfProfile,
                photos: user.profile.photos || [],
                partnerPreferences: {
                    ...partnerPreferences,
                    castes: partnerPreferences?.castes?.join(', ') || '',
                    professions: partnerPreferences?.professions?.join(', ') || '',
                }
            };
            setFormData(initialFormState);
        }
    }, [user, setFormData]);

    const handleFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFieldValue('familyDetails', {
            ...formData.familyDetails,
            [name]: value,
        } as FamilyDetails);
    };

    const handleHoroscopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFieldValue('horoscope', {
            ...formData.horoscope,
            [name]: value,
        } as HoroscopeDetails);
    };

    const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFieldValue('partnerPreferences', {
            ...formData.partnerPreferences,
            [name]: value,
        } as EditProfileFormData['partnerPreferences']);
    };

    const handlePreferencesRangeChange = (e: React.ChangeEvent<HTMLInputElement>, rangeType: 'ageRange' | 'heightRange') => {
        const { name, value } = e.target;
        setFieldValue('partnerPreferences', {
            ...formData.partnerPreferences,
            [rangeType]: {
                ...(formData.partnerPreferences?.[rangeType] || {}),
                [name]: value ? parseInt(value) : undefined,
            }
        } as EditProfileFormData['partnerPreferences']);
    };

    const handleAITextGenerated = (text: string) => {
        setFieldValue('about', text);
        setIsAIAssistantOpen(false);
    }

    const handlePhotoDelete = (indexToDelete: number) => {
        const updatedPhotos = formData.photos?.filter((_, index) => index !== indexToDelete);
        setFieldValue('photos', updatedPhotos);
    };

    const handlePhotoAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            // In a real app, you'd upload the file and get a URL.
            // Here, we simulate it with a placeholder.
            const file = event.target.files[0];
            // console.log('Selected file for upload:', file);
            if (file) {
                setPhotos(prev => prev ? [...prev, file] : [file]);
                // Generate a preview URL
                const previewUrl = URL.createObjectURL(file);
                // console.log('Generated preview URL:', previewUrl);
                // const newPhotoUrl = `https://picsum.photos/seed/${Date.now()}/400/400`;
                const currentPhotos = formData.photos || [];
                // console.log('Updated photos list:', currentPhotos);
                if (currentPhotos.length < 5) {
                    setFieldValue('photos', [...currentPhotos, previewUrl]);
                } else {
                    addToast('You can upload a maximum of 5 photos.', 'error');
                }
            }
            // console.log('Updated photos list:', formData.photos);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = () => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            dragItem.current = null;
            dragOverItem.current = null;
            return;
        }

        const newPhotos = [...(formData.photos || [])];
        const draggedItemContent = newPhotos.splice(dragItem.current, 1)[0];
        newPhotos.splice(dragOverItem.current, 0, draggedItemContent);

        dragItem.current = null;
        dragOverItem.current = null;

        setFieldValue('photos', newPhotos);
    };

    const footer = (
        <>
            <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto">Cancel</Button>
            <Button onClick={handleSubmit} type="submit" className="w-auto">Save Changes</Button>
        </>
    );

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={t('profile.edit')} footer={footer} size={ModalSize.XXXL}>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="about" className="block text-sm font-medium text-gray-300">{t('profile.about')}</label>
                            <button type="button" onClick={() => setIsAIAssistantOpen(true)} className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-semibold">
                                <SparkleIcon />
                                <span>{t('aiAssistant.button')}</span>
                            </button>
                        </div>
                        <textarea id="about" name="about" value={formData.about || ''} onChange={(e) => setFieldValue('about', e.target.value)} rows={4} className="w-full px-4 py-2 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 border-gray-600 focus:ring-amber-500" />
                    </div>

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Manage Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {formData.photos?.map((photo, index) => (
                            <div
                                key={photo + index}
                                className="relative group aspect-square cursor-grab"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <img src={photo} alt={`User photo ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-amber-500 transition-all" />
                                <button
                                    type="button"
                                    onClick={() => handlePhotoDelete(index)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full h-6 w-6 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove image"
                                >
                                    &times;
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Primary</div>
                                )}
                            </div>
                        ))}
                        {(formData.photos?.length || 0) < 5 && (
                            <div
                                className="flex items-center justify-center w-full h-full aspect-square bg-white/5 border-2 border-dashed border-gray-600 rounded-lg hover:border-amber-500 hover:bg-white/10 transition-colors cursor-pointer"
                                onClick={() => photoUploadRef.current?.click()}
                            >
                                <div className="text-center text-gray-400">
                                    <UserPlusIcon className="w-8 h-8 mx-auto" />
                                    <span className="text-sm mt-1">Add Photo</span>
                                </div>
                            </div>
                        )}
                        <input type="file" ref={photoUploadRef} onChange={handlePhotoAdd} accept="image/*" className="hidden" />
                    </div>

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">{t('register.uploads.video.title')}</h3>
                    <FileUpload
                        id="video-upload"
                        label=""
                        description={t('register.uploads.video.desc')}
                        onFilesChange={(files) => {
                            setVideoFile(files);
                            if (files.length > 0) {
                                const videoUrl = URL.createObjectURL(files[0]);
                                setFieldValue('video', videoUrl);
                            } else {
                                if (user?.profile?.video && videoFile.length > 0) {
                                    setFieldValue('video', undefined);
                                }
                            }
                        }}
                        accept="video/*"
                    />
                    {videoFile.length === 0 && formData.video && (
                        <div className="mt-2 text-sm text-gray-400">
                            <p>A video intro is currently set. Upload a new one to replace it.</p>
                            <button type="button" onClick={() => setFieldValue('video', undefined)} className="text-red-400 hover:underline mt-1">
                                Remove current video
                            </button>
                        </div>
                    )}

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">{t('profile.family_details')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('profile.details.father_name')} name="fatherName" value={formData.familyDetails?.fatherName || ''} onChange={handleFamilyChange} />
                        <Input label={t('profile.details.mother_name')} name="motherName" value={formData.familyDetails?.motherName || ''} onChange={handleFamilyChange} />
                        <Input label={t('profile.details.siblings')} name="siblings" value={formData.familyDetails?.siblings || ''} onChange={handleFamilyChange} />
                        <div>
                            <Dropdown
                                id="familyValues"
                                label={t('profile.details.family_values')}
                                value={formData.familyDetails?.familyValues || 'Moderate'}
                                onChange={(value) => setFieldValue('familyDetails', { ...formData.familyDetails, familyValues: value as FamilyDetails['familyValues'] })}
                                options={[{ value: 'Moderate', label: 'Moderate' }, { value: 'Traditional', label: 'Traditional' }, { value: 'Liberal', label: 'Liberal' }]}
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">{t('profile.horoscope_details')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('profile.details.rashi')} name="rashi" value={formData.horoscope?.rashi || ''} onChange={handleHoroscopeChange} />
                        <Input label={t('profile.details.nakshatra')} name="nakshatra" value={formData.horoscope?.nakshatra || ''} onChange={handleHoroscopeChange} />
                        <Input label={t('profile.details.gotra')} name="gotra" value={formData.horoscope?.gotra || ''} onChange={handleHoroscopeChange} />
                        <div>
                            <Dropdown
                                id="mangalDosha"
                                label={t('profile.details.mangal_dosha')}
                                value={formData.horoscope?.mangalDosha || 'No'}
                                onChange={(value) => setFieldValue('horoscope', { ...formData.horoscope, mangalDosha: value as HoroscopeDetails['mangalDosha'] })}
                                options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }, { value: 'Partial', label: 'Partial' }]}
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">{t('profile.partner_preferences')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('preferences.age_range')}</label>
                            <div className="flex gap-2">
                                <Input label="" name="min" type="number" placeholder="Min" value={formData.partnerPreferences?.ageRange?.min || ''} onChange={(e) => handlePreferencesRangeChange(e, 'ageRange')} />
                                <Input label="" name="max" type="number" placeholder="Max" value={formData.partnerPreferences?.ageRange?.max || ''} onChange={(e) => handlePreferencesRangeChange(e, 'ageRange')} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('preferences.height_range_cm')}</label>
                            <div className="flex gap-2">
                                <Input label="" name="min" type="number" placeholder="Min" value={formData.partnerPreferences?.heightRange?.min || ''} onChange={(e) => handlePreferencesRangeChange(e, 'heightRange')} />
                                <Input label="" name="max" type="number" placeholder="Max" value={formData.partnerPreferences?.heightRange?.max || ''} onChange={(e) => handlePreferencesRangeChange(e, 'heightRange')} />
                            </div>
                        </div>
                        <Input label={t('preferences.castes')} name="castes" value={formData.partnerPreferences?.castes || ''} onChange={handlePreferencesChange} placeholder="e.g. Brahmin, Kshatriya" />
                        <Input label={t('preferences.professions')} name="professions" value={formData.partnerPreferences?.professions || ''} onChange={handlePreferencesChange} placeholder="e.g. Doctor, Engineer" />
                        <div>
                            <Dropdown
                                id="mangalDoshaPref"
                                label={t('preferences.mangal_dosha')}
                                value={formData.partnerPreferences?.mangalDosha || 'Any'}
                                onChange={(value) => setFieldValue('partnerPreferences', { ...formData.partnerPreferences, mangalDosha: value as PartnerPreferences['mangalDosha'] })}
                                options={[{ value: 'Any', label: 'Any' }, { value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                            />
                        </div>
                    </div>


                </form>
            </Modal>
            {isAIAssistantOpen && (
                <AIProfileAssistantModal
                    isOpen={isAIAssistantOpen}
                    onClose={() => setIsAIAssistantOpen(false)}
                    onTextGenerated={handleAITextGenerated}
                />
            )}
        </>
    );
};

export default EditProfileModal;
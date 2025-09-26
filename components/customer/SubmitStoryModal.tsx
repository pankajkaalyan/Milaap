import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FileUpload from '../ui/FileUpload';
import { useForm } from '../../hooks/useForm';
import { required, alphaOnly, dateNotInFuture, fileRequired } from '../../utils/validators';
import Modal from '../ui/Modal';
import { SubmitStoryFormData, ButtonVariant, ModalSize } from '../../types';

interface SubmitStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitStoryModal: React.FC<SubmitStoryModalProps> = ({ isOpen, onClose }) => {
  const { user, t, submitSuccessStory } = useAppContext();

  const { formData, errors, handleInputChange, setFieldValue, handleSubmit } = useForm<SubmitStoryFormData>(
    {
      partnerName: '',
      weddingDate: '',
      story: '',
      couplePhoto: [] as File[],
    },
    {
      partnerName: [required(t, t('submit_story.partner_name')), alphaOnly(t, t('submit_story.partner_name'))],
      weddingDate: [required(t, t('submit_story.wedding_date')), dateNotInFuture(t, t('submit_story.wedding_date'))],
      story: required(t, t('submit_story.story_label')),
      couplePhoto: fileRequired(t),
    },
    (data) => {
      if (user) {
        submitSuccessStory({
          coupleNames: `${user.name} & ${data.partnerName}`,
          weddingDate: data.weddingDate,
          story: data.story,
          couplePhoto: data.couplePhoto[0],
        });
        onClose();
      }
    }
  );

  const footer = (
     <>
        <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto">Cancel</Button>
        <Button onClick={handleSubmit} type="submit" className="w-auto">{t('submit_story.cta')}</Button>
     </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('submit_story.title')} footer={footer} size={ModalSize.XXL}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input 
                id="yourName"
                name="yourName"
                label={t('submit_story.your_name')}
                type="text"
                value={user?.name || ''}
                disabled
              />
              <Input
                id="partnerName"
                name="partnerName"
                label={t('submit_story.partner_name')}
                type="text"
                value={formData.partnerName}
                onChange={handleInputChange}
                error={errors.partnerName}
              />
          </div>
          <Input
            id="weddingDate"
            name="weddingDate"
            label={t('submit_story.wedding_date')}
            type="date"
            value={formData.weddingDate}
            onChange={handleInputChange}
            error={errors.weddingDate}
            max={new Date().toISOString().split('T')[0]}
          />
          <div>
            <FileUpload
              id="couple-photo"
              label={t('submit_story.couple_photo')}
              description={t('submit_story.photo_desc')}
              onFilesChange={(files) => setFieldValue('couplePhoto', files)}
              accept="image/*"
            />
            {errors.couplePhoto && <p className="mt-1 text-xs text-red-400">{errors.couplePhoto}</p>}
          </div>
          <div>
            <label htmlFor="story" className="block text-sm font-medium text-gray-300 mb-1">
                {t('submit_story.story_label')}
            </label>
            <textarea
                id="story"
                name="story"
                rows={5}
                value={formData.story}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.story ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-amber-500'
                }`}
                placeholder="Share your beautiful journey with us..."
            />
            {errors.story && <p className="mt-1 text-xs text-red-400">{errors.story}</p>}
          </div>
        </form>
    </Modal>
  );
};

export default SubmitStoryModal;
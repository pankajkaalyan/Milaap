import React from 'react';
import FileUpload from '../../ui/FileUpload';
import { RegisterFormData } from '../../../types';

interface Step4Props {
    handleFileChange: (id: keyof RegisterFormData, files: File[]) => void;
    t: (key: string) => string;
}

const Step4Uploads: React.FC<Step4Props> = ({ handleFileChange, t }) => {
    return (
        <div className="space-y-6">
            <FileUpload
                id="photos"
                label={t('register.uploads.photos.title')}
                description={t('register.uploads.photos.desc')}
                onFilesChange={(files) => handleFileChange('photos', files)}
                accept="image/*"
                multiple
                maxFiles={5}
            />
            <FileUpload
                id="video"
                label={t('register.uploads.video.title')}
                description={t('register.uploads.video.desc')}
                onFilesChange={(files) => handleFileChange('video', files)}
                accept="video/*"
            />
        </div>
    );
};

export default Step4Uploads;

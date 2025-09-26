import { UserRole } from './enums';
import { FamilyDetails, HoroscopeDetails, PartnerPreferences } from './models';

// Form & Validation Types
export type ValidatorFunction<T> = (value: T[keyof T], allValues: T) => string | null;
export type ValidationSchema<T> = {
  [K in keyof T]?: ValidatorFunction<T> | ValidatorFunction<T>[];
};
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

// Form Data Interfaces
export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  timeOfBirth: string;
  height: string;
  profession: string;
  education: string;
  caste: string;
  subCaste: string;
  gotra: string;
  mangalDosha: 'Yes' | 'No' | 'Partial';
  fatherName: string;
  motherName: string;
  siblings: string;
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
  photos: File[];
  video: File[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ReportUserFormData {
  reason: string;
  details: string;
}

export interface SubmitStoryFormData {
  partnerName: string;
  weddingDate: string;
  story: string;
  couplePhoto: File[];
}

export interface AddUserFormData {
    name: string;
    email: string;
    role: UserRole;
}

export interface EditUserFormData {
    name: string;
    role: UserRole;
}

export interface EditProfileFormData {
  about?: string;
  video?: string;
  photos?: string[];
  family?: FamilyDetails;
  horoscope?: HoroscopeDetails;
  partnerPreferences?: Omit<PartnerPreferences, 'castes' | 'professions'> & {
    castes?: string;
    professions?: string;
  };
}
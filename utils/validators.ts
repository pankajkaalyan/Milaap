import { ValidatorFunction } from '../types';

type TFunction = (key: string, options?: Record<string, string | number>) => string;

export const required = <T,>(t: TFunction, fieldName: string): ValidatorFunction<T> => (value) => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        return t('validation.field_required', { fieldName });
    }
    return null;
};

export const email = <T,>(t: TFunction): ValidatorFunction<T> => (value) => {
    if (value && !/\S+@\S+\.\S+/.test(value as string)) {
        return t('validation.invalid_email');
    }
    return null;
};

export const minLength = <T,>(t: TFunction, length: number): ValidatorFunction<T> => (value) => {
    if (value && (value as string).length < length) {
        return t('validation.password_min_length', { length });
    }
    return null;
};

export const passwordsMatch = <T,>(t: TFunction, passwordField: keyof T): ValidatorFunction<T> => (value, allValues) => {
    if (value !== allValues[passwordField]) {
        return t('validation.passwords_no_match');
    }
    return null;
};

export const isNumber = <T,>(t: TFunction, fieldName: string): ValidatorFunction<T> => (value) => {
    if (value && isNaN(Number(value))) {
        return t('validation.field_is_number', { fieldName });
    }
    return null;
};

export const dateNotInFuture = <T,>(t: TFunction, fieldName: string): ValidatorFunction<T> => (value) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    if (value && new Date(value as string) > today) {
        return t('validation.date_in_future', { fieldName });
    }
    return null;
};


export const alphaOnly = <T,>(t: TFunction, fieldName: string): ValidatorFunction<T> => (value) => {
    if (value && !/^[a-zA-Z\s]*$/.test(value as string)) {
        return t('validation.alpha_only', { fieldName });
    }
    return null;
};

export const alphaCommaOnly = <T,>(t: TFunction, fieldName: string): ValidatorFunction<T> => (value) => {
    if (value && !/^[a-zA-Z\s,]*$/.test(value as string)) {
        return t('validation.alpha_comma_only', { fieldName });
    }
    return null;
};

export const fileRequired = <T,>(t: TFunction): ValidatorFunction<T> => (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return t('validation.file_required');
    }
    return null;
};

export const linkedinProfile = <T,>(
    t: TFunction,
    fieldName: string
): ValidatorFunction<T> => (value) => {
    if (
        value &&
        !/^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-_%]+\/?$/i.test(
            value as string
        )
    ) {
        return t('validation.linkedin_invalid', { fieldName });
    }
    return null;
};

export const socialMediaProfile = <T,>(
    t: TFunction,
    fieldName: string
): ValidatorFunction<T> => (value) => {
    if (
        value &&
        !/^(https?:\/\/)?(www\.)?(facebook\.com|instagram\.com|tiktok\.com)\/.+$/i.test(
            value as string
        )
    ) {
        return t('validation.social_media_profile', { fieldName });
    }
    return null;
};

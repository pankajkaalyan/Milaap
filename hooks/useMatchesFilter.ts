import { useState, useMemo, useEffect } from 'react';
import { Match, User } from '../types';
import { mockUsers } from '../data/mockUsers';
import { useGeolocation } from './useGeolocation';
import { haversineDistance } from '../utils/location';

export const useMatchesFilter = (user: User | null) => {
    const { data: locationData, getLocation } = useGeolocation();

    const [filters, setInternalFilters] = useState<Record<string, string>>({
        minAge: '', maxAge: '', minHeight: '', maxHeight: '',
        location: '', caste: '', profession: '', education: '', mangalDosha: 'Any',
        gender: '',
    });
    const [isNearMe, setIsNearMe] = useState(false);
    const [radius, setRadius] = useState(200);
    const [hasSearched, setHasSearched] = useState(false);


    useEffect(() => {
        if (locationData) {
            setIsNearMe(true);
            setInternalFilters(prev => ({ ...prev, location: '' }));
            setHasSearched(true);
        }
    }, [locationData]);

    const setFilters = (id: string, value: string) => {
        setIsNearMe(false);
        setInternalFilters(prev => ({ ...prev, [id]: value }));
        setHasSearched(true);
    };

    const handleNearMeToggle = (checked: boolean) => {
        if (checked) {
            getLocation();
        } else {
            setIsNearMe(false);
        }
        setHasSearched(true);
    };

    const filteredMatches = useMemo(() => {
        if (!hasSearched) return null;
        
        const blockedUserIds = user?.profile?.blockedUsers || [];
        
        return mockUsers.filter(u => {
            if (
                u.id === user?.id || 
                blockedUserIds.includes(u.id.toString()) ||
                u.status === 'deactivated'
            ) {
                return false;
            }

            // Location check
            if (isNearMe && locationData && u.latitude && u.longitude) {
                const distance = haversineDistance(locationData.latitude, locationData.longitude, u.latitude, u.longitude);
                if (distance > radius) return false;
            } else if (filters.location && !u.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            // Other checks
            if (filters.minAge && u.age < parseInt(filters.minAge)) return false;
            if (filters.maxAge && u.age > parseInt(filters.maxAge)) return false;
            if (filters.caste && !u.caste.toLowerCase().includes(filters.caste.toLowerCase())) return false;
            if (filters.profession && u.profession && !u.profession.toLowerCase().includes(filters.profession.toLowerCase())) return false;
            if (filters.education && u.highestEducation && !u.highestEducation.toLowerCase().includes(filters.education.toLowerCase())) return false;
            if (filters.minHeight && u.heightInCm && u.heightInCm < parseInt(filters.minHeight)) return false;
            if (filters.maxHeight && u.heightInCm && u.heightInCm > parseInt(filters.maxHeight)) return false;
            if (filters.mangalDosha !== 'Any' && u.horoscope?.mangalDosha !== filters.mangalDosha) return false;
            if (filters.gender && u.gender.toLocaleLowerCase() !== filters.gender.toLocaleLowerCase()) return false;
            return true;
        });
    }, [filters, user, isNearMe, locationData, radius, hasSearched]);

    return {
        filters,
        setFilters,
        isNearMe,
        radius,
        setRadius,
        handleNearMeToggle,
        filteredMatches,
    };
};
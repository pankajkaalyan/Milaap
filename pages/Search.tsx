import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ProfileCard } from '../components/customer/ProfileCard';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Slider from '../components/ui/Slider';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Dropdown from '../components/ui/Dropdown';
import { useMatchesFilter } from '../hooks/useMatchesFilter';
import { Match } from '@/types/models';
import { getDashboardDataAPI } from '@/services/api/dashboard';

const Search: React.FC = () => {
    const { t, favourites, toggleFavourite, user, trackEvent } = useAppContext();
    const [recommendedMatches, setRecommendedMatches] = useState<Match[]>([]);
    const {
        filters, setFilters, isNearMe, radius, setRadius, handleNearMeToggle, filteredMatches
    } = useMatchesFilter(user);

    const hasFetchedDashboardRef = useRef({});
    const hasTrackedRef = useRef({});

    const [errors] = useState<Partial<typeof filters>>({});

    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(e.target.id, e.target.value, [searchResults || []].flat());
    };

    const handleDropdownChange = (id: string, value: string) => {
        setFilters(id, value, [searchResults || []].flat());
    }

    const searchResults = filteredMatches === null ? recommendedMatches : filteredMatches;
    const isSearchActive = filteredMatches !== null;

    useEffect(() => {
        if (!user?.id) return;

        // ----- API CALL: once per user -----
        if (!hasFetchedDashboardRef.current[user.id]) {
            hasFetchedDashboardRef.current[user.id] = true;

            getDashboardDataAPI()
                .then(data => {
                    setRecommendedMatches(data);
                })
                .catch(err => 
                    console.error("Dashboard fetch error:", err)
                );
        }

        // ----- TRACK EVENT: once per user -----
        if (!hasTrackedRef.current[user.id]) {
            hasTrackedRef.current[user.id] = true;
            trackEvent("view_search", { userId: user.id });
        }

    }, [user?.id]);

    return (
        <div className="space-y-8">
            <Card>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">{t('search.title')}</h1>
                    <p className="text-gray-300 mb-8">{t('search.subtitle')}</p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2 lg:col-span-3">
                        <ToggleSwitch
                            id="near-me-search"
                            label={t('geolocation.find_near_me')}
                            checked={isNearMe}
                            onChange={handleNearMeToggle}
                        />
                    </div>

                    <div className="relative">
                        <Input id="location" label={t('matches.filter.location')} type="text" placeholder="e.g. Mumbai" value={isNearMe ? t('geolocation.using_current_location') : filters.location} onChange={handleParamChange} disabled={isNearMe} />
                    </div>

                    {isNearMe && (
                        <div className="md:col-span-2">
                            <Slider
                                id="radius"
                                label={t('geolocation.radius')}
                                value={radius}
                                onChange={(e) => setRadius(parseInt(e.target.value))}
                                min={10}
                                max={1000}
                                step={10}
                                unit={t('geolocation.km')}
                            />
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Input id="minAge" label="Min Age" type="number" placeholder="25" value={filters.minAge} onChange={handleParamChange} error={errors.minAge} />
                        <Input id="maxAge" label="Max Age" type="number" placeholder="35" value={filters.maxAge} onChange={handleParamChange} error={errors.maxAge} />
                    </div>
                    <div className="flex gap-2">
                        <Input id="minHeight" label="Min Height (cm)" type="number" placeholder="150" value={filters.minHeight} onChange={handleParamChange} error={errors.minHeight} />
                        <Input id="maxHeight" label="Max Height (cm)" type="number" placeholder="180" value={filters.maxHeight} onChange={handleParamChange} error={errors.maxHeight} />
                    </div>

                    <Input id="caste" label={t('register.caste')} type="text" placeholder="e.g. Brahmin" value={filters.caste} onChange={handleParamChange} />
                    <Input id="profession" label={t('register.profession')} type="text" placeholder="e.g. Doctor" value={filters.profession} onChange={handleParamChange} />
                    <Input id="education" label={t('register.education')} type="text" placeholder="e.g. MBA" value={filters.education} onChange={handleParamChange} />
                    <Dropdown
                        id="mangalDosha"
                        label={t('profile.details.mangal_dosha')}
                        value={filters.mangalDosha}
                        onChange={(value) => handleDropdownChange('mangalDosha', value)}
                        options={[
                            { value: 'Any', label: 'Any' },
                            { value: 'No', label: 'No' },
                            { value: 'Yes', label: 'Yes' },
                            { value: 'Partial', label: 'Partial' }
                        ]}
                    />
                    <Dropdown
                        id="gender"
                        label={t('profile.gender')}
                        value={filters.gender}
                        onChange={(value) => handleDropdownChange('gender', value)}
                        options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
                    />
                </form>
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">{t('search.results_title')}</h2>
                {!isSearchActive ? (
                    <Card className="text-center py-16">
                        <p className="text-gray-300">{t('search.start_searching')}</p>
                    </Card>
                ) : searchResults && searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {searchResults.map(match => (
                            <ProfileCard
                                key={match.id}
                                match={match}
                                isFavourite={favourites.some(fav => fav.id === match.id)}
                                onToggleFavourite={() => toggleFavourite(match)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-16">
                        <p className="text-gray-300">{t('search.no_results')}</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Search;
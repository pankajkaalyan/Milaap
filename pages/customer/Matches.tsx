import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import ProfileCard from '../../components/customer/ProfileCard';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Slider from '../../components/ui/Slider';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { useMatchesFilter } from '../../hooks/useMatchesFilter';
import { Match } from '@/types/models';
import { getDashboardDataAPI } from '@/services/api/dashboard';

const Matches: React.FC = () => {
    const { t, favourites, toggleFavourite, user, trackEvent } = useAppContext();
    const [recommendedMatches, setRecommendedMatches] = useState<Match[]>([]);
    
    const {
        filters, setFilters, isNearMe, radius, setRadius, handleNearMeToggle, filteredMatches
    } = useMatchesFilter(user);

    const [errors, setErrors] = useState<Partial<typeof filters>>({});

    // const matchesToShow = filteredMatches === null ? mockUsers.filter(u => u.id !== user?.id && !user?.profile?.blockedUsers?.includes(u.id.toString())) : filteredMatches;
    const matchesToShow = filteredMatches === null ? recommendedMatches : filteredMatches;
    const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFilters(id, value, matchesToShow || []);
    };
    useEffect(() => {
        if (recommendedMatches.length === 0) {
            getDashboardDataAPI()
                .then(data => {
                    // console.log('Dashboard data fetched:', data);
                    setRecommendedMatches(data);
                })
                .catch(error => {
                    console.error('Error fetching dashboard data:', error);
                });
        }
        // console.log('CustomerDashboard mounted for user:', user);
        trackEvent('view_matches', { userId: user?.id });
    }, [trackEvent, user?.id]);

    // console.log('matchesToShow data fetched: 1', matchesToShow);

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4 animate-fade-in-up">
                <Card>
                    <h2 className="text-xl font-bold text-white mb-4">{t('matches.filter.title')}</h2>
                    <div className="space-y-4">
                        <ToggleSwitch
                            id="near-me-matches"
                            label={t('geolocation.find_near_me')}
                            checked={isNearMe}
                            onChange={handleNearMeToggle}
                        />

                        <div className="relative">
                            <Input id="location" label={t('matches.filter.location')} type="text" placeholder="e.g. Mumbai" value={isNearMe ? t('geolocation.using_current_location') : filters.location} onChange={handleFilterInputChange} disabled={isNearMe} />
                        </div>

                        {isNearMe && (
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
                        )}

                        <div className="flex gap-2">
                            <Input id="minAge" label="Min Age" type="number" placeholder="25" value={filters.minAge} onChange={handleFilterInputChange} error={errors.minAge} />
                            <Input id="maxAge" label="Max Age" type="number" placeholder="35" value={filters.maxAge} onChange={handleFilterInputChange} error={errors.maxAge} />
                        </div>
                        <Input id="caste" label={t('register.caste')} type="text" placeholder="e.g. Brahmin" value={filters.caste} onChange={handleFilterInputChange} />
                        <Input id="profession" label={t('register.profession')} type="text" placeholder="e.g. Doctor" value={filters.profession} onChange={handleFilterInputChange} />
                        <Input id="education" label={t('register.education')} type="text" placeholder="e.g. MBA" value={filters.education} onChange={handleFilterInputChange} />
                    </div>
                </Card>
            </aside>
            <main className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-down">{t('matches.title')}</h1>
                <p className="text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>{t('matches.intro')}</p>

                {matchesToShow.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchesToShow.map((match, index) => (
                            <div key={match.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                                <ProfileCard
                                    key={match.id}
                                    match={match}
                                    isFavourite={match.isFavourite || false}
                                    onToggleFavourite={() => toggleFavourite(match)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center animate-fade-in">
                        <p className="text-gray-300">{t('matches.no_results')}</p>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default Matches;
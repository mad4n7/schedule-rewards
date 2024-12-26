import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

interface State {
  id: string;
  name: string;
  abbreviation: string;
}

interface City {
  id: string;
  name: string;
}

export function useLocations() {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const countryCode = locale === 'pt-BR' ? 'BR' : 'US';

  // Fetch states
  useEffect(() => {
    async function fetchStates() {
      try {
        const response = await fetch(`/api/locations?country=${countryCode}&locale=${locale}`);
        console.log('response state', response);
        if (!response.ok) {
          console.error('States fetch failed:', await response.text());
          throw new Error('Failed to fetch states');
        }
        const data = await response.json();
        setStates(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching states:', error);
        setIsLoading(false);
      }
    }

    fetchStates();
  }, [countryCode, locale]);

  // Fetch cities when state is selected
  useEffect(() => {
    async function fetchCities() {
      if (!selectedState) {
        setCities([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/locations?state=${selectedState}&locale=${locale}`);
        console.log('response city', response);
        if (!response.ok) throw new Error('Failed to fetch cities');
        const data = await response.json();
        setCities(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setIsLoading(false);
      }
    }

    fetchCities();
  }, [selectedState, locale]);

  return {
    states,
    cities,
    selectedState,
    setSelectedState,
    isLoading
  };
}

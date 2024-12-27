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

export function useLocations(initialCountry?: string, initialState?: string) {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>(initialState || '');
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const [countryCode, setCountryCode] = useState(initialCountry || (locale === 'pt-BR' ? 'BR' : 'US'));

  useEffect(() => {
    console.log('Fetching states for country:', countryCode);
    console.log('Current selected state:', selectedState);
  }, [countryCode, selectedState]);

  // Fetch states
  useEffect(() => {
    let mounted = true;

    async function fetchStates() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/locations?country=${countryCode}&locale=${locale}`);
        if (!response.ok) {
          console.error('States fetch failed:', await response.text());
          throw new Error('Failed to fetch states');
        }
        const data = await response.json();
        if (mounted) {
          setStates(data);
          if (!initialState || countryCode !== initialCountry) {
            setSelectedState('');
            setCities([]);
          }
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStates();

    return () => {
      mounted = false;
    };
  }, [countryCode, locale, initialCountry, initialState]);

  // Fetch cities when state is selected
  useEffect(() => {
    let mounted = true;

    async function fetchCities() {
      if (!selectedState) {
        setCities([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/locations?state=${selectedState}&locale=${locale}`);
        if (!response.ok) throw new Error('Failed to fetch cities');
        const data = await response.json();
        if (mounted) {
          setCities(data);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCities();

    return () => {
      mounted = false;
    };
  }, [selectedState, locale]);

  return {
    states,
    cities,
    selectedState,
    setSelectedState,
    countryCode,
    setCountryCode,
    isLoading
  };
}

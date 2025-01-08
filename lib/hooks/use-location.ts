import { useState, useEffect } from 'react';
import type { City, State, CountryCode } from '@/types/location';

export function useLocation(country: CountryCode) {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLocationData() {
      try {
        const module = await import(`@/data/locations/${country.toLowerCase()}.json`);
        setStates(module.states);
        setCities(module.cities);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading location data:', error);
        setIsLoading(false);
      }
    }

    loadLocationData();
  }, [country]);

  useEffect(() => {
    if (selectedState) {
      setFilteredCities(cities.filter(city => city.stateId === selectedState));
    } else {
      setFilteredCities([]);
    }
  }, [selectedState, cities]);

  return {
    states,
    cities: filteredCities,
    selectedState,
    setSelectedState,
    isLoading
  };
}

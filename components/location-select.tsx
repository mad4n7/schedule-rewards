import { useLocations } from '@/lib/hooks/use-locations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface LocationSelectProps {
  onStateChange: (stateId: string) => void;
  onCityChange: (cityId: string) => void;
  stateLabel?: string;
  cityLabel?: string;
  statePlaceholder?: string;
  cityPlaceholder?: string;
  initialState?: string;
  initialCity?: string;
  country?: string;
  className?: string;
}

export function LocationSelect({
  onStateChange,
  onCityChange,
  stateLabel = 'State',
  cityLabel = 'City',
  statePlaceholder = 'Select a state',
  cityPlaceholder = 'Select a city',
  initialState,
  initialCity,
  country,
  className
}: LocationSelectProps) {
  const [stateValue, setStateValue] = useState(initialState || '');
  const [cityValue, setCityValue] = useState(initialCity || '');
  
  const { states, cities, selectedState, setSelectedState, isLoading } = useLocations(country, initialState);

  // Update state value when selected state changes
  useEffect(() => {
    if (selectedState && selectedState !== stateValue) {
      setStateValue(selectedState);
      onStateChange(selectedState);
    }
  }, [selectedState, stateValue, onStateChange]);

  // Reset city when state changes
  useEffect(() => {
    if (!stateValue) {
      setCityValue('');
      onCityChange('');
    }
  }, [stateValue, onCityChange]);

  const handleStateChange = (value: string) => {
    setStateValue(value);
    setSelectedState(value);
    onStateChange(value);
    setCityValue('');
    onCityChange('');
  };

  const handleCityChange = (value: string) => {
    setCityValue(value);
    onCityChange(value);
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="space-y-2">
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <FormItem>
        <FormLabel>{stateLabel}</FormLabel>
        <FormControl>
          <Select
            value={stateValue}
            onValueChange={handleStateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={statePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem
                  key={state.id}
                  value={state.id}
                >
                  {state.name} ({state.abbreviation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>{cityLabel}</FormLabel>
        <FormControl>
          <Select
            value={cityValue}
            onValueChange={handleCityChange}
            disabled={!stateValue}
          >
            <SelectTrigger>
              <SelectValue placeholder={cityPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem
                  key={city.id}
                  value={city.id}
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}

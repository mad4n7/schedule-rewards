import { useLocations } from '@/lib/hooks/use-locations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationSelectProps {
  onStateChange: (stateId: string) => void;
  onCityChange: (cityId: string) => void;
  stateLabel?: string;
  cityLabel?: string;
  statePlaceholder?: string;
  cityPlaceholder?: string;
}

export function LocationSelect({
  onStateChange,
  onCityChange,
  stateLabel = 'State',
  cityLabel = 'City',
  statePlaceholder = 'Select a state',
  cityPlaceholder = 'Select a city'
}: LocationSelectProps) {
  const { states, cities, selectedState, setSelectedState, isLoading } = useLocations();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {stateLabel}
        </label>
        <Select
          onValueChange={(value) => {
            setSelectedState(value);
            onStateChange(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={statePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name} ({state.abbreviation})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {cityLabel}
        </label>
        <Select onValueChange={onCityChange}>
          <SelectTrigger disabled={!selectedState}>
            <SelectValue placeholder={cityPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

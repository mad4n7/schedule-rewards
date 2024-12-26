export interface City {
  name: string;
  stateId: string;
}

export interface State {
  id: string;
  name: string;
  abbreviation: string;
}

export interface LocationData {
  states: State[];
  cities: City[];
}

export type CountryCode = 'US' | 'BR';

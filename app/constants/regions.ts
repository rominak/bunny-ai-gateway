import { Region } from '../components/shared/RegionSelector';

export const AVAILABLE_REGIONS: Region[] = [
  { id: 'de', name: 'Frankfurt', code: 'DE', location: 'Germany' },
  { id: 'uk', name: 'London', code: 'GB', location: 'United Kingdom' },
  { id: 'us-east', name: 'New York', code: 'US', location: 'United States East' },
  { id: 'us-west', name: 'Los Angeles', code: 'US', location: 'United States West' },
  { id: 'sg', name: 'Singapore', code: 'SG', location: 'Singapore' },
  { id: 'au', name: 'Sydney', code: 'AU', location: 'Australia' },
  { id: 'jp', name: 'Tokyo', code: 'JP', location: 'Japan' },
  { id: 'br', name: 'São Paulo', code: 'BR', location: 'Brazil' },
];

export const DATABASE_REGIONS: Region[] = [
  { id: 'de', name: 'Frankfurt', code: 'DE', location: 'Germany' },
  { id: 'us-east', name: 'New York', code: 'US', location: 'United States' },
  { id: 'sg', name: 'Singapore', code: 'SG', location: 'Singapore' },
  { id: 'au', name: 'Sydney', code: 'AU', location: 'Australia' },
];

export const STORAGE_REGIONS: Region[] = AVAILABLE_REGIONS;

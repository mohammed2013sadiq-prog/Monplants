import { Species } from './species';

export interface Reminder {
  id: number;
  user_plant_id: number;
  type: string;
  frequency_days: number;
  next_date: string;
  status: 'pending' | 'completed' | 'skipped';
  plant?: UserPlant;
}

export interface JournalEntry {
  id: number;
  user_plant_id: number;
  action: string;
  photo_url?: string;
  notes?: string;
  weather?: string;
  created_at: string;
  plant?: UserPlant;
}

export interface UserPlant {
  id: number;
  user_id: number;
  species_id: number;
  nickname: string;
  image_url?: string;
  added_at: string;
  species?: Species;
  reminders?: Reminder[];
  journalEntries?: JournalEntry[];
}

export interface Favorite {
  id: number;
  user_id: number;
  species_id: number;
  created_at: string;
  species?: Species;
}

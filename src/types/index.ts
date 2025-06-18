
export interface Scout {
  id: number;
  name: string;
  group: string;
  age: number;
  joinDate: string;
  phone?: string;
  parentPhone?: string;
}

export interface PresenceRecord {
  scoutId: number;
  date: string;
  isPresent: boolean;
  notes?: string;
  customColumns?: { [key: string]: string | boolean | number };
}

export interface CustomColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date';
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  location?: string;
  type: 'meeting' | 'trip' | 'workshop' | 'competition' | 'other';
}

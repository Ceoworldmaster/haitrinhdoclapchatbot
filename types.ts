
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  suggestions?: string[]; // New field for follow-up questions
  isThinking?: boolean; // Track if the message was generated using Deep Thinking mode
}

export interface User {
  username: string;
  password?: string; // stored in localstorage for this demo
  fullName: string;
  id: string;
  joinedAt: number;
  avatarUrl?: string; // URL/Base64 of the custom avatar
}

export interface LocationData {
  id: string;
  year: string;
  title: string;
  description: string;
  coordinates: { x: number; y: number }; // Percentage 0-100 for stylized map
  lat: number; // Real Latitude
  lng: number; // Real Longitude
  image: string;
  details: string;
  audio?: string; // URL to audio narration
  gallery?: string[]; // Collection of historical images
}

export interface GameState {
  isGameActive: boolean;
  gameType?: 'quiz' | 'decision';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

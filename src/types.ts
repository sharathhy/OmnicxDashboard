export type Role = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  createdAt: string;
}

export interface Metric {
  id: string;
  category: string;
  description: string;
  criteria: string;
  storeType: 'ONLINE' | 'IN-STORE';
}

export interface Retailer {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface ScoreData {
  id: string;
  metricId: string;
  retailerId: string;
  score: number;
  comments: string;
  date: string; // ISO format
  region: string;
}

export interface DashboardData {
  metrics: Metric[];
  retailers: Retailer[];
  scores: ScoreData[];
}

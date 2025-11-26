import { LucideIcon } from 'lucide-react';

export interface Role {
  id: string;
  label: string;
  color: string;
  access: string[];
  pin: string;
}

export interface DrugStandard {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  pharmacy: string;
  location: string;
  stock: 'High' | 'Medium' | 'Low';
}

export interface AuditLog {
  id?: string;
  user: string;
  role: string;
  action: string;
  batch: string;
  result: string;
  time: string;
  device: string;
  createdAt?: any;
}

export interface QuarantineItem {
  id: string;
  batch: string;
  name: string;
  reason: string;
  date: string;
  status: string;
  officer?: string;
}

export interface Notification {
  id: number;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  msg: string;
  time: string;
  category?: string;
}

export interface Supplier {
  id: number;
  name: string;
  score: number;
  status: 'Trusted' | 'Safe' | 'Risky';
  breakdown: {
    onTime: number;
    compliance: number;
    rejected: number;
    docs: number;
  };
  history: number[];
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface Translations {
  [key: string]: any;
}

export type ConnectionStatus = 'connecting' | 'live' | 'offline';
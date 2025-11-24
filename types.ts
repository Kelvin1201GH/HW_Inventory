export interface InventoryItem {
  id: string;
  name: string;
  category: HardwareCategory;
  vendor: string;
  purchaseDate: string; // ISO Date string YYYY-MM-DD
  warrantyPeriodYears: number;
  warrantyExpirationDate: string; // ISO Date string YYYY-MM-DD
  serialNumber: string;
  cost: number;
  status: ItemStatus;
}

export enum HardwareCategory {
  LAPTOP = 'Laptop',
  DESKTOP = 'Desktop',
  SERVER = 'Server',
  NETWORKING = 'Networking',
  PERIPHERAL = 'Peripheral',
  MOBILE = 'Mobile',
  OTHER = 'Other'
}

export enum ItemStatus {
  ACTIVE = 'Active',
  IN_REPAIR = 'In Repair',
  RETIRED = 'Retired',
  LOST = 'Lost'
}

export type View = 'dashboard' | 'inventory' | 'assistant';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

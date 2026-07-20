export interface ScanHistoryItem {
  id?: number | string;
  carOwner?: string;
  licensePlate?: string;
  parkingSpot?: string;
  isChecked?: boolean;
  propertyName?: string;
  address?: string;
  status?: 'registered' | 'unregistered';
  scannedAt?: string;
  source?: string;
  sentToTowingCompany?: boolean;
  description?: string;
}

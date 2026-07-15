export interface TowingQueueItem {
  id?: number | string;
  carOwner?: string;
  licensePlate?: string;
  parkingSpot?: string;
  isChecked?: boolean;
  propertyName?: string;
  address?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  scannedAt?: string;
  source?: string;
  description?: string
}

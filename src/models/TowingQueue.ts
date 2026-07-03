export interface TowingQueueItem {
  id: string;
  licensePlate: string;
  parkingSpot: string;
  propertyName: string;
  address: string;
  towingCompany: string;
  towingPhone: string;
  addedAt: string;
  status: 'pending' | 'in-progress' | 'completed';
}

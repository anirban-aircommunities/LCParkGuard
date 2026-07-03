export interface Vehicle {
  id: string;
  licensePlate: string;
  parkingSpot: string;
  propertyId: string;
  propertyName?: string;
  address?: string;
  status: 'registered' | 'unregistered';
  scannedAt: string;
}

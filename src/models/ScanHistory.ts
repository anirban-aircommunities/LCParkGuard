export interface ScanHistoryItem {
  id: string;
  licensePlate: string;
  parkingSpot: string;
  propertyName: string;
  address: string;
  status: 'registered' | 'unregistered';
  scannedAt: string;
  source: 'manual' | 'camera';
  sentToTowingCompany?: boolean;
}

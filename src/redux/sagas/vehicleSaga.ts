import { takeEvery, put, call, select } from 'redux-saga/effects';
import { checkVehicleRequest, checkVehicleSuccess, checkVehicleFailure } from '../slices/vehicleSlice';
import { addScanHistory } from '../slices/scanHistorySlice';
import { Vehicle } from '../../models/Vehicle';
import { ScanHistoryItem } from '../../models/ScanHistory';
import { RootState } from '../store';
import { authorizedVehicleList } from '../../constants/Constants';

function* checkVehicleSaga(action: ReturnType<typeof checkVehicleRequest>) {
  try {
    const { licensePlate, parkingSpot, propertyId } = action.payload;
    
    // Normalize license plate for comparison (remove dashes, convert to uppercase)
    const normalizedPlate = licensePlate.replace(/-/g, '').toUpperCase();
    
    // Check if plate is in authorized list (handle both with and without dashes)
    const isPlateResgistered = authorizedVehicleList.some(item => {
      const normalizedItem = item.replace(/-/g, '').toUpperCase();
      return normalizedItem === normalizedPlate;
    });
    
    // Get property info from state
    const state: RootState = yield select();
    const property = state.property.properties.find((p) => p.id === propertyId);
    
    // Simulate API call
    yield call(() => new Promise((resolve) => setTimeout(resolve as any, 1000)));
    
    const vehicle: Vehicle = {
      id: Date.now().toString(),
      licensePlate,
      parkingSpot,
      propertyId,
      status: isPlateResgistered ? 'registered' : 'unregistered',
      scannedAt: new Date().toISOString(),
    };
    
    yield put(checkVehicleSuccess(vehicle));
    
    // Don't add to scan history automatically - let the UI handle it after user confirms
    
  } catch (error: any) {
    yield put(checkVehicleFailure(error.message));
  }
}

export default function* vehicleSaga() {
  yield takeEvery(checkVehicleRequest.type, checkVehicleSaga);
}

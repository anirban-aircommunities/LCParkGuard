import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setSelectedProperty } from '../redux/slices/propertySlice';
import {
  checkVehicleRequest,
  clearVehicle,
} from '../redux/slices/vehicleSlice';
import { addToTowingQueue } from '../redux/slices/towingQueueSlice';
import { Property } from '../models/Property';
import { Alert } from 'react-native';

export const useScanViewModel = () => {
  const dispatch = useDispatch();
  const { properties, selectedProperty } = useSelector(
    (state: RootState) => state.property
  );
  const { currentVehicle, loading } = useSelector(
    (state: RootState) => state.vehicle
  );
  const { registeredVehicles } = useSelector(
    (state: RootState) => state.vehicle
  );

  const selectProperty = (property: Property) => {
    dispatch(setSelectedProperty(property));
  };

  const checkVehicle = (licensePlate: string, parkingSpot: string) => {
    if (selectedProperty) {
      dispatch(
        checkVehicleRequest({
          licensePlate,
          parkingSpot,
          propertyId: selectedProperty.id,
        })
      );
    }
  };

  const sendToTowingQueue = () => {
    if (currentVehicle && selectedProperty) {
      dispatch(
        addToTowingQueue({
          id: Date.now().toString(),
          licensePlate: currentVehicle.licensePlate,
          parkingSpot: currentVehicle.parkingSpot,
          propertyName: selectedProperty.name,
          address: selectedProperty.address,
          towingCompany: selectedProperty.towingCompany,
          towingPhone: selectedProperty.towingPhone,
          addedAt: new Date().toISOString(),
          status: 'pending',
        })
      );
      dispatch(clearVehicle());
    }
  };

  const clearCurrentVehicle = () => {
    dispatch(clearVehicle());
  };

  return {
    properties,
    selectedProperty,
    currentVehicle,
    registeredVehicles,
    loading,
    selectProperty,
    checkVehicle,
    sendToTowingQueue,
    clearCurrentVehicle,
  };
};

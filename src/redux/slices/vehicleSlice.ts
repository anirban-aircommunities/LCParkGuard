import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../../models/Vehicle';

interface VehicleState {
  currentVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  currentVehicle: null,
  loading: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    checkVehicleRequest: (state, action: PayloadAction<{ licensePlate: string; parkingSpot: string; propertyId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    checkVehicleSuccess: (state, action: PayloadAction<Vehicle>) => {
      state.currentVehicle = action.payload;
      state.loading = false;
      state.error = null;
    },
    checkVehicleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearVehicle: (state) => {
      state.currentVehicle = null;
      state.error = null;
    },
  },
});

export const { checkVehicleRequest, checkVehicleSuccess, checkVehicleFailure, clearVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;

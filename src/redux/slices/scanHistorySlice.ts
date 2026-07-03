import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScanHistoryItem } from '../../models/ScanHistory';

interface ScanHistoryState {
  items: ScanHistoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ScanHistoryState = {
  items: [],
  loading: false,
  error: null,
};

const scanHistorySlice = createSlice({
  name: 'scanHistory',
  initialState,
  reducers: {
    addScanHistory: (state, action: PayloadAction<ScanHistoryItem>) => {
      // Check if item already exists (same license plate and parking spot)
      const existingIndex = state.items.findIndex(
        (item) =>
          item.licensePlate.toLowerCase() === action.payload.licensePlate.toLowerCase() &&
          item.parkingSpot.toLowerCase() === action.payload.parkingSpot.toLowerCase()
      );
      
      if (existingIndex !== -1) {
        // Remove existing duplicate and add new one at the top
        state.items.splice(existingIndex, 1);
      }
      
      // Add new item at the beginning
      state.items.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    markAsSentToTowingCompany: (state, action: PayloadAction<string[]>) => {
      // Mark multiple items as sent to towing company by matching license plate and parking spot
      action.payload.forEach((id) => {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.sentToTowingCompany = true;
        }
      });
    },
  },
});

export const { addScanHistory, setLoading, setError, markAsSentToTowingCompany } = scanHistorySlice.actions;
export default scanHistorySlice.reducer;

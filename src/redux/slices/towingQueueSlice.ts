import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TowingQueueItem } from '../../models/TowingQueue'; 

interface TowingQueueState {
  items: TowingQueueItem[];
  loading: boolean;
  error: string | null;
}

const towingQueueItems: TowingQueueItem[] = [
  {
    id: "1",
    licensePlate: "ABC101",
    parkingSpot: "XYZ101",
    propertyName: "Unknown",
    address: "Denver",
    towingCompany: "Air Communities",
    towingPhone: "(303) 901-2847",
    addedAt: "Jul 1, 2026",
    status: "pending"
  }
]

const initialState: TowingQueueState = {
  items: towingQueueItems,
  loading: false,
  error: null,
};

const towingQueueSlice = createSlice({
  name: 'towingQueue',
  initialState,
  reducers: {
    addToTowingQueue: (state, action: PayloadAction<TowingQueueItem>) => {
      state.items.unshift(action.payload);
    },
    updateTowingQueueItem: (state, action: PayloadAction<{ id: string; status: TowingQueueItem['status'] }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.status = action.payload.status;
      }
    },
    removeFromTowingQueue: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addToTowingQueue, updateTowingQueueItem, removeFromTowingQueue, setLoading, setError } = towingQueueSlice.actions;
export default towingQueueSlice.reducer;

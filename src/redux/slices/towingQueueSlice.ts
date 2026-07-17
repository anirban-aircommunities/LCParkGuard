import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TowingQueueItem } from '../../models/TowingQueue';

interface TowingQueueState {
  items: TowingQueueItem[];
  loading: boolean;
  selectedItems?: any;
  error: string | null;
}

const towingQueueItems: TowingQueueItem[] = [
  {
    "id": "1",
    "carOwner": "Rebecca Thompson",
    "licensePlate": "ABC123",
    "parkingSpot": "N/A",
    "isChecked": false,
    "propertyName": "John Doe",
    "address": "ADA Area",
    "status": "pending",
    texted: true,
    "scannedAt": "Jun 18, 2026 at 3:33 am",
    "source": "manual",
    "description": "hgfsjhgkjdfhgfdk ghfjhgfkjhgdfkj hgjfdhgjkdhgfdjk hgfjdhgjkdhgjf hgjfdh gjkfdh dshgjds hgfdsjkhgkadg fhgjakshgjgaks ghgkjshfksfdh. hfdjhfjdkshfjdk ahd"
  },
  {
    "id": "2",
    "carOwner": "Rebecca Thompson",
    "licensePlate": "ABC123",
    "parkingSpot": "N/A",
    "isChecked": true,
    "propertyName": "John Doe",
    "address": "ADA Area",
    "status": "in-progress",
    texted: false,
    "scannedAt": "Jun 18, 2026 at 3:33 am",
    "source": "manual",
    "description": "hgfsjhgkjdfhgfdk ghfjhgfkjhgdfkj hgjfdhgjkdhgfdjk hgfjdhgjkdhgjf hgjfdh gjkfdh dshgjds hgfdsjkhgkadg fhgjakshgjgaks ghgkjshfksfdh. hfdjhfjdkshfjdk ahd"
  },
  {
    "id": "3",
    "carOwner": "Rebecca Thompson",
    "licensePlate": "ABC123",
    "parkingSpot": "N/A",
    "isChecked": false,
    "propertyName": "John Doe",
    "address": "ADA Area",
    "status": "completed",
    texted: true,
    "scannedAt": "Jun 18, 2026 at 3:33 am",
    "source": "manual",
    "description": "hgfsjhgkjdfhgfdk ghfjhgfkjhgdfkj hgjfdhgjkdhgfdjk hgfjdhgjkdhgjf hgjfdh gjkfdh dshgjds hgfdsjkhgkadg fhgjakshgjgaks ghgkjshfksfdh. hfdjhfjdkshfjdk ahd"
  }
]

const initialState: TowingQueueState = {
  items: towingQueueItems,
  loading: false,
  selectedItems: [],
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
    selectItems: (state, action) => {
      state.selectedItems.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.selectedItems = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.selectedItems = [];
    },
  },
});

export const { addToTowingQueue, updateTowingQueueItem, removeFromTowingQueue, selectItems, setLoading, setError } = towingQueueSlice.actions;
export default towingQueueSlice.reducer;

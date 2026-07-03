import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../../models/Property';

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [
    {
      id: '1',
      name: '21 Fitzsimons',
      address: '123 Main Street, Downtown',
      towingCompany: 'QuickTow Services',
      towingPhone: '(555) 123-4567',
      towingEmail: 'contact@quicktow.com',
    },
    {
      id: '2',
      name: '15 Oak Avenue',
      address: '456 Oak Avenue, Midtown',
      towingCompany: 'City Towing',
      towingPhone: '(555) 234-5678',
      towingEmail: 'contact@citytowing.com',
    },
    {
      id: '3',
      name: '8 Park Plaza',
      address: '789 Park Plaza, Uptown',
      towingCompany: 'Express Towing',
      towingPhone: '(555) 345-6789',
      towingEmail: 'contact@expresstowing.com',
    },
  ],
  selectedProperty: {
    id: '1',
    name: '21 Fitzsimons',
    address: '123 Main Street, Downtown',
    towingCompany: 'QuickTow Services',
    towingPhone: '(555) 123-4567',
    towingEmail: 'contact@quicktow.com',
  },
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedProperty: (state, action: PayloadAction<Property>) => {
      state.selectedProperty = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSelectedProperty, setLoading, setError } = propertySlice.actions;
export default propertySlice.reducer;

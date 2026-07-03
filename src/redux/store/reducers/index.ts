import { combineReducers } from '@reduxjs/toolkit';
import propertyReducer from '../../slices/propertySlice';
import vehicleReducer from '../../slices/vehicleSlice';
import towingQueueReducer from '../../slices/towingQueueSlice';
import scanHistoryReducer from '../../slices/scanHistorySlice';

const rootReducer = combineReducers({
  property: propertyReducer,
  vehicle: vehicleReducer,
  towingQueue: towingQueueReducer,
  scanHistory: scanHistoryReducer,
});

export default rootReducer;

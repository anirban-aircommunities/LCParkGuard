import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  updateTowingQueueItem,
  removeFromTowingQueue,
} from '../redux/slices/towingQueueSlice';
import { TowingQueueItem } from '../models/TowingQueue';

export const useTowingQueueViewModel = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(
    (state: RootState) => state.towingQueue
  );

  const updateItemStatus = (id: string, status: TowingQueueItem['status']) => {
    dispatch(updateTowingQueueItem({ id, status }));
  };

  const removeItem = (id: string) => {
    dispatch(removeFromTowingQueue(id));
  };

  return {
    items,
    loading,
    updateItemStatus,
    removeItem,
  };
};

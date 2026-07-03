import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useScanHistoryViewModel = () => {
  const { items, loading } = useSelector((state: RootState) => state.scanHistory);

  return {
    items,
    loading,
  };
};

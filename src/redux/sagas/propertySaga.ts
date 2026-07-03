import { takeEvery, put, call } from 'redux-saga/effects';
import { setLoading, setError } from '../slices/propertySlice';

function* fetchPropertiesSaga() {
  try {
    yield put(setLoading(true));
    // Simulate API call
    yield call(() => new Promise((resolve) => setTimeout(resolve, 500)));
    yield put(setLoading(false));
  } catch (error: any) {
    yield put(setError(error.message));
    yield put(setLoading(false));
  }
}

export default function* propertySaga() {
  // Add watchers here when needed
}

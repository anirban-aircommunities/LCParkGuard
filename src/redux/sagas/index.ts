import { all, fork } from 'redux-saga/effects';
import propertySaga from './propertySaga';
import vehicleSaga from './vehicleSaga';
import towingQueueSaga from './towingQueueSaga';
import scanHistorySaga from './scanHistorySaga';

export default function* rootSaga() {
  yield all([
    fork(propertySaga),
    fork(vehicleSaga),
    fork(towingQueueSaga),
    fork(scanHistorySaga),
  ]);
}

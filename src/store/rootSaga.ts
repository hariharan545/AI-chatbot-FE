import { all, fork } from 'redux-saga/effects';
import authSaga from '../features/auth/authSaga';
import chatSaga from '../features/chat/chatSaga';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(chatSaga)]);
}



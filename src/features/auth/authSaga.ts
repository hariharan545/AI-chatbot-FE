import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { authActions, User } from './authSlice';

function* handleGoogleLogin() {
  try {
    window.location.href = '/api/auth/google';
  } catch {
    yield put(authActions.googleLoginFailure());
  }
}

function* handleLoadMe() {
  try {
    const response: { data: User } = yield call(axios.get, '/api/me', {
      withCredentials: true
    });
    yield put(authActions.meLoaded(response.data));
  } catch {
    yield put(authActions.meLoaded(null));
  }
}

export default function* authSaga() {
  yield takeLatest(authActions.googleLoginRequested.type, handleGoogleLogin);
  yield takeLatest(authActions.meRequested.type, handleLoadMe);
}



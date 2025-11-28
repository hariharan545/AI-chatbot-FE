import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient, { getApiBaseUrl } from '../../config/axios';
import { authActions, User } from './authSlice';

function* handleGoogleLogin() {
  try {
    const apiBaseUrl = getApiBaseUrl();
    window.location.href = `${apiBaseUrl}/api/auth/google`;
  } catch {
    yield put(authActions.googleLoginFailure());
  }
}

function* handleLoadMe() {
  try {
    const response: { data: User } = yield call(apiClient.get, '/api/me');
    yield put(authActions.meLoaded(response.data));
  } catch {
    yield put(authActions.meLoaded(null));
  }
}

export default function* authSaga() {
  yield takeLatest(authActions.googleLoginRequested.type, handleGoogleLogin);
  yield takeLatest(authActions.meRequested.type, handleLoadMe);
}



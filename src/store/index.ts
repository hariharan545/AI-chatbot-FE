import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import rootSaga from './rootSaga';
import { websocketMiddleware } from './websocketMiddleware';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer
  },
  middleware: (getDefault) =>
    getDefault({ thunk: false }).concat(sagaMiddleware, websocketMiddleware)
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;



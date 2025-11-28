import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { authActions } from './features/auth/authSlice';
import { LoginPage } from './components/LoginPage';
import { ChatScreen } from './components/ChatScreen';

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useAppSelector((s) => s.auth.user);
  const loading = useAppSelector((s) => s.auth.loading);

  if (loading) {
    return <div className="page"><div className="card">Loading session…</div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.meRequested());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <ChatScreen />
          </RequireAuth>
        }
      />
    </Routes>
  );
};



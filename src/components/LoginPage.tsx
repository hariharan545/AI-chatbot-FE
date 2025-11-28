import { Navigate } from 'react-router-dom';
import { authActions } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);
  const user = useAppSelector((s) => s.auth.user);

  const handleGoogle = () => {
    dispatch(authActions.googleLoginRequested());
  };

  // If user is already authenticated (after Google redirect), go to chat
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page login-page">
      <div className="card">
        <h1>Real-Time AI Chat</h1>
        <button className="btn google" onClick={handleGoogle} disabled={loading}>
          {loading ? 'Redirecting…' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

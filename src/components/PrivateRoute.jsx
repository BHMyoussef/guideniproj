import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

export default function PrivateRoute({component: Component}) {
    const { currentUser } = useAuth();
  return (
    currentUser ? <Navigate to="/" />:<Component />
  );
}

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token) {
      // Store token and fetch user data
      localStorage.setItem('token', token);
      // The AuthContext will handle fetching user data
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return <LoadingSpinner />;
};

export default OAuthCallback;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-ink-50 flex flex-col items-center justify-center text-center px-4">
      <p className="font-display font-extrabold text-9xl text-ink-100 select-none">404</p>
      <h1 className="font-display font-bold text-ink-900 text-3xl mt-4">Page not found</h1>
      <p className="font-body text-ink-400 text-sm mt-2 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
};

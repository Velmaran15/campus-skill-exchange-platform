// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';

// interface Props {
//   children: React.ReactNode;
//   role?: 'tutor' | 'learner';
// }

// export const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
//   const { token, user } = useAuthStore();
//   const location = useLocation();

//   if (!token || !user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (role && user.role !== role) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
  role?: 'tutor' | 'learner';
}

export const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  // ✅ FIX: use selector pattern (IMPORTANT)
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // console.log("ProtectedRoute:", { token, user });

  const location = useLocation();
  // 🚫 Not logged in
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Wrong role
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Access allowed
  return <>{children}</>;
};
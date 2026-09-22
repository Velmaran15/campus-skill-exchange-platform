import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { TutorProfilePage } from './pages/TutorProfilePage';
import { TutorDashboard } from './pages/TutorDashboard';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { TopTutorsPage } from './pages/TopTutorsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Chat } from './pages/conversations/Chat';
import { Conversations } from './pages/conversations/Conversations';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/top-tutors" element={<TopTutorsPage />} />
        <Route path="/tutor/:id" element={<TutorProfilePage />} />

        {/* Conversations list */}
        <Route
          path="/conversations"
          element={
            <ProtectedRoute>
              <Conversations />
            </ProtectedRoute>
          }
        />
        
        {/* Individual chat */}
        <Route
          path="/chat/:conversationId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute role="tutor">
              <TutorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/learner"
          element={
            <ProtectedRoute role="learner">
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

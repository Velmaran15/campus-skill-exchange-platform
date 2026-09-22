import api from './client';
import type { SearchFilters, SkillLevel } from '../types';

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    api.put('/auth/profile', data),

  deleteAccount: () =>
    api.delete('/auth/profile'),
};

// ─── Skills ──────────────────────────────────────────────────────────────────
export const skillsApi = {
  getMySkills: () =>
    api.get('/skills/my'),

  search: (filters: SearchFilters) =>
    api.get('/skills', { params: filters }),

  addSkill: (data: { name: string; description: string; level: SkillLevel }) =>
    api.post('/skills', {
      skillName: data.name,
      level: data.level,
      description: data.description
    }),

  deleteSkill: (skillId: string) =>
    api.delete(`/skills/${skillId}`),

  updateSkill: (skillId: string, data: { name?: string; description?: string; level?: SkillLevel }) =>
    api.put(`/skills/${skillId}`, {
      skillName: data.name,
      level: data.level,
      description: data.description
    }),
};

// ─── Tutors ──────────────────────────────────────────────────────────────────
export const tutorsApi = {

  getProfile: (id: string) =>
    api.get(`/users/${id}`),

  getTopTutors: () =>
    api.get('/users/top'),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersApi = {

  updateBio: (bio: string) =>
    api.put('/users/bio', { bio }),

  uploadProfileImage: (formData: FormData) =>
    api.put(
      "/users/profile-image", formData, { headers: { "Content-Type": "multipart/form-data" } }
    ),

  saveSkill: (skillId: string) =>
    api.post(`/users/save-skill/${skillId}`),

  unSaveSkill: (skillId: string) =>
    api.delete(`/users/save-skill/${skillId}`),

  getSavedSkills: () =>
    api.get("/users/saved-skills"),
};

// ─── Sessions ────────────────────────────────────────────────────────────────
export const sessionsApi = {

  request: (skillId: string) =>
    api.post('/sessions', { skillId }),

  getTutorSessions: () =>
    api.get('/sessions/tutor'),

  getLearnerSessions: () =>
    api.get('/sessions/learner'),

  accept: (id: string) =>
    api.post(`/sessions/${id}/accept`),

  reject: (id: string) =>
    api.post(`/sessions/${id}/reject`),

  cancel: (id: string) =>
    api.delete(`/sessions/${id}/cancel`),

  complete: (id: string) =>
    api.put(`/sessions/${id}/complete`),

  rate: (id: string, data: { rating: number; feedback: string }) =>
    api.put(`/sessions/${id}/rate`, data),

  getMyReviews: () =>
    api.get("/sessions/my-reviews"),
};

// ─── Notifications ───────────────────────────────────────────────────────────

export const notificationsApi = {

  getNotifications: () =>
    api.get("/notifications"),

  getUnreadCount: () =>
    api.get("/notifications/unread-count"),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch("/notifications/read-all"),
};

// ─── Conversations ──────────────────────────────────────────────────────────

export const conversationsApi = {
  getMyConversations: () =>
    api.get("/conversations"),
};

// ─── Messages ────────────────────────────────────────────────────────────────
export const messagesApi = {
  getMessages: (conversationId: string) =>
    api.get(`/messages/${conversationId}`),

  sendMessage: (conversationId: string, text: string) =>
    api.post(`/messages/${conversationId}`, {
      text,
    }),

  uploadFile: (conversationId: string, file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    return api.post(
      `/messages/${conversationId}/upload`,
      formData
    );
  },
  
};
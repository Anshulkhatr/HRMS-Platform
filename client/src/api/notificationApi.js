import api from './axios';

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data.data;
};

export const markAllRead = async () => {
  const res = await api.put('/notifications/mark-all-read');
  return res.data;
};

export const markOneRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};

export const clearAllNotifications = async () => {
  const res = await api.delete('/notifications/clear-all');
  return res.data;
};

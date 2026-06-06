import api from './axios';

export const clockIn = async () => {
  const response = await api.post('/attendance/clock-in');
  return response.data;
};

export const clockOut = async () => {
  const response = await api.post('/attendance/clock-out');
  return response.data;
};

export const getMyAttendance = async () => {
  const response = await api.get('/attendance/my-attendance');
  return response.data;
};

export const getAllAttendance = async (date) => {
  const response = await api.get('/attendance', { params: { date } });
  return response.data;
};

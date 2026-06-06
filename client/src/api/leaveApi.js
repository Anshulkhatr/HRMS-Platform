import api from './axios';

export const requestLeave = async (leaveData) => {
  const response = await api.post('/leaves', leaveData);
  return response.data.data;
};

export const getMyLeaves = async () => {
  const response = await api.get('/leaves/my-leaves');
  return response.data.data;
};

export const getAllLeaves = async (status) => {
  const response = await api.get('/leaves', { params: { status } });
  return response.data.data;
};

export const approveLeave = async (id) => {
  const response = await api.put(`/leaves/${id}/approve`);
  return response.data.data;
};

export const rejectLeave = async (id) => {
  const response = await api.put(`/leaves/${id}/reject`);
  return response.data.data;
};

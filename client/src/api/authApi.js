import api from './axios';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerTenant = async (tenantData) => {
  const response = await api.post('/auth/register', tenantData);
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data.data;
};

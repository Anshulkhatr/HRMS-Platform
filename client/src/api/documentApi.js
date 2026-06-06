import api from './axios';

export const getDocuments = async (userId) => {
  const url = userId ? `/documents?userId=${userId}` : '/documents';
  const response = await api.get(url);
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

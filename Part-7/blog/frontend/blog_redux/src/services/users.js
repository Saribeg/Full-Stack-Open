import api from './api';
const baseUrl = '/api/users';

const getAll = async () => {
  const response = await api.get(baseUrl);
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`${baseUrl}/${id}`);
  return response.data;
};

const register = async ({ username, name, password }) => {
  const res = await api.post(baseUrl, { username, name, password });
  return res.data;
};

export default { getAll, getById, register };

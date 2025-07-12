import api from './api';
const baseUrl = '/api/login';

const login = async ({ username, password }) => {
  const response = await api.post(baseUrl, { username, password });
  return response.data;
};

export default { login };

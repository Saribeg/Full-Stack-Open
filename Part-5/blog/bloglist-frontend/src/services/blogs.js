import api from './api';
const baseUrl = '/api/blogs';

const getAll = () => {
  const request = api.get(baseUrl);
  return request.then(response => response.data);
};

const create = async ({ title, author, url }) => {
  const response = await api.post(baseUrl, { title, author, url });
  return response.data;
};

const update = async (blog) => {
  const { id, title, author, url, likes } = blog;
  const response = await api.put(`${baseUrl}/${id}`, { title, author, url, likes });
  return response.data;
};

export default { getAll, create, update };
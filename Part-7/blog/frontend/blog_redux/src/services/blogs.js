import api from './api';
const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await api.get(baseUrl);
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`${baseUrl}/${id}`);
  return response.data;
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

const deleteBlog = async (id) => {
  await api.delete(`${baseUrl}/${id}`);
};

const createComment = async ({ id, comment }) => {
  const response = await api.post(`${baseUrl}/${id}/comments`, { comment });
  return response.data;
};

export default { getAll, getById, create, update, deleteBlog, createComment };

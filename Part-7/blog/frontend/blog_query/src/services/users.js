import api from './api';
const baseUrl = '/api/users';

const getAll = () => {
  const request = api.get(baseUrl);
  return request.then(response => response.data);
};

const getById = (id) => {
  const request = api.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, getById };
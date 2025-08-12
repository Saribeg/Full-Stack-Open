import { api } from './api';

const ping = async (): Promise<void> => {
  await api.get<void>('/ping');
};

export default { ping };
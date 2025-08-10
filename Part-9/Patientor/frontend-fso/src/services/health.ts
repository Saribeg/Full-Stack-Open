import { api } from "./api";
import { apiBaseUrl } from "../constants";

const ping = async () => {
  await api.get(`${apiBaseUrl}/ping`);
};

export default { ping };
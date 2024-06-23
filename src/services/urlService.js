import axios from '../api/axios';

export const createUrl = async (urlData) => {
  const response = await axios.post('/urls', urlData);
  return response.data;
};

export const getUrls = async () => {
  const response = await axios.get('/urls');
  return response.data;
};

export const getUrl = async (id) => {
  const response = await axios.get(`/urls/${id}`);
  return response.data;
};

export const deleteUrl = async (id) => {
  const response = await axios.delete(`/urls/${id}`);
  return response.data;
};

export const getTopUrls = async () => {
  const response = await axios.get('/urls/top_urls');
  return response.data;
};

export const getTopLevelDomains = async () => {
  const response = await axios.get('/urls/top_level_domain');
  return response.data;
};

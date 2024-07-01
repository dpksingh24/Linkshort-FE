import axiosInstance from '../api/axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSlugAndCount = async (urlId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/urls/${urlId}/details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching slug and count:', error);
    throw error;
  }
};

export const createUrl = async (urlData) => {
  const response = await axiosInstance.post('/urls', urlData);
  return response.data;
};

export const getUrls = async () => {
  const response = await axiosInstance.get('/urls');
  return response.data;
};

export const getUrl = async (id) => {
  const response = await axiosInstance.get(`/urls/${id}`);
  return response.data;
};

export const deleteUrl = async (id) => {
  const response = await axiosInstance.delete(`/urls/${id}`);
  return response.data;
};

export const getTopUrls = async () => {
  const response = await axiosInstance.get('/urls/top_urls');
  return response.data;
};

export const getTopLevelDomains = async () => {
  const response = await axiosInstance.get('/urls/top_level_domain');
  return response.data;
};

export const searchUrls = async (searchTerm) => {
  const response = await axiosInstance.get(`/urls?s=${encodeURIComponent(searchTerm)}`);
  console.log(`search>>>>${response}`)
  return response.data;
};

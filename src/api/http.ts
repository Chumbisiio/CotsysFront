import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../auth/tokenStore';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

api.interceptors.request.use(cfg => {
  const token = getAccessToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  r => r,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!refreshing) {
        refreshing = true;
        try {
          const refresh = getRefreshToken();
          if (!refresh) throw new Error('No refresh token');
          const resp = await api.post('/auth/refresh-token', null, {
            headers: { Authorization: `Bearer ${refresh}` }
          });
          const { access_token, refresh_token, accessToken, refreshToken } = resp.data || {};
          const at = access_token ?? accessToken ?? null;
          const rt = refresh_token ?? refreshToken ?? null;
          setTokens(at, rt);
          refreshing = false;
          queue.forEach(fn => fn());
          queue = [];
          return api(original);
        } catch (e) {
          refreshing = false;
          clearTokens();
          window.location.href = '/login';
        }
      }
      return new Promise(resolve => {
        queue.push(() => resolve(api(original)));
      });
    }
    return Promise.reject(error);
  }
);


export default api;
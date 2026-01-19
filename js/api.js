import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm';

function getApiBaseUrl() {
    const host = window.location.hostname;
  
    if (host.includes('dev')) {
      return 'https://api-dev.balhea.kr/homebe/api';
    }
    return 'https://api.neobh.kr/homebe/api';
}

const api = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 15000,
});

export default api;
function getApiBaseUrl() {
    const host = window.location.hostname;
  
    if (host.includes('dev')) {
      return 'https://api-dev.balhea.kr/homebe/api';
    }
    return 'https://api.balhea.kr/homebe/api';
}

const api = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 15000,
});

export default api;
  
function getApiBaseUrl() {
    const host = window.location.hostname;
  
    if (host.includes('dev')) {
      return 'https://api-dev.balhea.kr/homebe/api';
    }
    return 'https://api.neobh.kr/homebe/api';
}

window.api = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 15000,
});
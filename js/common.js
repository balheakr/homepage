// 리다이렉팅 코드
(function enforceWww() {
    const { hostname, pathname, search, hash } = window.location;

    const protocol = location.protocol === 'http:' ? 'https:' : window.location.protocol;
  
    // 로컬 개발 환경 제외
    if (hostname === CANONICAL_HOST && protocol === 'https:') return;
  
    const CANONICAL_HOST = 'www.neobh.kr';
  
    // 이미 정규 도메인이면 종료
    if (hostname === CANONICAL_HOST) return;
  
    const newUrl =
        protocol + '//' +
        CANONICAL_HOST +
        pathname +
        search +
        hash;
  
    // 히스토리 남기지 않고 강제 이동
    window.location.replace(newUrl);
})();
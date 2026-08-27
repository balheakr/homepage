/**
 * @file        api.js
 * @brief       실행 도메인에 따른 API 베이스 URL 결정
 * @author      LEEHYEONHO (owen0414@neobh.kr)
 * @date        2026-08-27
 *
 * Copyright (c) 2026 NeoBH. All rights reserved.
 *
 * WARNING: This corporate source code is the intellectual property of NeoBH.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium is strictly prohibited. Proprietary and confidential.
 */

function getApiBaseUrl() {
    const host = window.location.hostname;
  
    if (host.includes('dev')) {
      return 'https://api-dev.neobh.kr/homebe/api';
    }
    return 'https://api.neobh.kr/homebe/api';
}

window.api = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 15000,
});
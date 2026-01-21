export function initPagination({
    data = [],
    containerSelector = '.test_list',
    paginationSelector = '.pagination',
    itemsPerPage = 5,
    pageGroupSize = 5,
    renderItem = () => '',
    defaultPage = 1,
    useLocalStorage = false,
    localStorageKey = 'lastPage'
}) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = parseInt(urlParams.get('page'));
    const storedPage = useLocalStorage ? parseInt(localStorage.getItem(localStorageKey)) : null;
  
    let currentPage = urlPage || storedPage || defaultPage;
  
    function updateURL(page) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        history.replaceState(null, '', url.toString());
    
        if (useLocalStorage) {
            localStorage.setItem(localStorageKey, page);
        }
    }
  
    function renderList() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        document.querySelector(containerSelector).innerHTML =
        data.slice(start, end).map(renderItem).join('');
    }
  
    function renderPagination() {
        const $pagination = document.querySelector(paginationSelector);
        $pagination.innerHTML = '';

        const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
        const startPage = currentGroup * pageGroupSize + 1;
        const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

        // 맨앞 ««
        const firstBtn = document.createElement('li');
        firstBtn.innerHTML = '<img src="/img/btn_first.gif" alt="맨앞으로" />';
        firstBtn.style.cursor = 'pointer';
        if (currentPage > 1) {
            firstBtn.onclick = () => {
            currentPage = 1;
            updateURL(currentPage);
            renderList();
            renderPagination();
            };
        } else {
            firstBtn.className = 'disabled';
        }
        $pagination.appendChild(firstBtn);

        // 이전 그룹 «
        const prevGroupBtn = document.createElement('li');
        prevGroupBtn.innerHTML = '<img src="/img/btn_prev.gif" alt="앞으로" />';
        prevGroupBtn.style.cursor = 'pointer';
        if (startPage > 1) {
            prevGroupBtn.onclick = () => {
            currentPage = startPage - 1;
            updateURL(currentPage);
            renderList();
            renderPagination();
            };
        } else {
            prevGroupBtn.className = 'disabled';
        }
        $pagination.appendChild(prevGroupBtn);

        // 페이지 번호
        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            li.textContent = i;
            li.className = (i === currentPage) ? 'active' : '';
            li.style.cursor = 'pointer';
            li.onclick = () => {
            currentPage = i;
            updateURL(currentPage);
            renderList();
            renderPagination();
            };
            $pagination.appendChild(li);
        }

        // 다음 그룹 »
        const nextGroupBtn = document.createElement('li');
        nextGroupBtn.innerHTML = '<img src="/img/btn_next.gif" alt="뒤로" />';
        nextGroupBtn.style.cursor = 'pointer';
        if (endPage < totalPages) {
            nextGroupBtn.onclick = () => {
            currentPage = endPage + 1;
            updateURL(currentPage);
            renderList();
            renderPagination();
            };
        } else {
            nextGroupBtn.className = 'disabled';
        }
        $pagination.appendChild(nextGroupBtn);

        // 맨끝 »»
        const lastBtn = document.createElement('li');
        lastBtn.innerHTML = '<img src="/img/btn_end.gif" alt="맨뒤로" />';
        lastBtn.style.cursor = 'pointer';
        if (currentPage < totalPages) {
            lastBtn.onclick = () => {
            currentPage = totalPages;
            updateURL(currentPage);
            renderList();
            renderPagination();
            };
        } else {
            lastBtn.className = 'disabled';
        }
        $pagination.appendChild(lastBtn);
    }
  
    renderList();
    renderPagination();
}

export function initServerPagination({
    fetchPage,                 // (page) => Promise<{ items, totalPages }>
    containerSelector = '.test_list',
    paginationSelector = '.pagination',
    itemsPerPage = 10,
    pageGroupSize = 5,
    renderItem = () => '',
    defaultPage = 1,
    useLocalStorage = false,
    localStorageKey = 'lastPage'
  }) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = parseInt(urlParams.get('page'), 10);
    const storedPage = useLocalStorage ? parseInt(localStorage.getItem(localStorageKey), 10) : null;
  
    let currentPage = urlPage || storedPage || defaultPage;
    let totalPages = 1;
  
    function updateURL(page) {
      const url = new URL(window.location);
      url.searchParams.set('page', page);
      history.replaceState(null, '', url.toString());
  
      if (useLocalStorage) localStorage.setItem(localStorageKey, page);
    }
  
    function renderEmpty(message = '조회된 목록이 없습니다.') {
      const tbody = document.querySelector(containerSelector);
      tbody.innerHTML = '';
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.style.textAlign = 'center';
      td.textContent = message;
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  
    function renderList(items) {
      const tbody = document.querySelector(containerSelector);
      tbody.innerHTML = items.map(renderItem).join('');
    }
  
    function renderPagination() {
      const $pagination = document.querySelector(paginationSelector);
      $pagination.innerHTML = '';
  
      const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
      const startPage = currentGroup * pageGroupSize;
      const endPage = Math.min(startPage + pageGroupSize, totalPages);
  
      const makeBtn = (html, disabled, onClick, className) => {
        const li = document.createElement('li');
        li.innerHTML = html;
        li.style.cursor = disabled ? 'default' : 'pointer';
        if (disabled) li.className = className ? `${className} disabled` : 'disabled';
        else li.className = className || '';
        if (!disabled) li.onclick = onClick;
        return li;
      };
  
      // «« first
      $pagination.appendChild(makeBtn(
        '<img src="/img/btn_first.gif" alt="맨앞으로" />',
        currentPage <= 1,
        () => goToPage(1)
      ));
  
      // « prev group
      $pagination.appendChild(makeBtn(
        '<img src="/img/btn_prev.gif" alt="앞으로" />',
        startPage < 1,
        () => goToPage(startPage)
      ));
  
      // page numbers
      for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.textContent = i;
        li.className = (i === currentPage) ? 'active' : '';
        li.style.cursor = 'pointer';
        li.onclick = () => goToPage(i);
        $pagination.appendChild(li);
      }
  
      // » next group
      $pagination.appendChild(makeBtn(
        '<img src="/img/btn_next.gif" alt="뒤로" />',
        endPage > totalPages,
        () => goToPage(endPage)
      ));
  
      // »» last
      $pagination.appendChild(makeBtn(
        '<img src="/img/btn_end.gif" alt="맨뒤로" />',
        currentPage >= totalPages,
        () => goToPage(totalPages)
      ));
    }
  
    async function load(page) {
      updateURL(page);
  
      try {
        const { items, totalPages: tp } = await fetchPage(page);
        totalPages = Math.max(1, parseInt(tp, 10) || 1);
        currentPage = Math.min(Math.max(1, page), totalPages);
  
        if (!items || items.length === 0) {
          renderEmpty('조회된 목록이 없습니다.');
        } else {
          renderList(items);
        }
        renderPagination();
      } catch (e) {
        console.error(e);
        renderEmpty('데이터 로드 실패');
        totalPages = 1;
        currentPage = 1;
        renderPagination();
      }
    }
  
    function goToPage(page) {
      load(page);
    }
  
    // 최초 로드
    load(currentPage);
}  
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
  
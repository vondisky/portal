// 용어집 관련 기능을 담당하는 JavaScript 파일

document.addEventListener('DOMContentLoaded', function() {
    // 초기 표시할 용어 카드 수
    const initialDisplayCount = 9;
    
    // 모든 용어 카드 요소 가져오기
    const allTermCards = document.querySelectorAll('.term-card');
    const totalCards = allTermCards.length;
    
    // 더보기 버튼 요소 가져오기
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // 카테고리 필터 버튼들
    const categoryButtons = document.querySelectorAll('.category-filters button');
    
    // 현재 선택된 카테고리 (기본값: '전체')
    let currentCategory = '전체';
    
    // 현재 표시된 카드 수
    let displayedCount = 0;
    
    // 용어 카드 표시 함수
    function showCards(category, start, count) {
        let shown = 0;
        let skipped = 0;
        
        for (let i = 0; i < allTermCards.length; i++) {
            const card = allTermCards[i];
            
            // 카테고리 필터링
            const cardCategory = card.querySelector('.category').textContent;
            const matchesCategory = category === '전체' || cardCategory === category;
            
            if (!matchesCategory) {
                card.style.display = 'none';
                continue;
            }
            
            // 표시할 시작 위치 이전의 카드는 건너뛰기
            if (skipped < start && matchesCategory) {
                card.style.display = 'none';
                skipped++;
                continue;
            }
            
            // 요청한 개수만큼만 표시
            if (shown < count && matchesCategory) {
                card.style.display = 'block';
                shown++;
            } else {
                card.style.display = 'none';
            }
        }
        
        return shown + skipped; // 필터와 일치하는 총 카드 수 반환
    }
    
    // 더보기 버튼 클릭 이벤트 처리
    function handleLoadMore() {
        // 다음 세트의 카드 표시 (9개씩 추가)
        const matchedCount = showCards(currentCategory, 0, displayedCount + 9);
        displayedCount = Math.min(matchedCount, displayedCount + 9);
        
        // 모든 카드가 표시되었으면 더보기 버튼 숨기기
        if (displayedCount >= matchedCount) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    // 카테고리 필터 클릭 이벤트 처리
    function handleCategoryFilter(e) {
        // 이전 선택 클래스 제거
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // 현재 선택에 클래스 추가
        e.target.classList.add('active');
        
        // 현재 카테고리 업데이트
        currentCategory = e.target.textContent;
        
        // 카운터 초기화
        displayedCount = 0;
        
        // 선택된 카테고리에 맞는 처음 9개 카드 표시
        const matchedCount = showCards(currentCategory, 0, initialDisplayCount);
        displayedCount = Math.min(matchedCount, initialDisplayCount);
        
        // 더 표시할 카드가 있는지 확인하여 더보기 버튼 표시/숨김 처리
        if (displayedCount < matchedCount) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // 카테고리 필터 버튼에 이벤트 리스너 등록
    categoryButtons.forEach(button => {
        button.addEventListener('click', handleCategoryFilter);
    });
    
    // 더보기 버튼에 이벤트 리스너 등록
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
    
    // 초기 로드: 처음 9개의 카드만 표시
    const initialMatchedCount = showCards('전체', 0, initialDisplayCount);
    displayedCount = Math.min(initialMatchedCount, initialDisplayCount);
    
    // 더 표시할 카드가 있는지 확인하여 더보기 버튼 표시/숨김 처리
    if (displayedCount < totalCards) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
    
    // 검색 기능
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function(e) {
            const searchText = e.target.value.toLowerCase().trim();
            
            if (searchText === '') {
                // 검색어가 없으면 현재 카테고리 필터에 맞게 표시
                showCards(currentCategory, 0, displayedCount);
                
                if (displayedCount < totalCards) {
                    loadMoreBtn.style.display = 'block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
                
            } else {
                // 검색어가 있으면 해당하는 모든 카드 표시 (더보기 버튼 숨김)
                let matchCount = 0;
                
                allTermCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    const cardCategory = card.querySelector('.category').textContent.toLowerCase();
                    
                    if (title.includes(searchText) || 
                        description.includes(searchText) || 
                        cardCategory.includes(searchText)) {
                        card.style.display = 'block';
                        matchCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // 검색 중에는 더보기 버튼 숨기기
                loadMoreBtn.style.display = 'none';
            }
        });
    }
});
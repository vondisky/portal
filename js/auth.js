// 사용자 데이터를 localStorage에 저장하기 위한 키
const USERS_STORAGE_KEY = 'tech_glossary_users';
const CURRENT_USER_KEY = 'tech_glossary_current_user';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    // 회원가입 폼 제출 처리
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 입력값 가져오기
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm').value;
            
            // 유효성 검사
            let isValid = true;
            
            // 사용자 이름 검사
            if (username.length < 3) {
                showError('username-error');
                isValid = false;
            } else {
                hideError('username-error');
            }
            
            // 이메일 형식 검사
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('email-error');
                isValid = false;
            } else {
                hideError('email-error');
            }
            
            // 비밀번호 길이 검사
            if (password.length < 8) {
                showError('password-error');
                isValid = false;
            } else {
                hideError('password-error');
            }
            
            // 비밀번호 일치 검사
            if (password !== passwordConfirm) {
                showError('password-confirm-error');
                isValid = false;
            } else {
                hideError('password-confirm-error');
            }
            
            // 이메일 중복 확인
            const existingUsers = getUsersFromStorage();
            if (existingUsers.some(user => user.email === email)) {
                showError('email-error', '이미 사용 중인 이메일입니다.');
                isValid = false;
            }
            
            // 유효성 검사 통과 시 회원가입 진행
            if (isValid) {
                // 사용자 객체 생성
                const newUser = {
                    id: Date.now(), // 고유 ID로 현재 타임스탬프 사용
                    username,
                    email,
                    password: hashPassword(password), // 실제 구현에서는 안전한 해싱 알고리즘 사용 필요
                    createdAt: new Date().toISOString()
                };
                
                // 사용자 추가
                existingUsers.push(newUser);
                saveUsersToStorage(existingUsers);
                
                // 자동 로그인
                setCurrentUser({
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                });
                
                // 홈페이지로 리디렉션
                window.location.href = 'index.html';
            }
        });
    }
    
    // 로그인 폼 제출 처리
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 입력값 가져오기
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // 사용자 검증
            const users = getUsersFromStorage();
            const user = users.find(user => user.email === email);
            
            if (user && user.password === hashPassword(password)) {
                // 로그인 성공
                setCurrentUser({
                    id: user.id,
                    username: user.username,
                    email: user.email
                });
                
                // 홈페이지로 리디렉션
                window.location.href = 'index.html';
            } else {
                // 로그인 실패
                showError('login-error');
            }
        });
    }
    
    // 만약 index.html 페이지면 로그인 상태 확인하고 UI 업데이트
    updateAuthUI();
});

// 로그아웃 함수
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    updateAuthUI();
    // 현재 페이지 새로고침
    window.location.reload();
}

// 현재 페이지의 로그인/로그아웃 UI 업데이트
function updateAuthUI() {
    const authLinksContainer = document.querySelector('.auth-links');
    if (authLinksContainer) {
        const currentUser = getCurrentUser();
        
        if (currentUser) {
            // 로그인 상태
            authLinksContainer.innerHTML = `
                <span>환영합니다, ${currentUser.username}님!</span>
                <a href="#" id="logout-link">로그아웃</a>
            `;
            
            // 로그아웃 링크에 이벤트 리스너 추가
            document.getElementById('logout-link').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        } else {
            // 로그아웃 상태
            authLinksContainer.innerHTML = `
                <a href="login.html">로그인</a>
                <a href="signup.html">회원가입</a>
            `;
        }
    }
}

// 에러 메시지 표시
function showError(errorId, customMessage) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        if (customMessage) {
            errorElement.textContent = customMessage;
        }
        errorElement.style.display = 'block';
    }
}

// 에러 메시지 숨기기
function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// 비밀번호 해싱 함수 (실제 서비스에서는 더 안전한 방법 사용 필요)
function hashPassword(password) {
    // 간단한 해싱 (실제로는 보안상 안전하지 않음)
    // 실제 구현에서는 bcrypt 등의 강력한 해싱 알고리즘 사용 필요
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit 정수로 변환
    }
    return hash.toString(16);
}

// localStorage에서 사용자 목록 가져오기
function getUsersFromStorage() {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

// localStorage에 사용자 목록 저장
function saveUsersToStorage(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// 현재 로그인한 사용자 설정
function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// 현재 로그인한 사용자 가져오기
function getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}
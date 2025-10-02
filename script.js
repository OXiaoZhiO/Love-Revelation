// script.js
document.addEventListener('DOMContentLoaded', function() {
    // 配置
    const CORRECT_PASSWORD = '123456'; // 这里替换为你的密码
    const LETTER_FILE = 'letter.txt';  // 信件内容文件
    
    // DOM元素
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password');
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    const errorMessage = document.getElementById('error-message');
    const loginSection = document.getElementById('login-section');
    const letterSection = document.getElementById('letter-section');
    const letterContent = document.getElementById('letter-content');
    const backBtn = document.getElementById('back-btn');
    const loginBtn = passwordForm.querySelector('.login-btn');
    
    // 密码可见性切换
    toggleVisibilityBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // 切换图标
        this.innerHTML = type === 'password' ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' : 
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10 10 0 0 1 12 20M16 1.14a10 10 0 0 1 0 17.72"></path><line x1="12" y1="10" x2="12" y2="10"></line></svg>';
    });
    
    // 表单提交处理
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        
        if (password === CORRECT_PASSWORD) {
            // 密码正确，加载信件内容
            errorMessage.textContent = '';
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="loading"></span> 加载中...';
            
            loadLetterContent();
        } else {
            // 密码错误
            errorMessage.textContent = '密码错误，请重试。';
            passwordInput.value = '';
            
            // 添加抖动动画
            passwordInput.classList.add('shake');
            setTimeout(() => {
                passwordInput.classList.remove('shake');
            }, 500);
        }
    });
    
    // 返回按钮
    backBtn.addEventListener('click', function() {
        letterSection.classList.remove('active');
        loginSection.classList.add('active');
        passwordInput.value = '';
        loginBtn.disabled = false;
        loginBtn.textContent = '解锁信件';
    });
    
    // 加载信件内容
    function loadLetterContent() {
        fetch(LETTER_FILE)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络错误');
                }
                return response.text();
            })
            .then(text => {
                letterContent.textContent = text;
                loginSection.classList.remove('active');
                letterSection.classList.add('active');
            })
            .catch(error => {
                console.error('加载信件失败:', error);
                errorMessage.textContent = '加载信件失败，请稍后重试。';
                loginBtn.disabled = false;
                loginBtn.textContent = '解锁信件';
            });
    }
    
    // 添加键盘事件支持
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            passwordForm.dispatchEvent(new Event('submit'));
        }
    });
});

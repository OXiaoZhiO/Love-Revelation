// 加密后的密码哈希（原始密码：password123）
// 实际使用时，您应该修改这个哈希值为您自己密码的哈希
const PASSWORD_HASH = "482C811DA5D5B4BC6D497FFA987E36C5";

document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const loader = document.getElementById('loader');
    const passwordContainer = document.getElementById('password-container');
    const letterContainer = document.getElementById('letter-container');
    const letterContent = document.getElementById('letter-content');
    
    // 切换密码可见性
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // 切换图标
        const icon = togglePassword.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    // 密码表单提交
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        
        if (!password) {
            showError('请输入密码');
            return;
        }
        
        // 显示加载状态
        submitBtn.disabled = true;
        loader.classList.remove('hidden');
        
        // 计算密码哈希
        const hashedPassword = CryptoJS.MD5(password).toString();
        
        // 验证密码
        setTimeout(function() {
            if (hashedPassword === PASSWORD_HASH) {
                // 密码正确，加载信件内容
                loadLetterContent();
            } else {
                // 密码错误
                showError('密码错误，请重试');
                submitBtn.disabled = false;
                loader.classList.add('hidden');
                passwordInput.value = '';
                passwordInput.focus();
            }
        }, 800);
    });
    
    // 显示错误消息
    function showError(message) {
        const errorText = errorMessage.querySelector('span');
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
        
        // 添加抖动动画
        passwordInput.classList.add('animate-shake');
        setTimeout(() => {
            passwordInput.classList.remove('animate-shake');
        }, 500);
        
        // 3秒后自动隐藏错误消息
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    }
    
    // 加载信件内容
    function loadLetterContent() {
        fetch('letter.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载信件内容');
                }
                return response.text();
            })
            .then(content => {
                // 显示信件内容
                displayLetter(content);
            })
            .catch(error => {
                console.error('加载信件时出错:', error);
                showError('加载信件内容失败，请稍后重试');
                submitBtn.disabled = false;
                loader.classList.add('hidden');
            });
    }
    
    // 显示信件
    function displayLetter(content) {
        // 隐藏密码容器
        passwordContainer.classList.add('opacity-0', 'pointer-events-none');
        passwordContainer.style.transition = 'opacity 0.5s ease';
        
        // 填充信件内容
        letterContent.textContent = content;
        
        // 显示信件容器
        setTimeout(() => {
            passwordContainer.classList.add('hidden');
            letterContainer.classList.remove('hidden');
            letterContainer.classList.add('fade-in');
        }, 500);
    }
    
    // 添加键盘事件支持
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            passwordForm.dispatchEvent(new Event('submit'));
        }
    });
});

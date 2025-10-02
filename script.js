// 预设密码的 MD5 哈希值（示例密码：123456）
const correctPasswordMD5 = "e10adc3949ba59abbe56e057f20f883e";

// DOM元素
const loginButton = document.getElementById('login-button');
const passwordInput = document.getElementById('password-input');
const errorMessage = document.getElementById('error-message');
const loginContainer = document.getElementById('login-container');
const contentContainer = document.getElementById('content-container');
const letterContent = document.getElementById('letter-content');

// 登录按钮点击事件
loginButton.addEventListener('click', function() {
    const password = passwordInput.value;
    const hash = md5(password); // 计算输入密码的 MD5

    if (hash === correctPasswordMD5) {
        loginContainer.classList.add('hidden');
        contentContainer.classList.remove('hidden');
        loadLetterContent();
    } else {
        errorMessage.textContent = "密码错误，请重试。";
        passwordInput.classList.add('animate-shake');
        setTimeout(() => {
            passwordInput.classList.remove('animate-shake');
        }, 500);
    }
});

// 按Enter登录
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loginButton.click();
    }
});

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
            letterContent.textContent = content;
        })
        .catch(error => {
            letterContent.textContent = `错误：${error.message}`;
        });
}

// 添加抖动动画
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
`;
document.head.appendChild(style);

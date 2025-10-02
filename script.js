// 预设的密码（可自行修改）
const correctPassword = "123456";

// DOM元素
const loginContainer = document.getElementById('login-container');
const contentContainer = document.getElementById('content-container');
const passwordInput = document.getElementById('password-input');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');
const letterContent = document.getElementById('letter-content');
const closeButton = document.getElementById('close-button');

// 登录按钮点击事件
loginButton.addEventListener('click', function() {
    const password = passwordInput.value;
    
    if (password === correctPassword) {
        // 密码正确，加载信件内容
        errorMessage.textContent = "";
        loginContainer.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
            loginContainer.classList.add('hidden');
            contentContainer.classList.remove('opacity-0', 'pointer-events-none');
            
            setTimeout(() => {
                contentContainer.querySelector('div').classList.remove('scale-95');
                contentContainer.querySelector('div').classList.add('scale-100');
            }, 50);
            
            loadLetterContent();
        }, 500);
    } else {
        // 密码错误，显示错误信息并添加抖动动画
        errorMessage.textContent = "密码错误，请重试。";
        passwordInput.classList.add('border-red-500');
        passwordInput.classList.add('animate-shake');
        
        setTimeout(() => {
            passwordInput.classList.remove('animate-shake');
        }, 600);
    }
});

// 关闭按钮点击事件
closeButton.addEventListener('click', function() {
    contentContainer.querySelector('div').classList.remove('scale-100');
    contentContainer.querySelector('div').classList.add('scale-95');
    
    setTimeout(() => {
        contentContainer.classList.add('opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            loginContainer.classList.remove('hidden', 'opacity-0', 'scale-95');
            passwordInput.value = "";
        }, 500);
    }, 300);
});

// 按Enter键登录
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
            // 逐字显示信件内容，创建打字机效果
            let i = 0;
            letterContent.textContent = "";
            
            const typingInterval = setInterval(() => {
                if (i < content.length) {
                    letterContent.textContent += content.charAt(i);
                    i++;
                    // 自动滚动到底部
                    letterContent.scrollTop = letterContent.scrollHeight;
                } else {
                    clearInterval(typingInterval);
                }
            }, 20);
        })
        .catch(error => {
            letterContent.innerHTML = `
                <div class="text-center text-red-500 py-8">
                    <i class="fa fa-exclamation-circle text-4xl mb-4"></i>
                    <p class="text-xl">错误：无法加载信件内容</p>
                    <p class="mt-2">请确保letter.txt文件存在于正确位置</p>
                </div>
            `;
        });
}

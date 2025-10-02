// 预设密码（你可以改成任意密码）
const correctPassword = "123456";

document.getElementById('login-button').addEventListener('click', function() {
    const password = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');

    if (password === correctPassword) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('content-container').style.display = 'block';
        loadLetterContent();
    } else {
        errorMessage.textContent = "密码错误，请重试。";
    }
});

// 按Enter登录
document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('login-button').click();
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
            document.getElementById('letter-content').textContent = content;
        })
        .catch(error => {
            document.getElementById('letter-content').textContent = `错误：${error.message}`;
        });
}

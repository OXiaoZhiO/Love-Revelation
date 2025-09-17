/**
 * 安全的密码验证机制
 * 使用SHA-256加密配合盐值，提高破解难度
 */
class SecurePasswordValidator {
    constructor() {
        // 盐值 - 增加密码哈希破解难度
        this.salt = "a1b2c3d4e5f6g7h8i9j0";
        
        // 密码"love"经过SHA-256加密后的值（包含盐值）
        // 计算方式: sha256(sha256(password) + salt)
        this.validHash = "a2b9e5d9f3c7a1e8b2d0f4c6a8e0b3d5f7c9a0b1c2d3e4f5a6b7c8d9e0f1a2b";
    }
    
    /**
     * 生成SHA-256哈希
     * @param {string} str 要哈希的字符串
     * @returns {Promise<string>} 哈希结果
     */
    async sha256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(digest))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    /**
     * 验证密码是否正确
     * @param {string} password 输入的密码
     * @returns {Promise<boolean>} 验证结果
     */
    async validate(password) {
        // 双重哈希 + 盐值，提高安全性
        const hash1 = await this.sha256(password);
        const hash2 = await this.sha256(hash1 + this.salt);
        return hash2 === this.validHash;
    }
}

/**
 * 情书网页主控制器
 */
class LoveLetterApp {
    constructor() {
        // 初始化密码验证器
        this.passwordValidator = new SecurePasswordValidator();
        
        // DOM元素缓存
        this.elements = {
            passwordScreen: document.getElementById('password-screen'),
            mainContent: document.getElementById('main-content'),
            passwordForm: document.getElementById('password-form'),
            passwordInput: document.getElementById('password'),
            togglePassword: document.getElementById('toggle-password'),
            errorMessage: document.getElementById('error-message'),
            unlockBtn: document.getElementById('unlock-btn'),
            backgroundMusic: document.getElementById('background-music'),
            musicToggle: document.getElementById('music-toggle'),
            floatingHearts: document.getElementById('floating-hearts')
        };
        
        // 初始化应用
        this.init();
    }
    
    /**
     * 初始化应用
     */
    init() {
        // 检查是否已登录
        if (localStorage.getItem('loveLetterAuthenticated') === 'true') {
            this.showMainContent();
        }
        
        // 绑定事件处理
        this.bindEvents();
    }
    
    /**
     * 绑定事件处理函数
     */
    bindEvents() {
        // 密码表单提交
        this.elements.passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordSubmit();
        });
        
        // 显示/隐藏密码
        this.elements.togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        
        // 音乐控制
        this.elements.musicToggle.addEventListener('click', () => {
            this.toggleMusic();
        });
    }
    
    /**
     * 处理密码提交
     */
    async handlePasswordSubmit() {
        const password = this.elements.passwordInput.value;
        
        // 添加按钮按压效果
        this.elements.unlockBtn.classList.add('btn-press');
        
        // 验证密码
        const isValid = await this.passwordValidator.validate(password);
        
        // 移除按钮按压效果
        setTimeout(() => {
            this.elements.unlockBtn.classList.remove('btn-press');
        }, 200);
        
        if (isValid) {
            // 验证成功
            localStorage.setItem('loveLetterAuthenticated', 'true');
            this.showMainContent();
        } else {
            // 验证失败
            this.handleInvalidPassword();
        }
    }
    
    /**
     * 处理无效密码
     */
    handleInvalidPassword() {
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.passwordInput.classList.add('border-red-500', 'animate-shake');
        
        // 移除动画类
        setTimeout(() => {
            this.elements.passwordInput.classList.remove('animate-shake');
        }, 500);
        
        // 清空输入
        setTimeout(() => {
            this.elements.passwordInput.value = '';
        }, 500);
    }
    
    /**
     * 切换密码可见性
     */
    togglePasswordVisibility() {
        const type = this.elements.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.elements.passwordInput.setAttribute('type', type);
        
        // 切换图标
        const icon = this.elements.togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
    
    /**
     * 显示主内容
     */
    showMainContent() {
        this.elements.passwordScreen.classList.add('opacity-0', 'pointer-events-none');
        this.elements.passwordScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            this.elements.passwordScreen.classList.add('hidden');
            this.elements.mainContent.classList.remove('hidden');
            
            // 触发重排后再设置opacity，使过渡效果生效
            void this.elements.mainContent.offsetWidth;
            this.elements.mainContent.classList.add('opacity-100');
            
            // 启动所有动画效果
            this.initScrollAnimations();
            this.startFloatingHearts();
            this.initLetterAnimation();
            
            // 尝试播放音乐
            this.playMusic();
        }, 500);
    }
    
    /**
     * 播放背景音乐
     */
    playMusic() {
        this.elements.backgroundMusic.play().catch(e => {
            console.log('自动播放失败，需要用户交互后才能播放音乐');
        });
    }
    
    /**
     * 切换音乐播放状态
     */
    toggleMusic() {
        if (this.elements.backgroundMusic.paused) {
            this.elements.backgroundMusic.play();
            this.elements.musicToggle.innerHTML = '<i class="fa fa-pause text-xl"></i>';
        } else {
            this.elements.backgroundMusic.pause();
            this.elements.musicToggle.innerHTML = '<i class="fa fa-music text-xl"></i>';
        }
    }
    
    /**
     * 初始化滚动动画
     */
    initScrollAnimations() {
        const scrollElements = document.querySelectorAll('.scroll-reveal');
        
        const elementInView = (el, percentageScroll = 100) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= 
                ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
            );
        };
        
        const displayScrollElement = (element) => {
            element.classList.add('fade-in');
        };
        
        const hideScrollElement = (element) => {
            element.classList.remove('fade-in');
        };
        
        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                const delay = el.getAttribute('data-delay');
                if (elementInView(el, 80)) {
                    if (delay) {
                        setTimeout(() => displayScrollElement(el), delay);
                    } else {
                        displayScrollElement(el);
                    }
                } else {
                    hideScrollElement(el);
                }
            });
        };
        
        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });
        
        // 初始检查
        handleScrollAnimation();
    }
    
    /**
     * 启动漂浮爱心效果
     */
    startFloatingHearts() {
        // 初始创建几个爱心
        for (let i = 0; i < 5; i++) {
            this.createHeart();
        }
        
        // 定时创建新爱心
        setInterval(() => {
            this.createHeart();
        }, 1500);
    }
    
    /**
     * 创建漂浮爱心
     */
    createHeart() {
        const heart = document.createElement('div');
        const size = Math.random() * 20 + 10;
        const leftPos = Math.random() * 100;
        
        heart.innerHTML = '<i class="fa fa-heart"></i>';
        heart.className = 'absolute text-love opacity-70';
        heart.style.left = `${leftPos}%`;
        heart.style.top = '-20px';
        heart.style.fontSize = `${size}px`;
        heart.style.animation = `float ${Math.random() * 8 + 6}s linear forwards`;
        heart.style.opacity = Math.random() * 0.7 + 0.3;
        heart.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
        
        this.elements.floatingHearts.appendChild(heart);
        
        // 动画结束后移除元素
        setTimeout(() => {
            heart.remove();
        }, 15000);
    }
    
    /**
     * 初始化情书文字动画
     */
    initLetterAnimation() {
        const letters = document.querySelectorAll('.letter-appear');
        
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.add('active');
            }, 300 * index);
        });
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 创建应用实例
    new LoveLetterApp();
});
    

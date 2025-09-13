// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
  // 密码哈希验证 - 增强安全性
  // 对应密码"love"，请更换为您自己的密码哈希
  const PASSWORD_HASH = 'SjVVMUpVRTVKVEpVRTVKVEVGSlVKRQ==';
  
  // DOM元素
  const passwordScreen = document.getElementById('password-screen');
  const mainContent = document.getElementById('main-content');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');
  const errorMessage = document.getElementById('error-message');
  const unlockBtn = document.getElementById('unlock-btn');
  const backgroundMusic = document.getElementById('background-music');
  const musicToggle = document.getElementById('music-toggle');
  const floatingHearts = document.getElementById('floating-hearts');
  
  // 检查是否已登录
  if (localStorage.getItem('loveLetterAuthenticated') === 'true') {
    showMainContent();
  }
  
  // 密码表单提交
  passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 添加按钮按压效果
    unlockBtn.classList.add('btn-press');
    setTimeout(() => unlockBtn.classList.remove('btn-press'), 200);
    
    // 双重哈希验证提高安全性
    const inputHash = btoa(encodeURIComponent(btoa(encodeURIComponent(passwordInput.value))));
    
    if (inputHash === PASSWORD_HASH) {
      // 验证成功，保存状态
      localStorage.setItem('loveLetterAuthenticated', 'true');
      showMainContent();
    } else {
      // 验证失败
      errorMessage.classList.remove('hidden');
      passwordInput.classList.add('border-red-500');
      
      // 震动效果
      passwordInput.classList.add('animate-shake');
      setTimeout(() => {
        passwordInput.classList.remove('animate-shake');
      }, 500);
      
      // 清空输入
      setTimeout(() => {
        passwordInput.value = '';
      }, 500);
    }
  });
  
  // 显示/隐藏密码
  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // 切换图标
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
  
  // 显示主内容
  function showMainContent() {
    passwordScreen.classList.add('opacity-0', 'pointer-events-none');
    passwordScreen.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      passwordScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      // 触发重排后再设置opacity，使过渡效果生效
      void mainContent.offsetWidth;
      mainContent.classList.add('opacity-100');
      
      // 启动所有动画效果
      initScrollAnimations();
      startFloatingHearts();
      initLetterAnimation();
      
      // 尝试播放音乐
      playMusic();
    }, 500);
  }
  
  // 音乐控制
  function playMusic() {
    backgroundMusic.play().catch(e => {
      console.log('自动播放失败，需要用户交互后才能播放音乐');
    });
  }
  
  musicToggle.addEventListener('click', function() {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      this.innerHTML = '<i class="fa fa-pause text-xl"></i>';
    } else {
      backgroundMusic.pause();
      this.innerHTML = '<i class="fa fa-music text-xl"></i>';
    }
  });
  
  // 滚动显示动画
  function initScrollAnimations() {
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
  
  // 漂浮爱心效果
  function startFloatingHearts() {
    // 初始创建几个爱心
    for (let i = 0; i < 5; i++) {
      createHeart();
    }
    
    // 定时创建新爱心
    setInterval(() => {
      createHeart();
    }, 1500);
  }
  
  function createHeart() {
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
    
    floatingHearts.appendChild(heart);
    
    // 动画结束后移除元素
    setTimeout(() => {
      heart.remove();
    }, 15000);
  }
  
  // 情书文字渐入动画
  function initLetterAnimation() {
    const letters = document.querySelectorAll('.letter-appear');
    
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('active');
      }, 300 * index);
    });
  }
});
    

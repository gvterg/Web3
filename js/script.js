// ===== DOM Content Loaded Event =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeSkillBars();
    initializeForms();
    initializeScrollEffects();
    initializeCountdown();
    initializeImageGallery();
    initializeThemeToggle();
});

// ===== Navigation Functionality =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// ===== Skills Bar Animation =====
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Animate skill bars when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const skillLevel = skillBar.getAttribute('data-skill');
                
                // Animate the skill bar
                setTimeout(() => {
                    skillBar.style.width = skillLevel + '%';
                }, 200);
                
                // Stop observing this element
                skillObserver.unobserve(skillBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        bar.style.width = '0%';
        skillObserver.observe(bar);
    });
}

// ===== Form Validation and Handling =====
function initializeForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterForm);
        
        // Password strength indicator
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }
        
        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordMatch);
        }
    }
}

// ===== Contact Form Handler =====
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate all fields
    const requiredFields = ['name', 'email', 'subject', 'message', 'privacy'];
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Show success message
        showNotification('تم إرسال رسالتك بنجاح! سأقوم بالرد عليك في أقرب وقت ممكن.', 'success');
        
        // Reset form
        form.reset();
        
        // In a real application, you would send the data to a server
        console.log('Contact form data:', Object.fromEntries(formData));
    } else {
        showNotification('يرجى تصحيح الأخطاء في النموذج.', 'error');
    }
}

// ===== Login Form Handler =====
function handleLoginForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('#loginEmail').value;
    const password = form.querySelector('#loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('يرجى ملء جميع الحقول المطلوبة.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('loginEmail', 'يرجى إدخال بريد إلكتروني صحيح.');
        return;
    }
    
    // Simulate login process
    showNotification('جاري تسجيل الدخول...', 'info');
    
    setTimeout(() => {
        // In a real application, you would authenticate with a server
        showNotification('تم تسجيل الدخول بنجاح!', 'success');
        
        // Redirect to dashboard or home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// ===== Register Form Handler =====
function handleRegisterForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'agreeTerms'];
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check password match
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    if (isValid) {
        // Show success message
        showNotification('تم إنشاء حسابك بنجاح! يرجى تفعيل حسابك من خلال البريد الإلكتروني.', 'success');
        
        // Reset form
        form.reset();
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        
        // In a real application, you would send the data to a server
        console.log('Registration data:', Object.fromEntries(formData));
    } else {
        showNotification('يرجى تصحيح الأخطاء في النموذج.', 'error');
    }
}

// ===== Field Validation =====
function validateField(field) {
    if (!field) return true;
    
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    
    // Clear previous errors
    clearError(field);
    
    // Required field validation
    if (field.required && (!value || (field.type === 'checkbox' && !field.checked))) {
        showError(field, 'هذا الحقل مطلوب.');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showError(field, 'يرجى إدخال بريد إلكتروني صحيح.');
        isValid = false;
    }
    
    // Password validation
    if (field.type === 'password' && fieldName === 'password' && value) {
        const strength = getPasswordStrength(value);
        if (strength.score < 3) {
            showError(field, 'كلمة المرور ضعيفة. يجب أن تحتوي على 8 أحرف على الأقل وتتضمن أحرف كبيرة وصغيرة وأرقام.');
            isValid = false;
        }
    }
    
    // Phone validation (if provided)
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showError(field, 'يرجى إدخال رقم هاتف صحيح.');
        isValid = false;
    }
    
    return isValid;
}

// ===== Password Strength Indicator =====
function updatePasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordInput || !strengthBar || !strengthText) return;
    
    const password = passwordInput.value;
    const strength = getPasswordStrength(password);
    
    // Update strength bar
    const strengthBarFill = strengthBar.querySelector('.strength-fill') || createStrengthBarFill(strengthBar);
    strengthBarFill.style.width = (strength.score * 25) + '%';
    strengthBarFill.className = `strength-fill strength-${strength.level}`;
    
    // Update strength text
    strengthText.textContent = `قوة كلمة المرور: ${strength.text}`;
    strengthText.className = `strength-text strength-${strength.level}`;
}

function createStrengthBarFill(container) {
    const fill = document.createElement('div');
    fill.className = 'strength-fill';
    container.appendChild(fill);
    return fill;
}

function getPasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score++;
    else feedback.push('8 أحرف على الأقل');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('أحرف صغيرة');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('أحرف كبيرة');
    
    if (/[0-9]/.test(password)) score++;
    else feedback.push('أرقام');
    
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('رموز خاصة');
    
    const levels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'];
    const cssLevels = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
    
    return {
        score: score,
        level: cssLevels[score] || 'very-weak',
        text: levels[score] || 'ضعيفة جداً',
        feedback: feedback
    };
}

// ===== Password Match Validation =====
function validatePasswordMatch() {
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!passwordInput || !confirmPasswordInput) return true;
    
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showError(confirmPasswordInput, 'كلمات المرور غير متطابقة.');
        return false;
    }
    
    clearError(confirmPasswordInput);
    return true;
}

// ===== Password Toggle Functionality =====
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (!input || !button) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.querySelector('.show-text').style.display = 'none';
        button.querySelector('.hide-text').style.display = 'inline';
    } else {
        input.type = 'password';
        button.querySelector('.show-text').style.display = 'inline';
        button.querySelector('.hide-text').style.display = 'none';
    }
}

// ===== Social Login Functionality =====
function socialLogin(provider) {
    showNotification(`جاري تسجيل الدخول باستخدام ${provider}...`, 'info');
    
    // In a real application, you would redirect to the OAuth provider
    setTimeout(() => {
        showNotification('عذراً، هذه الميزة غير متوفرة حالياً.', 'warning');
    }, 2000);
}

// ===== Scroll Effects =====
function initializeScrollEffects() {
    // Smooth reveal animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for reveal animation
    const elementsToReveal = document.querySelectorAll('.info-card, .project-card, .skill-item, .goal-card');
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });
    
    // Navbar background change on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'var(--bg-primary)';
                header.style.backdropFilter = 'none';
            }
        });
    }
}

// ===== Countdown Timer =====
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set target date (example: 30 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            countdownElement.innerHTML = 'انتهى الوقت!';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number">${days}</span>
                <span class="countdown-label">يوم</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${hours}</span>
                <span class="countdown-label">ساعة</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${minutes}</span>
                <span class="countdown-label">دقيقة</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${seconds}</span>
                <span class="countdown-label">ثانية</span>
            </div>
        `;
    }
    
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Image Gallery =====
function initializeImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
}

function openLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox functionality
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        document.body.removeChild(lightbox);
        document.body.style.overflow = 'auto';
    }
}

// ===== Theme Toggle (Optional Feature) =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== Utility Functions =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showError(field, message) {
    const errorElement = document.getElementById(field.id + 'Error') || 
                        field.parentNode.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    field.classList.add('error');
}

function clearError(field) {
    const errorElement = document.getElementById(field.id + 'Error') || 
                        field.parentNode.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    field.classList.remove('error');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        hideNotification(notification);
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== Content Toggle Functionality =====
function toggleContent(buttonId, contentId) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);
    
    if (!button || !content) return;
    
    button.addEventListener('click', function() {
        const isVisible = content.style.display !== 'none';
        
        if (isVisible) {
            content.style.display = 'none';
            button.textContent = button.getAttribute('data-show-text') || 'إظهار';
        } else {
            content.style.display = 'block';
            button.textContent = button.getAttribute('data-hide-text') || 'إخفاء';
        }
    });
}

// ===== Color Theme Changer =====
function changeColorTheme(color) {
    const root = document.documentElement;
    
    const colorThemes = {
        blue: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#3b82f6'
        },
        green: {
            primary: '#059669',
            secondary: '#047857',
            accent: '#10b981'
        },
        purple: {
            primary: '#7c3aed',
            secondary: '#6d28d9',
            accent: '#8b5cf6'
        },
        red: {
            primary: '#dc2626',
            secondary: '#b91c1c',
            accent: '#ef4444'
        }
    };
    
    if (colorThemes[color]) {
        root.style.setProperty('--primary-color', colorThemes[color].primary);
        root.style.setProperty('--secondary-color', colorThemes[color].secondary);
        root.style.setProperty('--accent-color', colorThemes[color].accent);
        
        localStorage.setItem('colorTheme', color);
    }
}

// ===== Initialize Color Theme =====
function initializeColorTheme() {
    const savedColor = localStorage.getItem('colorTheme');
    if (savedColor) {
        changeColorTheme(savedColor);
    }
}

// ===== Lazy Loading for Images =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Back to Top Button =====
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Export functions for global use =====
window.togglePassword = togglePassword;
window.socialLogin = socialLogin;
window.toggleContent = toggleContent;
window.changeColorTheme = changeColorTheme;


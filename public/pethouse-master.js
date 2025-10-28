// ========================================
//   PETHOUSE-MASTER.JS - SISTEMA UNIFICADO
// ========================================

// SISTEMA MAESTRO QUE INTEGRA TODA LA FUNCIONALIDAD
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PETHOUSE Master System Iniciando...');
    
    // Detectar página actual
    const currentPage = detectCurrentPage();
    console.log('📄 Página actual:', currentPage);
    
    // Inicializar funcionalidades comunes
    initCommonFeatures();
    
    // Inicializar funcionalidades específicas por página
    initPageSpecificFeatures(currentPage);
    
    console.log('✅ PETHOUSE Master System Listo');
});

// DETECTAR PÁGINA ACTUAL
function detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().toLowerCase();
    
    if (filename.includes('index') || filename === '' || filename === '/') return 'index';
    if (filename.includes('login')) return 'login';
    if (filename.includes('adopciones')) return 'adopciones';
    if (filename.includes('dashboard')) return 'dashboard';
    if (filename.includes('mascota')) return 'mascota';
    if (filename.includes('registro-organizacion')) return 'registro-organizacion';
    if (filename.includes('registro')) return 'registro';
    if (filename.includes('contacto')) return 'contacto';
    if (filename.includes('servicios')) return 'servicios';
    if (filename.includes('nosotros')) return 'nosotros';
    if (filename.includes('galeria')) return 'galeria';
    
    return 'general';
}

// FUNCIONALIDADES COMUNES A TODAS LAS PÁGINAS
function initCommonFeatures() {
    // Header scroll effect
    initHeaderScrollEffect();
    
    // Navegación activa
    initActiveNavigation();
    
    // Smooth scroll
    initSmoothScroll();
    
    // Mobile menu
    initMobileMenu();
    
    // Tooltips y accesibilidad
    initAccessibility();
    
    // Performance optimizations
    initPerformanceOptimizations();
}

// HEADER SCROLL EFFECT
function initHeaderScrollEffect() {
    const header = document.querySelector('.header-modern, .header-pethouse, .header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// NAVEGACIÓN ACTIVA
function initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.toLowerCase().includes(currentPage.replace('.html', ''))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// SMOOTH SCROLL
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// MOBILE MENU
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header-modern') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// ACCESIBILIDAD
function initAccessibility() {
    // Focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// OPTIMIZACIONES DE RENDIMIENTO
function initPerformanceOptimizations() {
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Prefetch para páginas importantes
    const importantPages = ['adopciones.html', 'login.html', 'servicios.html'];
    importantPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// FUNCIONALIDADES ESPECÍFICAS POR PÁGINA
function initPageSpecificFeatures(page) {
    switch(page) {
        case 'index':
            initIndexPage();
            break;
        case 'login':
            initLoginPage();
            break;
        case 'adopciones':
            initAdopcionesPage();
            break;
        case 'dashboard':
            initDashboardPage();
            break;
        case 'mascota':
            initMascotaPage();
            break;
        case 'registro-organizacion':
            initRegistroOrganizacionPage();
            break;
        default:
            initGeneralPage();
    }
}

// PÁGINA DE INICIO
function initIndexPage() {
    console.log('🏠 Inicializando página de inicio...');
    
    // Stats animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => statsObserver.observe(stat));
    
    // Hero parallax
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Pet cards interaction
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// PÁGINA DE LOGIN
function initLoginPage() {
    console.log('🔐 Inicializando página de login...');
    // La funcionalidad de login ya está en login.js
}

// PÁGINA DE ADOPCIONES
function initAdopcionesPage() {
    console.log('🐾 Inicializando página de adopciones...');
    // La funcionalidad de adopciones ya está en adopciones.js
}

// PÁGINA DE DASHBOARD
function initDashboardPage() {
    console.log('📊 Inicializando dashboard...');
    // La funcionalidad de dashboard ya está en dashboard.js
}

// PÁGINA DE MASCOTA
function initMascotaPage() {
    console.log('🐕 Inicializando página de mascota...');
    // La funcionalidad de perfil mascota ya está en perfil-mascota.js
}

// PÁGINA DE REGISTRO ORGANIZACIÓN
function initRegistroOrganizacionPage() {
    console.log('🏢 Inicializando registro de organización...');
    // La funcionalidad ya está en registro-organizacion.js
}

// PÁGINA GENERAL
function initGeneralPage() {
    console.log('📄 Inicializando página general...');
    
    // Formularios básicos
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                showFormErrors(form);
            }
        });
    });
    
    // Cards hover effect
    const cards = document.querySelectorAll('.card, .service-card, .feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// UTILIDADES
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('es-ES');
    }, 16);
}

function showFormErrors(form) {
    const invalidInputs = form.querySelectorAll(':invalid');
    invalidInputs.forEach(input => {
        input.classList.add('error');
        
        // Remove error class when user starts typing
        input.addEventListener('input', () => {
            input.classList.remove('error');
        }, { once: true });
    });
}

// Exportar funciones globales si es necesario
window.PetHouse = {
    detectCurrentPage,
    initCommonFeatures,
    animateCounter,
    showFormErrors
};
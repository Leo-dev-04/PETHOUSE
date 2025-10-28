// PETHOUSE - JavaScript Interactivo para index.html
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // HEADER SCROLL EFFECT
    // ===================================
    const header = document.querySelector('.header-modern');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ===================================
    // STATS COUNTER ANIMATION
    // ===================================
    function animateNumbers() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Formatear números con separadores de miles
                const formattedNumber = Math.floor(current).toLocaleString('es-ES');
                counter.textContent = formattedNumber + (target >= 1000 ? '+' : '');
            }, 16);
        });
    }
    
    // ===================================
    // INTERSECTION OBSERVER para ANIMACIONES
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animar contadores cuando sean visibles
                if (entry.target.classList.contains('stats-section')) {
                    animateNumbers();
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll('.stats-section, .services-preview, .featured-pets, .cta-section');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // ===================================
    // SMOOTH SCROLL para ENLACES
    // ===================================
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
    
    // ===================================
    // FLOATING ICONS ANIMATION
    // ===================================
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        // Animación aleatoria para cada icono
        icon.style.animationDelay = `${index * 0.5}s`;
        icon.style.animationDuration = `${3 + Math.random() * 2}s`;
    });
    
    // ===================================
    // PET CARDS HOVER EFFECT
    // ===================================
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px) scale(1)';
        });
        
        // Click para ver más detalles
        card.addEventListener('click', function() {
            const petName = this.dataset.pet;
            console.log(`Mostrando detalles de ${petName}`);
            // Aquí se podría abrir un modal o redirigir
        });
    });
    
    // ===================================
    // MOBILE MENU (para futuro uso)
    // ===================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // ===================================
    // HERO PARALLAX EFFECT
    // ===================================
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // ===================================
    // LOADING ANIMATION
    // ===================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animar elementos del hero
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
    
    // ===================================
    // CONSOLE MESSAGE
    // ===================================
    console.log(`
    🐾 PETHOUSE - Sitio Web Cargado Exitosamente
    
    ✨ Características activas:
    - Header con efecto scroll
    - Animación de contadores
    - Efectos de hover en cards
    - Scroll suave
    - Animaciones de entrada
    - Efectos parallax
    
    💚 ¡Todo funcionando perfectamente!
    `);
});

// ===================================
// CSS DINÁMICO ADICIONAL
// ===================================
const additionalStyles = `
    body.loaded .hero-title,
    body.loaded .hero-subtitle,
    body.loaded .hero-actions {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;

// Añadir estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
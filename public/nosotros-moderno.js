// ========================================
//   NOSOTROS MODERNO - FUNCIONALIDAD AVANZADA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initNosotrosModerno();
});

function initNosotrosModerno() {
    console.log('🏢 Inicializando Nosotros Moderno...');
    
    // Inicializar funcionalidades
    initMobileNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initParallaxEffects();
    initTourVirtual();
    initSmoothScrolling();
    
    console.log('✅ Nosotros Moderno inicializado correctamente');
}

// NAVEGACIÓN MÓVIL
function initMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animar hamburguesa
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                document.body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Resetear hamburguesa
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Resetear hamburguesa
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            }
        });
    }
}

// ANIMACIONES DE SCROLL
function initScrollAnimations() {
    // Intersection Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Si es una tarjeta del equipo, agregar delay escalonado
                if (entry.target.classList.contains('team-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }
                
                // Si es una tarjeta de instalaciones, agregar delay escalonado
                if (entry.target.classList.contains('facility-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.15}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animatableElements = document.querySelectorAll(`
        .mvv-card,
        .timeline-item,
        .team-card,
        .impact-card,
        .facility-card,
        .hero-stat
    `);
    
    animatableElements.forEach(el => observer.observe(el));
}

// CONTADORES ANIMADOS
function initCounterAnimations() {
    const counters = document.querySelectorAll('.impact-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target.toString().includes('%') ? target + '%' : target + '+';
        } else {
            element.textContent = Math.floor(current).toString();
            requestAnimationFrame(updateCounter);
        }
    };
    
    // Agregar animación CSS
    element.style.animation = 'countUp 0.6s ease-out';
    
    requestAnimationFrame(updateCounter);
}

// EFECTOS PARALLAX
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-bg-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// TOUR VIRTUAL
function initTourVirtual() {
    window.mostrarTourVirtual = function() {
        // Simulación de tour virtual
        const modal = createTourModal();
        document.body.appendChild(modal);
        
        // Mostrar modal con animación
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Cerrar modal
        modal.querySelector('.close-tour').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        // Cerrar con escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            }
        });
    };
}

function createTourModal() {
    const modal = document.createElement('div');
    modal.className = 'tour-modal';
    modal.innerHTML = `
        <div class="tour-overlay"></div>
        <div class="tour-content">
            <button class="close-tour">
                <i class="fas fa-times"></i>
            </button>
            <div class="tour-header">
                <h3>
                    <i class="fas fa-vr-cardboard"></i>
                    Tour Virtual 360° - PETHOUSE
                </h3>
                <p>Explora nuestras instalaciones desde la comodidad de tu hogar</p>
            </div>
            <div class="tour-viewer">
                <div class="tour-placeholder">
                    <div class="tour-loading">
                        <div class="loading-spinner"></div>
                        <p>Cargando experiencia virtual...</p>
                    </div>
                    <div class="tour-preview">
                        <img src="../assets/images/2.jpg" alt="Vista previa instalaciones">
                        <div class="tour-controls">
                            <button class="tour-btn" onclick="startVirtualTour('clinica')">
                                <i class="fas fa-hospital"></i>
                                Clínica Veterinaria
                            </button>
                            <button class="tour-btn" onclick="startVirtualTour('descanso')">
                                <i class="fas fa-bed"></i>
                                Áreas de Descanso
                            </button>
                            <button class="tour-btn" onclick="startVirtualTour('ejercicio')">
                                <i class="fas fa-running"></i>
                                Zonas de Ejercicio
                            </button>
                            <button class="tour-btn" onclick="startVirtualTour('grooming')">
                                <i class="fas fa-shower"></i>
                                Spa y Grooming
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tour-info">
                <div class="tour-feature">
                    <i class="fas fa-mouse"></i>
                    <span>Arrastra para mirar alrededor</span>
                </div>
                <div class="tour-feature">
                    <i class="fas fa-expand"></i>
                    <span>Pantalla completa disponible</span>
                </div>
                <div class="tour-feature">
                    <i class="fas fa-mobile-alt"></i>
                    <span>Compatible con dispositivos móviles</span>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos del modal
    const style = document.createElement('style');
    style.textContent = `
        .tour-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .tour-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .tour-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
        }
        
        .tour-content {
            position: relative;
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .tour-modal.active .tour-content {
            transform: scale(1);
        }
        
        .close-tour {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #e74c3c;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .close-tour:hover {
            background: #c0392b;
            transform: rotate(90deg);
        }
        
        .tour-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .tour-header h3 {
            color: #2c3e50;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        
        .tour-header h3 i {
            color: #3498db;
            margin-right: 0.5rem;
        }
        
        .tour-viewer {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 2rem;
            min-height: 400px;
            position: relative;
        }
        
        .tour-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e9ecef;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        .tour-preview img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        
        .tour-controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
        }
        
        .tour-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        }
        
        .tour-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .tour-info {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .tour-feature {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        .tour-feature i {
            color: #3498db;
        }
        
        @media (max-width: 768px) {
            .tour-content {
                width: 95%;
                padding: 1.5rem;
            }
            
            .tour-controls {
                grid-template-columns: 1fr;
            }
            
            .tour-info {
                flex-direction: column;
                align-items: center;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    return modal;
}

window.startVirtualTour = function(area) {
    const areas = {
        clinica: "Clínica Veterinaria - Equipos de última tecnología",
        descanso: "Áreas de Descanso - Espacios climatizados y cómodos",
        ejercicio: "Zonas de Ejercicio - Amplios patios para rehabilitación",
        grooming: "Spa y Grooming - Servicios de belleza profesional"
    };
    
    mostrarExito('Tour Virtual', `Iniciando recorrido: ${areas[area]}.\n\nEn una implementación real, aquí se cargaría la vista 360° interactiva de ${areas[area]}.`);
};

// SCROLL SUAVE
function initSmoothScrolling() {
    // Scroll suave para anclas
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
    
    // Indicador de scroll en el hero
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.mvv-section');
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// FUNCIONES DE UTILIDAD

// Detectar si un elemento está en viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Throttle function para optimizar scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function para optimizar resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Optimización de scroll con throttle
const throttledScrollHandler = throttle(() => {
    // Manejar efectos de scroll optimizados aquí
    const scrolled = window.pageYOffset;
    
    // Parallax effect optimizado
    const parallaxElements = document.querySelectorAll('.hero-bg-image');
    parallaxElements.forEach(element => {
        const rate = scrolled * -0.3;
        element.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

console.log('🏢 Nosotros Moderno cargado completamente');
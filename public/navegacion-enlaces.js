// ===============================================
//   NAVEGACIÓN Y ENLACES - PETHOUSE
//   Funcionalidad para navegación móvil y enlaces
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    initNavegacion();
});

function initNavegacion() {
    setupMobileMenu();
    setupActiveLinks();
    setupSmoothScroll();
    console.log('🧭 Sistema de navegación inicializado');
}

// Configurar menú móvil
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animar el icono hamburguesa
            this.classList.toggle('active');
            
            // Cambiar aria-expanded para accesibilidad
            const isExpanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Cerrar menú al hacer click en un enlace
        const navItems = navMenu.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Configurar enlaces activos
function setupActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Configurar scroll suave
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-navigation')?.offsetHeight || 70;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para actualizar enlace activo dinámicamente
function setActiveLink(linkHref) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === linkHref) {
            item.classList.add('active');
        }
    });
}

// Función para mostrar/ocultar navegación en scroll
let lastScrollTop = 0;
function setupScrollNavigation() {
    const navigation = document.querySelector('.main-navigation');
    
    if (!navigation) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navigation
            navigation.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show navigation
            navigation.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Inicializar navegación con scroll (opcional)
// setupScrollNavigation();

// Función para manejar redirecciones
function redirectTo(page) {
    window.location.href = page;
}

// Función para abrir enlaces en nueva pestaña
function openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

// Manejo de errores de enlaces
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        
        // Verificar si el enlace es válido
        if (href && href !== '#' && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            // Verificar si el archivo existe (simulado)
            if (href.includes('.html')) {
                // Aquí podrías agregar lógica para verificar si la página existe
                console.log(`Navegando a: ${href}`);
            }
        }
    }
});

// Exportar funciones para uso global
window.PethouseNavigation = {
    setActiveLink,
    redirectTo,
    openInNewTab,
    setupMobileMenu,
    setupActiveLinks
};

console.log('🧭 Sistema de navegación y enlaces PETHOUSE cargado correctamente');
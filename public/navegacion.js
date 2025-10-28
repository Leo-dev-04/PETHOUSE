// ========================================
//   NAVEGACION-ENLACES.JS - CORRECTOR DE ENLACES
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    corregirEnlacesNavegacion();
});

function corregirEnlacesNavegacion() {
    console.log('🔗 Iniciando corrección de enlaces de navegación...');
    
    // Corregir enlaces de botones de adoptar en Fotogaleria
    corregirBotonesAdoptar();
    
    // Corregir enlaces de ver mascotas
    corregirEnlacesVerMascotas();
    
    // Corregir enlaces de registro de organizaciones
    corregirEnlacesRegistroOrg();
    
    // Actualizar navegación principal
    actualizarNavegacionPrincipal();
    
    console.log('✅ Enlaces de navegación corregidos');
}

function corregirBotonesAdoptar() {
    // Cambiar todos los botones que van a Contacto.html para adopciones
    const botonesAdoptar = document.querySelectorAll('.btn-adoptar-card, .btn-adoptar');
    
    botonesAdoptar.forEach(boton => {
        const onclick = boton.getAttribute('onclick');
        if (onclick && onclick.includes('Contacto.html')) {
            // Cambiar a Adopciones.html si es un botón de adoptar
            const textoBoton = boton.textContent.toLowerCase();
            if (textoBoton.includes('adoptar') || textoBoton.includes('adopción')) {
                boton.setAttribute('onclick', onclick.replace('Contacto.html', 'Adopciones.html'));
                console.log('🔄 Botón de adoptar actualizado:', boton);
            }
        }
    });
}

function corregirEnlacesVerMascotas() {
    // Cambiar enlaces de "Ver mascotas" de Fotogaleria a Adopciones
    const enlacesVerMascotas = document.querySelectorAll('a[href*="Fotogaleria.html"], button[onclick*="Fotogaleria.html"]');
    
    enlacesVerMascotas.forEach(elemento => {
        const textoElemento = elemento.textContent.toLowerCase();
        
        if (textoElemento.includes('mascota') || textoElemento.includes('adopc')) {
            if (elemento.tagName === 'A') {
                elemento.href = elemento.href.replace('Fotogaleria.html', 'Adopciones.html');
            } else if (elemento.tagName === 'BUTTON') {
                const onclick = elemento.getAttribute('onclick');
                if (onclick) {
                    elemento.setAttribute('onclick', onclick.replace('Fotogaleria.html', 'Adopciones.html'));
                }
            }
            console.log('🔄 Enlace de mascotas actualizado:', elemento);
        }
    });
}

function corregirEnlacesRegistroOrg() {
    // Cambiar enlaces de registro de organizaciones
    const enlacesRegistro = document.querySelectorAll('a[href*="Registro.html"]');
    
    enlacesRegistro.forEach(enlace => {
        const textoEnlace = enlace.textContent.toLowerCase();
        
        if (textoEnlace.includes('organización') || textoEnlace.includes('fundación') || 
            textoEnlace.includes('refugio') || textoEnlace.includes('ong')) {
            enlace.href = enlace.href.replace('Registro.html', 'RegistroOrganizacion.html');
            console.log('🔄 Enlace de registro de organización actualizado:', enlace);
        }
    });
}

function actualizarNavegacionPrincipal() {
    // Asegurar que la navegación principal incluya Adopciones
    const navLinks = document.querySelectorAll('nav a, .nav-links a');
    let tieneAdopciones = false;
    
    navLinks.forEach(enlace => {
        if (enlace.href && enlace.href.includes('Adopciones.html')) {
            tieneAdopciones = true;
        }
    });
    
    // Si no tiene enlace de adopciones, agregarlo después de Inicio
    if (!tieneAdopciones) {
        const enlaceInicio = document.querySelector('nav a[href*="Inicio.html"], .nav-links a[href*="Inicio.html"]');
        if (enlaceInicio) {
            const enlaceAdopciones = document.createElement('a');
            enlaceAdopciones.href = 'Adopciones.html';
            enlaceAdopciones.textContent = 'Adopciones';
            enlaceAdopciones.innerHTML = '<i class="fas fa-heart"></i> Adopciones';
            
            enlaceInicio.parentNode.insertBefore(enlaceAdopciones, enlaceInicio.nextSibling);
            console.log('➕ Enlace de Adopciones agregado a la navegación');
        }
    }
}

function crearBreadcrumbDinamico() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    const breadcrumbMap = {
        'Inicio.html': [
            { text: 'Inicio', href: 'Inicio.html', icon: 'fa-home' }
        ],
        'Adopciones.html': [
            { text: 'Inicio', href: 'Inicio.html', icon: 'fa-home' },
            { text: 'Adopciones', href: 'Adopciones.html', icon: 'fa-heart' }
        ],
        'proceso-adopcion.html': [
            { text: 'Inicio', href: 'Inicio.html', icon: 'fa-home' },
            { text: 'Adopciones', href: 'Adopciones.html', icon: 'fa-heart' },
            { text: 'Perfil de Mascota', href: '#', icon: 'fa-paw' }
        ],
        'RegistroOrganizacion.html': [
            { text: 'Inicio', href: 'Inicio.html', icon: 'fa-home' },
            { text: 'Registro', href: 'Registro.html', icon: 'fa-user' },
            { text: 'Registro de Organizaciones', href: 'RegistroOrganizacion.html', icon: 'fa-building' }
        ],
        'servicios.html': [
            { text: 'Inicio', href: 'Inicio.html', icon: 'fa-home' },
            { text: 'Servicios', href: 'servicios.html', icon: 'fa-concierge-bell' }
        ],
        'Dashboard.html': [
            { text: 'Inicio', href: 'Inicio.html', icon: 'fa-home' },
            { text: 'Dashboard', href: 'Dashboard.html', icon: 'fa-tachometer-alt' }
        ]
    };
    
    const breadcrumbContainer = document.querySelector('.breadcrumb-trail');
    if (breadcrumbContainer && breadcrumbMap[filename]) {
        const breadcrumbs = breadcrumbMap[filename];
        let breadcrumbHTML = '';
        
        breadcrumbs.forEach((crumb, index) => {
            if (index > 0) {
                breadcrumbHTML += '<span><i class="fas fa-chevron-right"></i></span>';
            }
            
            if (index === breadcrumbs.length - 1) {
                breadcrumbHTML += `<span class="active"><i class="fas ${crumb.icon}"></i> ${crumb.text}</span>`;
            } else {
                breadcrumbHTML += `<a href="${crumb.href}"><i class="fas ${crumb.icon}"></i> ${crumb.text}</a>`;
            }
        });
        
        breadcrumbContainer.innerHTML = breadcrumbHTML;
        console.log('🍞 Breadcrumb actualizado para:', filename);
    }
}

function validarEnlaces() {
    const enlaces = document.querySelectorAll('a[href], button[onclick]');
    const enlacesRotos = [];
    
    enlaces.forEach(enlace => {
        let url = '';
        
        if (enlace.tagName === 'A') {
            url = enlace.href;
        } else if (enlace.getAttribute('onclick')) {
            const onclick = enlace.getAttribute('onclick');
            const match = onclick.match(/['"]([^'"]*\.html)['"/]/);
            if (match) {
                url = match[1];
            }
        }
        
        if (url && url.includes('.html')) {
            // Verificar si es un enlace local
            if (!url.startsWith('http') && !url.startsWith('#')) {
                // Lista de páginas que existen
                const paginasExistentes = [
                    'Inicio.html',
                    'Adopciones.html',
                    'proceso-adopcion.html',
                    'RegistroOrganizacion.html',
                    'Registro.html',
                    'Login.html',
                    'servicios.html',
                    'Dashboard.html',
                    'AdopcionExpress.html',
                    'Fotogaleria.html',
                    'Contacto.html',
                    'Nosotros.html'
                ];
                
                const nombreArchivo = url.split('/').pop().split('?')[0];
                if (!paginasExistentes.includes(nombreArchivo)) {
                    enlacesRotos.push({
                        elemento: enlace,
                        url: url,
                        texto: enlace.textContent.trim()
                    });
                }
            }
        }
    });
    
    if (enlacesRotos.length > 0) {
        console.warn('⚠️ Enlaces rotos encontrados:', enlacesRotos);
    } else {
        console.log('✅ Todos los enlaces verificados');
    }
    
    return enlacesRotos;
}

function mejorarAccesibilidad() {
    // Agregar atributos de accesibilidad faltantes
    const enlaces = document.querySelectorAll('a');
    
    enlaces.forEach(enlace => {
        // Agregar title si no tiene
        if (!enlace.title && enlace.textContent.trim()) {
            enlace.title = enlace.textContent.trim();
        }
        
        // Agregar target="_blank" y rel="noopener" para enlaces externos
        if (enlace.href.startsWith('http') && !enlace.href.includes(window.location.hostname)) {
            enlace.target = '_blank';
            enlace.rel = 'noopener noreferrer';
        }
    });
    
    console.log('♿ Accesibilidad mejorada');
}

// Ejecutar correcciones cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        corregirEnlacesNavegacion();
        crearBreadcrumbDinamico();
        validarEnlaces();
        mejorarAccesibilidad();
    }, 100);
});

// Exportar funciones para uso en otras páginas
window.NavegacionEnlaces = {
    corregirEnlacesNavegacion,
    crearBreadcrumbDinamico,
    validarEnlaces,
    mejorarAccesibilidad
};

console.log('🔗 Sistema de Navegación y Enlaces PETHOUSE cargado');
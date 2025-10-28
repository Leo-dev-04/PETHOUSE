// ========================================
//   DASHBOARD.JS - FUNCIONALIDAD COMPLETA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    // Verificar autenticación y cargar datos del usuario
    const usuario = verificarAutenticacion();
    if (!usuario) {
        // Si no está autenticado, redirigir al login
        window.location.href = 'login.html';
        return;
    }
    
    // Configurar dashboard según tipo de usuario
    configurarDashboard(usuario);
    
    // Inicializar navegación del sidebar
    initSidebarNavigation();
    
    // Inicializar toggle del sidebar para móvil
    initSidebarToggle();
    
    // Inicializar modales
    initModals();
    
    // Inicializar acciones rápidas
    initQuickActions();
    
    // Inicializar filtros
    initFilters();
    
    // Inicializar gráficos (simulados)
    initCharts();
    
    // Inicializar notificaciones
    initNotifications();
}

// ========================================
//   VERIFICACIÓN DE AUTENTICACIÓN
// ========================================

function verificarAutenticacion() {
    try {
        // Verificar sesión en localStorage
        const sesion = localStorage.getItem('sesion_pethouse');
        if (!sesion) {
            console.log('❌ No hay sesión activa');
            return null;
        }
        
        const datosSession = JSON.parse(sesion);
        const usuario = datosSession.usuario;
        
        // Verificar que el usuario tenga permisos para dashboard
        if (usuario.role === 'admin' || usuario.role === 'organizacion' || usuario.tipo === 'organizacion') {
            console.log(`✅ Usuario autenticado: ${usuario.nombre} (${usuario.role || usuario.tipo})`);
            return usuario;
        } else {
            console.log('❌ Usuario sin permisos para dashboard');
            return null;
        }
        
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return null;
    }
}

function configurarDashboard(usuario) {
    // Actualizar información de la organización en el sidebar
    actualizarInfoOrganizacion(usuario);
    
    // Configurar navegación según permisos
    configurarNavegacion(usuario);
    
    // Mostrar notificación de bienvenida
    if (usuario.tipo === 'organizacion' && usuario.requiereCambioContraseña) {
        mostrarNotificacionCambioPassword();
    }
}

function actualizarInfoOrganizacion(usuario) {
    // Actualizar nombre de la organización
    const orgNameElement = document.querySelector('.org-details h3');
    if (orgNameElement) {
        orgNameElement.textContent = usuario.tipo === 'organizacion' ? 
            usuario.organizacion.nombreOrganizacion : 
            usuario.nombre;
    }
    
    // Actualizar estado de verificación
    const orgStatusElement = document.querySelector('.org-status');
    if (orgStatusElement) {
        if (usuario.tipo === 'organizacion') {
            orgStatusElement.textContent = '✓ Verificada';
            orgStatusElement.style.color = '#10b981';
        } else if (usuario.role === 'admin') {
            orgStatusElement.textContent = '👑 Administrador';
            orgStatusElement.style.color = '#3b82f6';
        }
    }
}

function configurarNavegacion(usuario) {
    // Si es organización, personalizar navegación
    if (usuario.tipo === 'organizacion') {
        // Ocultar secciones que no corresponden a organizaciones
        const navAdmin = document.querySelector('[data-section="admin"]');
        if (navAdmin) {
            navAdmin.style.display = 'none';
        }
        
        // Actualizar contadores según datos de la organización
        actualizarContadores(usuario);
    }
}

function actualizarContadores(usuario) {
    // Simular contadores para la organización
    // En el futuro, estos vendrían de la base de datos
    const mascotasBadge = document.querySelector('[data-section="mascotas"] .nav-badge');
    if (mascotasBadge) {
        mascotasBadge.textContent = '0'; // Inicialmente 0, se actualizará cuando se implementen las mascotas
    }
    
    const solicitudesBadge = document.querySelector('[data-section="solicitudes"] .nav-badge');
    if (solicitudesBadge) {
        solicitudesBadge.textContent = '0'; // Inicialmente 0
    }
}

function mostrarNotificacionCambioPassword() {
    // Crear notificación temporal para cambio de contraseña
    const notification = document.createElement('div');
    notification.className = 'notification notification-warning';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>⚠️ Cambio de Contraseña Requerido</h4>
            <p>Por seguridad, debes cambiar tu contraseña temporal en la sección de Perfil.</p>
            <button onclick="this.closest('.notification').remove()" class="btn btn-sm">Entendido</button>
        </div>
    `;
    
    // Agregar al container de notificaciones o al body
    document.body.appendChild(notification);
    
    // Auto-remover después de 10 segundos
    setTimeout(() => {
        notification.remove();
    }, 10000);
}

// ========================================
//   NAVEGACIÓN DEL SIDEBAR
// ========================================

function initSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = item.getAttribute('data-section');
            
            // Remover clase active de todos los nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Agregar clase active al nav item clickeado
            item.classList.add('active');
            
            // Ocultar todas las secciones
            sections.forEach(section => section.classList.remove('active'));
            
            // Mostrar la sección target
            const targetElement = document.getElementById(`section-${targetSection}`);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Actualizar título de la página
            updatePageTitle(targetSection);
            
            // Cerrar sidebar en móvil
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });
}

function updatePageTitle(section) {
    const pageTitle = document.querySelector('.page-title');
    const titles = {
        'dashboard': 'Dashboard',
        'mascotas': 'Mis Mascotas',
        'adopciones': 'Gestión de Adopciones',
        'solicitudes': 'Solicitudes de Adopción',
        'chat': 'Mensajes',
        'citas': 'Gestión de Citas',
        'donaciones': 'Donaciones Recibidas',
        'perfil': 'Mi Perfil'
    };
    
    if (pageTitle && titles[section]) {
        pageTitle.textContent = titles[section];
    }
}

// ========================================
//   SIDEBAR TOGGLE PARA MÓVIL
// ========================================

function initSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Cerrar sidebar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            closeSidebar();
        }
    });
}

function closeSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    sidebar.classList.remove('active');
}

// ========================================
//   MODALES
// ========================================

function initModals() {
    // Modal de nueva mascota
    const btnAgregarMascota = document.getElementById('btn-agregar-mascota');
    const modalNuevaMascota = document.getElementById('modal-nueva-mascota');
    const modalClose = document.querySelector('.modal-close');
    
    if (btnAgregarMascota) {
        btnAgregarMascota.addEventListener('click', () => {
            showModal('modal-nueva-mascota');
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            hideModal('modal-nueva-mascota');
        });
    }
    
    // Cerrar modal al hacer click fuera
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
    
    // Formulario de nueva mascota
    const formNuevaMascota = document.getElementById('form-nueva-mascota');
    if (formNuevaMascota) {
        formNuevaMascota.addEventListener('submit', handleNuevaMascota);
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function handleNuevaMascota(e) {
    e.preventDefault();
    
    // Aquí iría la lógica para enviar los datos al servidor
    const formData = new FormData(e.target);
    
    // Simulación de envío exitoso
    showNotification('Mascota agregada exitosamente', 'success');
    hideModal('modal-nueva-mascota');
    
    // Resetear formulario
    e.target.reset();
    
    // Actualizar la lista de mascotas (simular)
    setTimeout(() => {
        location.reload(); // En una app real, actualizaríamos dinámicamente
    }, 1000);
}

// ========================================
//   ACCIONES RÁPIDAS
// ========================================

function initQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch(action) {
        case 'nueva-mascota':
            showModal('modal-nueva-mascota');
            break;
        case 'revisar-solicitudes':
            // Cambiar a sección de solicitudes
            const solicitudesNav = document.querySelector('[data-section="solicitudes"]');
            if (solicitudesNav) solicitudesNav.click();
            break;
        case 'enviar-update':
            showNotification('Función de envío de actualizaciones próximamente', 'info');
            break;
        case 'generar-reporte':
            generateReport();
            break;
        default:
            console.log('Acción no implementada:', action);
    }
}

function generateReport() {
    showNotification('Generando reporte...', 'info');
    
    // Simular generación de reporte
    setTimeout(() => {
        showNotification('Reporte generado exitosamente', 'success');
        
        // En una app real, aquí se descargaría el reporte
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'reporte-adopciones.pdf';
        link.textContent = 'Descargar Reporte';
        
        // Mostrar link de descarga (simulado)
        console.log('Reporte listo para descarga');
    }, 2000);
}

// ========================================
//   FILTROS Y BÚSQUEDA
// ========================================

function initFilters() {
    // Filtros de mascotas
    const filterSelects = document.querySelectorAll('.filter-select');
    const searchInput = document.querySelector('.search-input');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    // Filtros de adopciones
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar active al clickeado
            btn.classList.add('active');
            applyAdoptionFilters();
        });
    });
}

function applyFilters() {
    // Aquí iría la lógica para filtrar las mascotas
    const estado = document.querySelector('.filter-select').value;
    const searchTerm = document.querySelector('.search-input')?.value.toLowerCase();
    
    console.log('Aplicando filtros:', { estado, searchTerm });
    
    // En una app real, esto haría una petición al servidor o filtrar localmente
    showNotification('Filtros aplicados', 'info');
}

function applyAdoptionFilters() {
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        console.log('Filtrando adopciones por:', activeFilter.textContent);
        showNotification(`Mostrando: ${activeFilter.textContent}`, 'info');
    }
}

// ========================================
//   GRÁFICOS (SIMULADOS)
// ========================================

function initCharts() {
    // En una app real, aquí inicializaríamos Chart.js o similar
    simulateChartData();
}

function simulateChartData() {
    const chartContainer = document.querySelector('#adopciones-chart');
    if (chartContainer) {
        // Simular datos de adopciones
        setTimeout(() => {
            const placeholderContent = chartContainer.querySelector('.chart-placeholder-content');
            if (placeholderContent) {
                placeholderContent.innerHTML = `
                    <i class="fas fa-chart-bar"></i>
                    <p>Gráfico de adopciones cargado</p>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <div style="text-align: center;">
                            <div style="width: 30px; height: 60px; background: #2c5aa0; margin: 0 auto;"></div>
                            <small>Ene</small>
                        </div>
                        <div style="text-align: center;">
                            <div style="width: 30px; height: 80px; background: #3498db; margin: 0 auto;"></div>
                            <small>Feb</small>
                        </div>
                        <div style="text-align: center;">
                            <div style="width: 30px; height: 100px; background: #f39c12; margin: 0 auto;"></div>
                            <small>Mar</small>
                        </div>
                    </div>
                `;
            }
        }, 1500);
    }
}

// ========================================
//   NOTIFICACIONES
// ========================================

function initNotifications() {
    // Crear container de notificaciones si no existe
    if (!document.querySelector('.notifications-container')) {
        const container = document.createElement('div');
        container.className = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const container = document.querySelector('.notifications-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        border-left: 4px solid ${getNotificationColor(type)};
        min-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        position: relative;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas ${getNotificationIcon(type)}" style="color: ${getNotificationColor(type)};"></i>
            <span style="flex: 1; color: #333;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #999; cursor: pointer;">&times;</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ========================================
//   UTILIDADES
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
//   SIMULACIÓN DE DATOS EN TIEMPO REAL
// ========================================

function startRealTimeUpdates() {
    // Simular actualizaciones en tiempo real
    setInterval(() => {
        // Actualizar badges de notificaciones aleatoriamente
        updateNotificationBadges();
    }, 30000); // Cada 30 segundos
}

function updateNotificationBadges() {
    const badges = document.querySelectorAll('.nav-badge');
    badges.forEach(badge => {
        const currentValue = parseInt(badge.textContent);
        // Simular cambios aleatorios
        if (Math.random() > 0.7) {
            const change = Math.random() > 0.5 ? 1 : -1;
            const newValue = Math.max(0, currentValue + change);
            badge.textContent = newValue;
            
            // Animar cambio
            badge.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 500);
        }
    });
}

// Iniciar actualizaciones cuando todo esté listo
setTimeout(startRealTimeUpdates, 5000);

// ========================================
//   HANDLERS DE ACCIONES ESPECÍFICAS
// ========================================

// Acciones de mascotas
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-edit')) {
        showNotification('Función de edición próximamente', 'info');
    }
    
    if (e.target.closest('.btn-view')) {
        showNotification('Abriendo perfil de mascota...', 'info');
        // Aquí iría la navegación al perfil de la mascota
    }
    
    if (e.target.closest('.btn-share')) {
        copyToClipboard(window.location.href + '#mascota-id');
        showNotification('Link copiado al portapapeles', 'success');
    }
    
    if (e.target.closest('.btn-delete')) {
        if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
            showNotification('Mascota eliminada', 'success');
            // Aquí iría la lógica de eliminación
        }
    }
    
    if (e.target.closest('.btn-follow')) {
        showNotification('Enviando formulario de seguimiento...', 'info');
    }
    
    if (e.target.closest('.btn-medical')) {
        showNotification('Abriendo historial médico...', 'info');
    }
});

// Acciones de tabla de adopciones
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-table-action.approve')) {
        if (confirm('¿Aprobar esta solicitud de adopción?')) {
            showNotification('Solicitud aprobada', 'success');
        }
    }
    
    if (e.target.closest('.btn-table-action.reject')) {
        if (confirm('¿Rechazar esta solicitud de adopción?')) {
            showNotification('Solicitud rechazada', 'warning');
        }
    }
    
    if (e.target.closest('.btn-table-action.view')) {
        showNotification('Abriendo detalles de la solicitud...', 'info');
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Error copiando al portapapeles:', err);
    });
}

console.log('🐾 Dashboard PETHOUSE inicializado correctamente');
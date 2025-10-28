// ========================================
//   MI TIENDA - GESTIÓN SIMPLIFICADA PARA ORGANIZACIONES
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initMiTienda();
});

// Variables globales
let misProductos = [];
let productoEditando = null;
let organizacionActual = {
    id: 'org_001',
    nombre: 'Mi Organización',
    email: 'info@miorganizacion.org'
};

function initMiTienda() {
    console.log('🏪 Inicializando Mi Tienda...');
    
    // Cargar productos de la organización
    cargarMisProductos();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Actualizar estadísticas
    actualizarEstadisticas();
    
    console.log('✅ Mi Tienda inicializada');
}

function setupEventListeners() {
    // Botón nuevo producto
    const nuevoBtn = document.getElementById('nuevoProductoBtn');
    if (nuevoBtn) {
        nuevoBtn.addEventListener('click', abrirModalProducto);
    }
    
    // Modal
    const cerrarModal = document.getElementById('cerrarModal');
    const cancelarBtn = document.getElementById('cancelarProducto');
    const formProducto = document.getElementById('formProducto');
    
    if (cerrarModal) {
        cerrarModal.addEventListener('click', cerrarModalProducto);
    }
    
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', cerrarModalProducto);
    }
    
    if (formProducto) {
        formProducto.addEventListener('submit', guardarProducto);
    }
    
    // Filtros
    const buscarInput = document.getElementById('buscarProducto');
    const filtroCategoria = document.getElementById('filtroCategoriaTienda');
    const filtroEstatus = document.getElementById('filtroEstatusTienda');
    const aplicarBtn = document.getElementById('aplicarFiltrosTienda');
    const limpiarBtn = document.getElementById('limpiarFiltrosTienda');
    
    if (buscarInput) {
        buscarInput.addEventListener('input', aplicarFiltrosTienda);
    }
    
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', aplicarFiltrosTienda);
    }
    
    if (filtroEstatus) {
        filtroEstatus.addEventListener('change', aplicarFiltrosTienda);
    }
    
    if (aplicarBtn) {
        aplicarBtn.addEventListener('click', aplicarFiltrosTienda);
    }
    
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', limpiarFiltrosTienda);
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modalProducto');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModalProducto();
            }
        });
    }
}

// =============================================
//   GESTIÓN DE PRODUCTOS
// =============================================

function cargarMisProductos() {
    // Simulamos productos de la organización (en producción vendría de API)
    misProductos = [
        {
            id: 'prod_001',
            nombre: 'Collar Antipulgas Natural',
            precio: 299.99,
            categoria: 'accesorios',
            animal: 'perros',
            tamaño: 'mediano',
            descripcion: 'Collar antipulgas hecho con ingredientes naturales, efectivo y seguro para mascotas sensibles.',
            stock: 12,
            imagen: 'https://via.placeholder.com/300x200?text=Collar+Natural',
            estatus: 'activo',
            fechaCreacion: new Date('2024-10-15'),
            ventas: 23,
            ingresos: 6899.77
        },
        {
            id: 'prod_002',
            nombre: 'Alimento Holístico Cachorro',
            precio: 1299.99,
            categoria: 'alimentacion',
            animal: 'perros',
            tamaño: 'pequeño',
            descripcion: 'Alimento super premium para cachorros de 2-12 meses. Ingredientes naturales y orgánicos.',
            stock: 3,
            imagen: 'https://via.placeholder.com/300x200?text=Alimento+Holistico',
            estatus: 'activo',
            fechaCreacion: new Date('2024-10-12'),
            ventas: 15,
            ingresos: 19499.85
        },
        {
            id: 'prod_003',
            nombre: 'Juguete Interactivo Premium',
            precio: 459.99,
            categoria: 'juguetes',
            animal: 'gatos',
            tamaño: '',
            descripcion: 'Juguete con sensor de movimiento y luces LED, estimula el instinto de caza felino.',
            stock: 0,
            imagen: 'https://via.placeholder.com/300x200?text=Juguete+LED',
            estatus: 'agotado',
            fechaCreacion: new Date('2024-10-08'),
            ventas: 8,
            ingresos: 3679.92
        }
    ];
    
    mostrarMisProductos();
}

function mostrarMisProductos() {
    const container = document.getElementById('misProductosContainer');
    const estadoVacio = document.getElementById('estadoVacio');
    
    if (!container) return;
    
    const productosVisibles = aplicarFiltrosTienda();
    
    if (productosVisibles.length === 0) {
        container.style.display = 'none';
        if (estadoVacio) {
            estadoVacio.style.display = 'block';
        }
        return;
    }
    
    container.style.display = 'grid';
    if (estadoVacio) {
        estadoVacio.style.display = 'none';
    }
    
    container.innerHTML = productosVisibles.map(producto => {
        const statusIcon = getStatusIcon(producto.estatus);
        const statusColor = getStatusColor(producto.estatus);
        const stockWarning = producto.stock <= 5 && producto.stock > 0;
        
        return `
            <div class="producto-card-tienda" style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; transition: all 0.3s ease;">
                <div style="display: grid; grid-template-columns: 100px 1fr auto; gap: 1.5rem; align-items: start;">
                    <!-- Imagen -->
                    <div class="producto-imagen" style="width: 100px; height: 100px; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 2px solid #e2e8f0;">
                        <img src="${producto.imagen}" alt="${producto.nombre}" 
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="this.src='https://via.placeholder.com/100x100?text=IMG'">
                    </div>
                    
                    <!-- Información -->
                    <div class="producto-info">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                            <h3 style="margin: 0; color: #1e293b; font-size: 1.2rem; font-weight: 600;">${producto.nombre}</h3>
                            <span style="background: ${statusColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;">
                                ${statusIcon} ${producto.estatus}
                            </span>
                            ${stockWarning ? '<span style="background: #f59e0b; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.7rem; font-weight: 600;">⚠️ STOCK BAJO</span>' : ''}
                        </div>
                        
                        <div style="color: #64748b; font-size: 0.9rem; margin-bottom: 0.75rem; line-height: 1.4;">
                            ${producto.descripcion.length > 100 ? producto.descripcion.substring(0, 100) + '...' : producto.descripcion}
                        </div>
                        
                        <div style="display: flex; gap: 1rem; color: #64748b; font-size: 0.85rem; margin-bottom: 0.75rem;">
                            <span><i class="fas fa-tag"></i> ${capitalize(producto.categoria)}</span>
                            <span><i class="fas fa-${producto.animal === 'perros' ? 'dog' : producto.animal === 'gatos' ? 'cat' : 'paw'}"></i> ${capitalize(producto.animal)}</span>
                            ${producto.tamaño ? `<span><i class="fas fa-ruler"></i> ${capitalize(producto.tamaño)}</span>` : ''}
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.85rem;">
                            <div>
                                <span style="color: #64748b;">Stock:</span>
                                <span style="font-weight: 600; color: ${producto.stock === 0 ? '#ef4444' : producto.stock <= 5 ? '#f59e0b' : '#10b981'};">
                                    ${producto.stock} unidades
                                </span>
                            </div>
                            <div>
                                <span style="color: #64748b;">Ventas:</span>
                                <span style="font-weight: 600; color: #1e293b;">${producto.ventas || 0}</span>
                            </div>
                            <div>
                                <span style="color: #64748b;">Ingresos:</span>
                                <span style="font-weight: 600; color: #10b981;">$${(producto.ingresos || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Precio y Acciones -->
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">
                            $${producto.precio.toFixed(2)}
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <button onclick="editarMiProducto('${producto.id}')" class="btn btn-sm btn-primary" style="width: 100%;">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            
                            <button onclick="toggleStatusProducto('${producto.id}')" 
                                    class="btn btn-sm ${producto.estatus === 'activo' ? 'btn-warning' : 'btn-success'}" 
                                    style="width: 100%;">
                                <i class="fas fa-${producto.estatus === 'activo' ? 'pause' : 'play'}"></i> 
                                ${producto.estatus === 'activo' ? 'Pausar' : 'Activar'}
                            </button>
                            
                            <button onclick="eliminarMiProducto('${producto.id}')" class="btn btn-sm btn-danger" style="width: 100%;">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// =============================================
//   MODAL DE PRODUCTO
// =============================================

function abrirModalProducto() {
    productoEditando = null;
    document.getElementById('modalTitulo').innerHTML = '<i class="fas fa-plus"></i> Nuevo Producto';
    limpiarFormulario();
    document.getElementById('modalProducto').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function editarMiProducto(productoId) {
    productoEditando = misProductos.find(p => p.id === productoId);
    if (!productoEditando) return;
    
    document.getElementById('modalTitulo').innerHTML = '<i class="fas fa-edit"></i> Editar Producto';
    llenarFormulario(productoEditando);
    document.getElementById('modalProducto').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function cerrarModalProducto() {
    document.getElementById('modalProducto').style.display = 'none';
    document.body.style.overflow = '';
    productoEditando = null;
    limpiarFormulario();
}

function limpiarFormulario() {
    document.getElementById('formProducto').reset();
}

function llenarFormulario(producto) {
    document.getElementById('nombreProducto').value = producto.nombre;
    document.getElementById('precioProducto').value = producto.precio;
    document.getElementById('categoriaProducto').value = producto.categoria;
    document.getElementById('animalProducto').value = producto.animal;
    document.getElementById('tamañoProducto').value = producto.tamaño;
    document.getElementById('descripcionProducto').value = producto.descripcion;
    document.getElementById('stockProducto').value = producto.stock;
    document.getElementById('imagenProducto').value = producto.imagen;
}

function guardarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productoData = {
        nombre: formData.get('nombre').trim(),
        precio: parseFloat(formData.get('precio')),
        categoria: formData.get('categoria'),
        animal: formData.get('animal'),
        tamaño: formData.get('tamaño') || '',
        descripcion: formData.get('descripcion').trim(),
        stock: parseInt(formData.get('stock')) || 0,
        imagen: formData.get('imagen') || 'https://via.placeholder.com/300x200?text=Producto'
    };
    
    // Validaciones
    if (!productoData.nombre || productoData.nombre.length < 3) {
        alert('El nombre del producto debe tener al menos 3 caracteres');
        return;
    }
    
    if (productoData.precio <= 0) {
        alert('El precio debe ser mayor a $0');
        return;
    }
    
    if (!productoData.descripcion || productoData.descripcion.length < 10) {
        alert('La descripción debe tener al menos 10 caracteres');
        return;
    }
    
    if (productoEditando) {
        // Editar producto existente
        Object.assign(productoEditando, productoData);
        mostrarNotificacion('✅ Producto actualizado exitosamente', 'success');
    } else {
        // Crear nuevo producto
        const nuevoProducto = {
            id: 'prod_' + Date.now(),
            ...productoData,
            estatus: productoData.stock > 0 ? 'activo' : 'agotado',
            fechaCreacion: new Date(),
            ventas: 0,
            ingresos: 0
        };
        misProductos.push(nuevoProducto);
        mostrarNotificacion('✅ Producto agregado exitosamente', 'success');
    }
    
    mostrarMisProductos();
    actualizarEstadisticas();
    cerrarModalProducto();
}

// =============================================
//   ACCIONES DE PRODUCTO
// =============================================

function toggleStatusProducto(productoId) {
    const producto = misProductos.find(p => p.id === productoId);
    if (!producto) return;
    
    if (producto.estatus === 'activo') {
        producto.estatus = 'pausado';
        mostrarNotificacion('⏸️ Producto pausado - Ya no será visible en la tienda', 'info');
    } else if (producto.estatus === 'pausado') {
        producto.estatus = producto.stock > 0 ? 'activo' : 'agotado';
        mostrarNotificacion('▶️ Producto activado - Ahora es visible en la tienda', 'success');
    }
    
    mostrarMisProductos();
    actualizarEstadisticas();
}

function eliminarMiProducto(productoId) {
    const producto = misProductos.find(p => p.id === productoId);
    if (!producto) return;
    
    if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?\n\nEsta acción no se puede deshacer y perderás el historial de ventas.`)) {
        misProductos = misProductos.filter(p => p.id !== productoId);
        mostrarMisProductos();
        actualizarEstadisticas();
        mostrarNotificacion('🗑️ Producto eliminado permanentemente', 'info');
    }
}

// =============================================
//   FILTROS Y BÚSQUEDA
// =============================================

function aplicarFiltrosTienda() {
    const busqueda = document.getElementById('buscarProducto')?.value.toLowerCase() || '';
    const categoria = document.getElementById('filtroCategoriaTienda')?.value || '';
    const estatus = document.getElementById('filtroEstatusTienda')?.value || '';
    
    const productosFiltrados = misProductos.filter(producto => {
        const cumpleBusqueda = !busqueda || 
            producto.nombre.toLowerCase().includes(busqueda) ||
            producto.descripcion.toLowerCase().includes(busqueda);
        
        const cumpleCategoria = !categoria || producto.categoria === categoria;
        const cumpleEstatus = !estatus || producto.estatus === estatus;
        
        return cumpleBusqueda && cumpleCategoria && cumpleEstatus;
    });
    
    return productosFiltrados;
}

function limpiarFiltrosTienda() {
    document.getElementById('buscarProducto').value = '';
    document.getElementById('filtroCategoriaTienda').value = '';
    document.getElementById('filtroEstatusTienda').value = '';
    mostrarMisProductos();
}

// =============================================
//   ESTADÍSTICAS
// =============================================

function actualizarEstadisticas() {
    const productosActivos = misProductos.filter(p => p.estatus === 'activo').length;
    const ventasMes = misProductos.reduce((sum, p) => sum + (p.ingresos || 0), 0);
    const stockBajo = misProductos.filter(p => p.stock <= 5 && p.stock > 0).length;
    
    const totalElement = document.getElementById('totalProductos');
    const ventasElement = document.getElementById('ventasMes');
    const stockElement = document.getElementById('stockBajo');
    
    if (totalElement) {
        totalElement.textContent = productosActivos;
    }
    
    if (ventasElement) {
        ventasElement.textContent = '$' + ventasMes.toFixed(2);
    }
    
    if (stockElement) {
        stockElement.textContent = stockBajo;
    }
}

// =============================================
//   UTILIDADES
// =============================================

function getStatusIcon(estatus) {
    switch(estatus) {
        case 'activo': return '✅';
        case 'pausado': return '⏸️';
        case 'agotado': return '📦';
        default: return '❓';
    }
}

function getStatusColor(estatus) {
    switch(estatus) {
        case 'activo': return '#10b981';
        case 'pausado': return '#f59e0b';
        case 'agotado': return '#ef4444';
        default: return '#6b7280';
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación temporal
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 400px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    notif.textContent = mensaje;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .producto-card-tienda:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
    }
`;
document.head.appendChild(style);

// Exponer funciones globalmente
window.abrirModalProducto = abrirModalProducto;
window.editarMiProducto = editarMiProducto;
window.toggleStatusProducto = toggleStatusProducto;
window.eliminarMiProducto = eliminarMiProducto;

console.log('🏪 Mi Tienda cargada completamente');
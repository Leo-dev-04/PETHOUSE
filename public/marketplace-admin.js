// ========================================
//   MARKETPLACE ADMIN - GESTIÓN DE PRODUCTOS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initMarketplaceAdmin();
});

// Variables globales
let productos = [];
let organizaciones = [];
let productoEditando = null;

function initMarketplaceAdmin() {
    console.log('🛒 Inicializando Marketplace Admin...');
    
    // Cargar datos iniciales
    cargarOrganizaciones();
    cargarProductos();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('✅ Marketplace Admin inicializado');
}

function setupEventListeners() {
    // Modal
    const agregarBtn = document.getElementById('agregarProductoBtn');
    const cerrarModal = document.getElementById('cerrarModal');
    const cancelarBtn = document.getElementById('cancelarProducto');
    const formProducto = document.getElementById('formProducto');
    
    if (agregarBtn) {
        agregarBtn.addEventListener('click', abrirModalAgregar);
    }
    
    if (cerrarModal) {
        cerrarModal.addEventListener('click', cerrarModal);
    }
    
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', cerrarModalProducto);
    }
    
    if (formProducto) {
        formProducto.addEventListener('submit', guardarProducto);
    }
    
    // Filtros
    const filtroCategoria = document.getElementById('filtroCategoria');
    const filtroOrganizacion = document.getElementById('filtroOrganizacion');
    const filtroEstatus = document.getElementById('filtroEstatus');
    
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', aplicarFiltros);
    }
    
    if (filtroOrganizacion) {
        filtroOrganizacion.addEventListener('change', aplicarFiltros);
    }
    
    if (filtroEstatus) {
        filtroEstatus.addEventListener('change', aplicarFiltros);
    }
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('modalProducto').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModalProducto();
        }
    });
}

// =============================================
//   GESTIÓN DE DATOS
// =============================================

function cargarOrganizaciones() {
    // Simulamos organizaciones aprobadas (en producción vendría de API)
    organizaciones = [
        { id: '1', nombre: 'Fundación Patitas Felices', email: 'info@patitasfelices.org', ciudad: 'Veracruz' },
        { id: '2', nombre: 'Rescate Animal Xalapa', email: 'contacto@rescatexalapa.org', ciudad: 'Xalapa' },
        { id: '3', nombre: 'Protectora de Animales VER', email: 'admin@protectoraver.org', ciudad: 'Córdoba' },
        { id: '4', nombre: 'Casa Cuna Animal', email: 'info@casacunaanimal.org', ciudad: 'Boca del Río' }
    ];
    
    actualizarSelectOrganizaciones();
}

function cargarProductos() {
    // Simulamos productos existentes (en producción vendría de API)
    productos = [
        {
            id: '1',
            nombre: 'Collar Antipulgas Premium',
            precio: 249.99,
            categoria: 'accesorios',
            animal: 'perros',
            tamaño: 'mediano',
            descripcion: 'Collar antipulgas de larga duración, efectivo hasta por 8 meses.',
            stock: 15,
            organizacion: '1',
            imagen: 'https://via.placeholder.com/300x200?text=Collar+Antipulgas',
            estatus: 'activo',
            fechaCreacion: new Date('2024-10-15')
        },
        {
            id: '2',
            nombre: 'Alimento Premium Cachorro',
            precio: 899.99,
            categoria: 'alimentacion',
            animal: 'perros',
            tamaño: 'pequeño',
            descripcion: 'Alimento balanceado para cachorros de 2 a 12 meses, bolsa de 15kg.',
            stock: 8,
            organizacion: '2',
            imagen: 'https://via.placeholder.com/300x200?text=Alimento+Cachorro',
            estatus: 'activo',
            fechaCreacion: new Date('2024-10-12')
        },
        {
            id: '3',
            nombre: 'Juguete Interactivo para Gatos',
            precio: 159.99,
            categoria: 'juguetes',
            animal: 'gatos',
            tamaño: '',
            descripcion: 'Ratón interactivo con sensor de movimiento, estimula el instinto de caza.',
            stock: 0,
            organizacion: '3',
            imagen: 'https://via.placeholder.com/300x200?text=Juguete+Gato',
            estatus: 'agotado',
            fechaCreacion: new Date('2024-10-10')
        }
    ];
    
    mostrarProductos();
}

// =============================================
//   MODAL DE PRODUCTO
// =============================================

function abrirModalAgregar() {
    productoEditando = null;
    document.getElementById('modalTitulo').innerHTML = '<i class="fas fa-plus"></i> Agregar Producto';
    limpiarFormulario();
    document.getElementById('modalProducto').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function editarProducto(productoId) {
    productoEditando = productos.find(p => p.id === productoId);
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
    document.getElementById('organizacionProducto').value = producto.organizacion;
    document.getElementById('imagenProducto').value = producto.imagen;
}

function guardarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productoData = {
        nombre: formData.get('nombre'),
        precio: parseFloat(formData.get('precio')),
        categoria: formData.get('categoria'),
        animal: formData.get('animal'),
        tamaño: formData.get('tamaño') || '',
        descripcion: formData.get('descripcion'),
        stock: parseInt(formData.get('stock')) || 0,
        organizacion: formData.get('organizacion'),
        imagen: formData.get('imagen') || 'https://via.placeholder.com/300x200?text=Producto'
    };
    
    if (productoEditando) {
        // Editar producto existente
        Object.assign(productoEditando, productoData);
        mostrarExito('Producto actualizado exitosamente');
    } else {
        // Crear nuevo producto
        const nuevoProducto = {
            id: Date.now().toString(),
            ...productoData,
            estatus: 'activo',
            fechaCreacion: new Date()
        };
        productos.push(nuevoProducto);
        mostrarExito('Producto agregado exitosamente');
    }
    
    mostrarProductos();
    cerrarModalProducto();
}

// =============================================
//   VISUALIZACIÓN DE PRODUCTOS
// =============================================

function mostrarProductos() {
    const container = document.getElementById('productosContainer');
    if (!container) return;
    
    const productosVisibes = aplicarFiltros();
    
    if (productosVisibes.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3>No hay productos</h3>
                <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productosVisibes.map(producto => {
        const organizacion = organizaciones.find(o => o.id === producto.organizacion);
        const statusIcon = getStatusIcon(producto.estatus);
        const statusColor = getStatusColor(producto.estatus);
        
        return `
            <div class="producto-card" style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #eee;">
                <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: start;">
                    <div class="producto-imagen" style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 8px; overflow: hidden;">
                        <img src="${producto.imagen}" alt="${producto.nombre}" 
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="this.src='https://via.placeholder.com/80x80?text=IMG'">
                    </div>
                    
                    <div class="producto-info">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0; color: #333; font-size: 1.1rem;">${producto.nombre}</h4>
                            <span style="background: ${statusColor}; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">
                                ${statusIcon} ${producto.estatus.toUpperCase()}
                            </span>
                        </div>
                        
                        <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.75rem;">
                            <span><i class="fas fa-tag"></i> ${producto.categoria}</span> •
                            <span><i class="fas fa-${producto.animal === 'perros' ? 'dog' : producto.animal === 'gatos' ? 'cat' : 'paw'}"></i> ${producto.animal}</span>
                            ${producto.tamaño ? ` • <span><i class="fas fa-ruler"></i> ${producto.tamaño}</span>` : ''}
                        </div>
                        
                        <div style="color: #666; font-size: 0.8rem;">
                            <span><i class="fas fa-building"></i> ${organizacion ? organizacion.nombre : 'Organización desconocida'}</span>
                        </div>
                    </div>
                    
                    <div class="producto-acciones" style="text-align: right;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: #333; margin-bottom: 0.5rem;">
                            $${producto.precio.toFixed(2)}
                        </div>
                        
                        <div style="color: #666; font-size: 0.8rem; margin-bottom: 1rem;">
                            <i class="fas fa-boxes"></i> Stock: ${producto.stock}
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="editarProducto('${producto.id}')" class="btn btn-sm btn-secondary" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="toggleEstatus('${producto.id}')" class="btn btn-sm ${producto.estatus === 'activo' ? 'btn-warning' : 'btn-success'}" 
                                    title="${producto.estatus === 'activo' ? 'Pausar' : 'Activar'}">
                                <i class="fas fa-${producto.estatus === 'activo' ? 'pause' : 'play'}"></i>
                            </button>
                            <button onclick="eliminarProducto('${producto.id}')" class="btn btn-sm btn-danger" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// =============================================
//   FILTROS Y BÚSQUEDA
// =============================================

function aplicarFiltros() {
    const categoria = document.getElementById('filtroCategoria')?.value || '';
    const organizacion = document.getElementById('filtroOrganizacion')?.value || '';
    const estatus = document.getElementById('filtroEstatus')?.value || '';
    
    return productos.filter(producto => {
        const cumpleCategoria = !categoria || producto.categoria === categoria;
        const cumpleOrganizacion = !organizacion || producto.organizacion === organizacion;
        const cumpleEstatus = !estatus || producto.estatus === estatus;
        
        return cumpleCategoria && cumpleOrganizacion && cumpleEstatus;
    });
}

// =============================================
//   ACCIONES DE PRODUCTO
// =============================================

function toggleEstatus(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    if (producto.estatus === 'activo') {
        producto.estatus = 'pausado';
        mostrarInfo('Producto pausado', 'El producto ya no estará visible en la tienda');
    } else if (producto.estatus === 'pausado') {
        producto.estatus = 'activo';
        mostrarExito('Producto activado', 'El producto ahora está visible en la tienda');
    }
    
    mostrarProductos();
}

function eliminarProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        productos = productos.filter(p => p.id !== productoId);
        mostrarProductos();
        mostrarExito('Producto eliminado', 'El producto ha sido eliminado permanentemente');
    }
}

// =============================================
//   UTILIDADES
// =============================================

function actualizarSelectOrganizaciones() {
    const selectModal = document.getElementById('organizacionProducto');
    const selectFiltro = document.getElementById('filtroOrganizacion');
    
    const options = organizaciones.map(org => 
        `<option value="${org.id}">${org.nombre}</option>`
    ).join('');
    
    if (selectModal) {
        selectModal.innerHTML = '<option value="">Seleccionar organización...</option>' + options;
    }
    
    if (selectFiltro) {
        selectFiltro.innerHTML = '<option value="">Todas las organizaciones</option>' + options;
    }
}

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

// Funciones de notificación (deben existir en el contexto global)
function mostrarExito(titulo, mensaje = '') {
    console.log(`✅ ${titulo}: ${mensaje}`);
    alert(`${titulo}\n${mensaje}`);
}

function mostrarInfo(titulo, mensaje = '') {
    console.log(`ℹ️ ${titulo}: ${mensaje}`);
    alert(`${titulo}\n${mensaje}`);
}

function mostrarError(titulo, mensaje = '') {
    console.log(`❌ ${titulo}: ${mensaje}`);
    alert(`ERROR: ${titulo}\n${mensaje}`);
}

// Exponer funciones globalmente
window.editarProducto = editarProducto;
window.toggleEstatus = toggleEstatus;
window.eliminarProducto = eliminarProducto;

console.log('🛒 Marketplace Admin cargado completamente');
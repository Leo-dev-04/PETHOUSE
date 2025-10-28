// =============================================
// GALERÍA PETHOUSE - JAVASCRIPT
// Sincronizado con mascotas de adopciones
// =============================================

class GaleriaApp {
    constructor() {
        this.mascotas = [];
        this.mascotasFiltradas = [];
        this.filtroActivo = 'todos';
        this.textoBusqueda = '';
        
        this.init();
    }

    init() {
        this.cargarMascotas();
        this.configurarEventListeners();
        this.inicializarGaleria();
    }

    // =============================================
    // DATOS DE MASCOTAS - SINCRONIZADAS CON ADOPCIONES
    // =============================================
    cargarMascotas() {
        // Solo las mascotas que están disponibles en adopciones
        this.mascotas = [
            {
                id: 1,
                nombre: "Luna",
                tipo: "gato",
                raza: "Persa",
                edad: "2 meses",
                genero: "hembra",
                imagen: "../assets/images/luna.webp",
                estado: "disponible",
                personalidad: ["cariñosa", "juguetona", "inteligente"],
                descripcion: "Luna es una gata increíblemente dulce y cariñosa. Le encanta jugar con niños y otras mascotas."
            },
            {
                id: 2,
                nombre: "Milo",
                tipo: "gato",
                raza: "Mestizo",
                edad: "1 año",
                genero: "macho",
                imagen: "../assets/images/milo.jpg",
                estado: "disponible",
                personalidad: ["independiente", "tranquilo", "curioso"],
                descripcion: "Milo es un gato joven y curioso. Le gusta explorar y es muy independiente, pero también disfruta de las caricias."
            },
            {
                id: 3,
                nombre: "Rocky",
                tipo: "perro",
                raza: "Pitbull",
                edad: "3 meses",
                genero: "macho",
                imagen: "../assets/images/rocky.jpg",
                estado: "disponible",
                personalidad: ["leal", "protector", "energico"],
                descripcion: "Rocky es un perro increíblemente leal y protector. Necesita una familia experimentada que entienda su energía."
            },
            {
                id: 4,
                nombre: "Bella",
                tipo: "perro",
                raza: "Golden Retriever",
                edad: "5 años",
                genero: "hembra",
                imagen: "../assets/images/bella.webp",
                estado: "disponible",
                personalidad: ["tranquila", "cariñosa", "obediente"],
                descripcion: "Bella es una perra madura y tranquila, perfecta para una familia que busca una compañera leal."
            },
            {
                id: 5,
                nombre: "Pepito",
                tipo: "ave",
                raza: "Cotorra Cherry Headed",
                edad: "5 años",
                genero: "macho",
                imagen: "../assets/images/pepito.jpg",
                estado: "disponible",
                personalidad: ["parlanchin", "inteligente", "sociable", "coquetón"],
                descripcion: "Pepito es un cotorro muy inteligente y parlanchin. Le encanta aprender nuevas palabras y interactuar con las personas."
            },
            {
                id: 6,
                nombre: "Coco",
                tipo: "hamster",
                raza: "Dorado",
                edad: "2 meses",
                genero: "macho",
                imagen: "../assets/images/coco.jpg",
                estado: "disponible",
                personalidad: ["juguetón", "curioso", "energético"],
                descripcion: "Coco es un adorable hámster bebé dorado de apenas 2 meses. Es muy activo y curioso, siempre explorando su entorno."
            },
            {
                id: 8,
                nombre: "Nala",
                tipo: "gato",
                raza: "Siamés",
                edad: "1 año",
                genero: "hembra",
                imagen: "../assets/images/siames.jpg",
                estado: "disponible",
                personalidad: ["vocal", "activa", "inteligente"],
                descripcion: "Nala es una gata siamesa muy vocal e inteligente. Le gusta 'conversar' con sus humanos y es muy activa."
            },
            {
                id: 9,
                nombre: "Bruno",
                tipo: "perro",
                raza: "Bulldog Francés",
                edad: "2 años",
                genero: "macho",
                imagen: "../assets/images/bruno.jpg",
                estado: "reservado",
                personalidad: ["tranquilo", "companero", "gracioso"],
                descripcion: "Bruno es un bulldog francés muy gracioso y tranquilo. Es el compañero perfecto para la vida en apartamento."
            },
            {
                id: 10,
                nombre: "Simba",
                tipo: "gato",
                raza: "Mestizo",
                edad: "2 años",
                genero: "macho",
                imagen: "../assets/images/simba.webp",
                estado: "disponible",
                personalidad: ["gentil", "gigante", "cariñoso"],
                descripcion: "Simba es un gato gentil. A pesar de su tamaño, es increíblemente cariñoso y tranquilo."
            },
            {
                id: 11,
                nombre: "Filimon",
                tipo: "otros",
                raza: "Burro Doméstico",
                edad: "8 años",
                genero: "macho",
                imagen: "../assets/images/filimon.webp",
                estado: "disponible",
                personalidad: ["gentil", "trabajador", "cariñoso"],
                descripcion: "Filimon es un burro noble y trabajador con un corazón enorme. Es increíblemente gentil con las personas."
            },
            {
                id: 12,
                nombre: "Chente",
                tipo: "conejo",
                raza: "Conejo Doméstico",
                edad: "5 meses",
                genero: "macho",
                imagen: "../assets/images/chente.jpg",
                estado: "disponible",
                personalidad: ["elegante", "mariachi", "cariñoso"],
                descripcion: "Chente es un conejo que le gusta andar brincando, recibir caricias y ponerse su sombrero de mariachi."
            },
                        {
                id: 13,
                nombre: "Filomeno",
                tipo: "conejo",
                raza: "Conejo Doméstico",
                edad: "8 años",
                genero: "macho",
                imagen: "../assets/images/conejo.jpg",
                estado: "urgente",
                personalidad: ["gentil", "necesita hogar", "cariñoso"],
                descripcion: "Filomeno es un conejo noble que necesita un hogar URGENTE. Es increíblemente gentil y merece una familia amorosa."
            },
            {
                id: 14,
                nombre: "Chuy",
                tipo: "perro",
                raza: "Perro Mestizo",
                edad: "8 años",
                genero: "macho",
                imagen: "../assets/images/chuy.webp",
                estado: "adoptado",
                personalidad: ["feliz", "en su hogar", "cariñoso"],
                descripcion: "¡Chuy ya encontró su hogar definitivo! Es un perro noble que ahora vive feliz con su nueva familia."
            }
        ];

        // Mostrar todas las mascotas en la galería (disponibles, urgentes, adoptadas, etc.)
        this.mascotasFiltradas = [...this.mascotas];
        
        console.log(`✅ ${this.mascotas.length} mascotas cargadas para la galería`);
    }

    // =============================================
    // FUNCIONES DE FILTRADO
    // =============================================
    
    filtrarMascotas(tipo) {
        this.filtroActivo = tipo;
        let baseFilter = [...this.mascotas];
        
        if (tipo !== 'todos') {
            if (tipo === 'otros') {
                baseFilter = baseFilter.filter(m => !['perro', 'gato', 'conejo'].includes(m.tipo));
            } else {
                baseFilter = baseFilter.filter(m => m.tipo === tipo);
            }
        }
        
        // Aplicar búsqueda de texto si existe
        if (this.textoBusqueda) {
            baseFilter = baseFilter.filter(m => 
                m.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
                m.raza.toLowerCase().includes(this.textoBusqueda.toLowerCase())
            );
        }
        
        this.mascotasFiltradas = baseFilter;
        this.mostrarMascotas();
        this.actualizarContadorResultados();
    }

    buscarMascotas(texto) {
        this.textoBusqueda = texto;
        let baseFilter = [...this.mascotas];
        
        // Aplicar filtro de tipo si no es 'todos'
        if (this.filtroActivo !== 'todos') {
            if (this.filtroActivo === 'otros') {
                baseFilter = baseFilter.filter(m => !['perro', 'gato', 'conejo'].includes(m.tipo));
            } else {
                baseFilter = baseFilter.filter(m => m.tipo === this.filtroActivo);
            }
        }
        
        // Aplicar búsqueda de texto
        if (texto) {
            baseFilter = baseFilter.filter(m => 
                m.nombre.toLowerCase().includes(texto.toLowerCase()) ||
                m.raza.toLowerCase().includes(texto.toLowerCase()) ||
                m.personalidad.some(trait => trait.toLowerCase().includes(texto.toLowerCase()))
            );
        }
        
        this.mascotasFiltradas = baseFilter;
        this.mostrarMascotas();
        this.actualizarContadorResultados();
    }

    resetearFiltros() {
        this.filtroActivo = 'todos';
        this.textoBusqueda = '';
        this.mascotasFiltradas = [...this.mascotas];
        
        // Resetear UI
        document.getElementById('buscar-mascota').value = '';
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tipo="todos"]').classList.add('active');
        
        this.mostrarMascotas();
        this.actualizarContadorResultados();
    }

    // =============================================
    // FUNCIONES DE RENDERIZADO
    // =============================================
    
    mostrarMascotas() {
        const grid = document.getElementById('mascotas-grid');
        
        if (this.mascotasFiltradas.length === 0) {
            document.getElementById('no-results').style.display = 'block';
            grid.innerHTML = '';
            return;
        }
        
        document.getElementById('no-results').style.display = 'none';
        
        grid.innerHTML = this.mascotasFiltradas.map(mascota => `
            <div class="mascota-card" data-aos="fade-up" data-estado="${mascota.estado}">
                <div class="mascota-image-container" onclick="galeriaApp.abrirModal(${mascota.id})">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}" class="mascota-image" 
                         onerror="this.src='../assets/images/perrofeliz.webp'">
                    <div class="mascota-overlay">
                        <div class="mascota-estado estado-${mascota.estado}">
                            <i class="fas fa-heart"></i> ${this.getEstadoTexto(mascota.estado)}
                        </div>
                    </div>
                </div>
                <div class="mascota-info">
                    <h3 class="mascota-nombre" onclick="galeriaApp.abrirModal(${mascota.id})">${mascota.nombre}</h3>
                    <div class="mascota-detalles">
                        <span><i class="fas ${this.getIconoTipo(mascota.tipo)}"></i> ${mascota.raza}</span>
                        <span><i class="fas fa-calendar"></i> ${mascota.edad}</span>
                        <span><i class="fas ${mascota.genero === 'macho' ? 'fa-mars' : 'fa-venus'}"></i> ${mascota.genero}</span>
                    </div>
                    <div class="mascota-personalidad">
                        ${mascota.personalidad.slice(0, 3).map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
                    </div>
                    <p class="mascota-descripcion">${this.truncarTexto(mascota.descripcion, 100)}</p>
                    <div class="mascota-acciones-rapidas">
                        ${this.generarBotonesSegunEstado(mascota)}
                        <button class="btn-ver-detalles" onclick="galeriaApp.abrirModal(${mascota.id})" title="Ver más detalles">
                            <i class="fas fa-info-circle"></i> Detalles
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    abrirModal(id) {
        const mascota = this.mascotas.find(m => m.id === id);
        if (!mascota) return;
        
        const modal = document.getElementById('modal-mascota');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <div class="modal-mascota-content">
                <div class="modal-mascota-image">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}" 
                         onerror="this.src='../assets/images/perrofeliz.webp'">
                </div>
                <div class="modal-mascota-info">
                    <div class="modal-header-estado">
                        <h2>${mascota.nombre}</h2>
                        <span class="modal-estado-badge estado-${mascota.estado}">
                            ${this.getEstadoTexto(mascota.estado)}
                        </span>
                    </div>
                    <div class="mascota-meta">
                        <span><i class="fas ${this.getIconoTipo(mascota.tipo)}"></i> ${mascota.raza}</span>
                        <span><i class="fas fa-calendar"></i> ${mascota.edad}</span>
                        <span><i class="fas ${mascota.genero === 'macho' ? 'fa-mars' : 'fa-venus'}"></i> ${mascota.genero}</span>
                    </div>
                    <p class="mascota-descripcion-completa">${mascota.descripcion}</p>
                    <div class="mascota-personalidad-completa">
                        <h4><i class="fas fa-heart"></i> Personalidad:</h4>
                        <div class="traits-grid">
                            ${mascota.personalidad.map(trait => `<span class="trait-chip">${trait}</span>`).join('')}
                        </div>
                    </div>
                    <div class="modal-actions">
                        ${this.generarBotonesModal(mascota)}
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    cerrarModal() {
        const modal = document.getElementById('modal-mascota');
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    irAAdopcion(idMascota) {
        // Cerrar modal primero
        this.cerrarModal();
        
        // Guardar el ID de la mascota a destacar en localStorage
        localStorage.setItem('destacarMascota', idMascota);
        localStorage.setItem('origenGaleria', 'true');
        
        // Redireccionar a adopciones
        setTimeout(() => {
            window.location.href = 'adopciones.html';
        }, 300);
    }

    generarBotonesSegunEstado(mascota) {
        switch (mascota.estado) {
            case 'disponible':
                return `<button class="btn-adoptar-directo" onclick="galeriaApp.irAAdopcion(${mascota.id})" title="Ir a adoptar a ${mascota.nombre}">
                    <i class="fas fa-heart"></i> Adoptar
                </button>`;
            case 'urgente':
                return `<button class="btn-adoptar-urgente" onclick="galeriaApp.irAAdopcion(${mascota.id})" title="¡Adopción urgente de ${mascota.nombre}!">
                    <i class="fas fa-exclamation-triangle"></i> ¡URGENTE!
                </button>`;
            case 'reservado':
                return `<button class="btn-reservado" disabled title="${mascota.nombre} está reservado">
                    <i class="fas fa-clock"></i> Reservado
                </button>`;
            case 'adoptado':
                return `<button class="btn-adoptado" disabled title="${mascota.nombre} ya fue adoptado">
                    <i class="fas fa-check-circle"></i> Adoptado
                </button>`;
            default:
                return `<button class="btn-adoptar-directo" onclick="galeriaApp.irAAdopcion(${mascota.id})" title="Ir a adoptar a ${mascota.nombre}">
                    <i class="fas fa-heart"></i> Adoptar
                </button>`;
        }
    }

    generarBotonesModal(mascota) {
        switch (mascota.estado) {
            case 'disponible':
                return `
                    <a href="adopciones.html?highlight=${mascota.id}" class="btn-adoptar-modal" 
                       onclick="galeriaApp.irAAdopcion(${mascota.id}); return false;">
                        <i class="fas fa-heart"></i> Adoptar a ${mascota.nombre}
                    </a>
                    <a href="contacto.html?mascota=${mascota.nombre}" class="btn-contactar">
                        <i class="fas fa-phone"></i> Más Información
                    </a>
                `;
            case 'urgente':
                return `
                    <a href="adopciones.html?highlight=${mascota.id}" class="btn-adoptar-modal-urgente" 
                       onclick="galeriaApp.irAAdopcion(${mascota.id}); return false;">
                        <i class="fas fa-exclamation-triangle"></i> ¡ADOPCIÓN URGENTE!
                    </a>
                    <a href="contacto.html?mascota=${mascota.nombre}&urgente=true" class="btn-contactar-urgente">
                        <i class="fas fa-phone"></i> Contactar Urgente
                    </a>
                `;
            case 'reservado':
                return `
                    <button class="btn-modal-reservado" disabled>
                        <i class="fas fa-clock"></i> ${mascota.nombre} está Reservado
                    </button>
                    <a href="contacto.html?mascota=${mascota.nombre}&estado=reservado" class="btn-contactar">
                        <i class="fas fa-info-circle"></i> Consultar Estado
                    </a>
                `;
            case 'adoptado':
                return `
                    <button class="btn-modal-adoptado" disabled>
                        <i class="fas fa-check-circle"></i> ¡${mascota.nombre} ya tiene hogar!
                    </button>
                    <a href="adopciones.html" class="btn-ver-otros">
                        <i class="fas fa-paw"></i> Ver Otras Mascotas
                    </a>
                `;
            default:
                return `
                    <a href="adopciones.html?highlight=${mascota.id}" class="btn-adoptar-modal" 
                       onclick="galeriaApp.irAAdopcion(${mascota.id}); return false;">
                        <i class="fas fa-heart"></i> Adoptar a ${mascota.nombre}
                    </a>
                    <a href="contacto.html?mascota=${mascota.nombre}" class="btn-contactar">
                        <i class="fas fa-phone"></i> Más Información
                    </a>
                `;
        }
    }

    // =============================================
    // FUNCIONES AUXILIARES
    // =============================================
    
    getIconoTipo(tipo) {
        const iconos = {
            'perro': 'fa-dog',
            'gato': 'fa-cat', 
            'conejo': 'fa-rabbit',
            'ave': 'fa-crow',
            'hamster': 'fa-hamsa',
            'otros': 'fa-paw'
        };
        return iconos[tipo] || 'fa-paw';
    }

    getEstadoTexto(estado) {
        const estados = {
            'disponible': 'Disponible',
            'reservado': 'Reservado',
            'adoptado': 'Adoptado',
            'urgente': '¡URGENTE!'
        };
        return estados[estado] || estado;
    }

    truncarTexto(texto, limite) {
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

    actualizarContadorResultados() {
        const contador = document.getElementById('resultados-actuales');
        const totalMascotas = document.getElementById('total-mascotas');
        
        if (contador) {
            contador.textContent = this.mascotasFiltradas.length;
        }
        
        if (totalMascotas) {
            totalMascotas.textContent = this.mascotas.length;
        }
    }

    // =============================================
    // CONFIGURACIÓN DE EVENTOS
    // =============================================
    
    configurarEventListeners() {
        // Filtros por tipo
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Actualizar UI de botones
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Aplicar filtro
                this.filtrarMascotas(btn.dataset.tipo);
            });
        });

        // Búsqueda
        const campoBusqueda = document.getElementById('buscar-mascota');
        if (campoBusqueda) {
            // Búsqueda en tiempo real con debounce
            let timeoutBusqueda;
            campoBusqueda.addEventListener('input', (e) => {
                clearTimeout(timeoutBusqueda);
                timeoutBusqueda = setTimeout(() => {
                    this.buscarMascotas(e.target.value);
                }, 300);
            });

            // Búsqueda al presionar Enter
            campoBusqueda.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    clearTimeout(timeoutBusqueda);
                    this.buscarMascotas(e.target.value);
                }
            });
        }

        // Cerrar modal
        const modal = document.getElementById('modal-mascota');
        if (modal) {
            // Cerrar al hacer clic fuera del contenido
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.cerrarModal();
                }
            });

            // Cerrar con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('show')) {
                    this.cerrarModal();
                }
            });
        }

        // Botón de cerrar modal
        const btnCerrar = document.querySelector('.modal-close');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.cerrarModal());
        }
    }

    // =============================================
    // INICIALIZACIÓN
    // =============================================
    
    inicializarGaleria() {
        // Ocultar loading después de un breve delay
        setTimeout(() => {
            const loadingState = document.getElementById('loading-state');
            if (loadingState) {
                loadingState.style.display = 'none';
            }
            
            // Mostrar mascotas iniciales
            this.mostrarMascotas();
            this.actualizarContadorResultados();
            
            // Inicializar animaciones si AOS está disponible
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 800);
    }
}

// =============================================
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// =============================================

function abrirModal(id) {
    if (window.galeriaApp) {
        window.galeriaApp.abrirModal(id);
    }
}

function cerrarModal() {
    if (window.galeriaApp) {
        window.galeriaApp.cerrarModal();
    }
}

function resetearFiltros() {
    if (window.galeriaApp) {
        window.galeriaApp.resetearFiltros();
    }
}

function irAAdopcion(idMascota) {
    if (window.galeriaApp) {
        window.galeriaApp.irAAdopcion(idMascota);
    }
}

// =============================================
// INICIALIZACIÓN AUTOMÁTICA
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación de galería
    window.galeriaApp = new GaleriaApp();
    
    console.log('🖼️ Galería PETHOUSE inicializada correctamente');
    
    // Debug para desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Modo desarrollo - Funciones disponibles:');
        console.log('   galeriaApp.filtrarMascotas("tipo")');
        console.log('   galeriaApp.buscarMascotas("texto")');
        console.log('   galeriaApp.resetearFiltros()');
    }
});

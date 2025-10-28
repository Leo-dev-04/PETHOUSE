// =============================================
// ADOPCIONES MODERNO - JAVASCRIPT AVANZADO
// =============================================

class AdopcionesApp {
    constructor() {
        this.mascotas = [];
        this.mascotasFiltradas = [];
        this.favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        this.paginaActual = 1;
        this.mascotasPorPagina = 12;
        this.filtrosActivos = {};
        this.ordenamientoActual = 'reciente';
        
        this.init();
    }

    init() {
        this.cargarMascotas();
        this.configurarEventListeners();
        this.configurarIntersectionObserver();
        this.animarContadores();
        this.configurarNavegacion();
        
        // Actualizar contador inicial de favoritos
        this.actualizarContadorFavoritos();
        
        // Verificar si viene de galería para destacar mascota específica
        this.verificarDesdeGaleria();
        
        // Aplicar filtros iniciales (muestra todas las mascotas)
        setTimeout(() => {
            this.aplicarFiltros();
            this.inicializarEstadoVisualFiltros();
        }, 100);
        
        // Debug info para desarrollo
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🔧 Modo desarrollo detectado - funciones de debug disponibles:');
            console.log('   app.debugFiltros() - Ver estado de filtros');
            console.log('   app.simularFiltro(tipo, valor) - Simular filtro');
            console.log('   app.resetearTodo() - Limpiar todo');
        }
    }

    inicializarEstadoVisualFiltros() {
        // Verificar y marcar campos que ya tienen valores
        const elementos = [
            'tipo-mascota',
            'edad-mascota',
            'tamano-mascota',
            'genero-mascota',
            'personalidad-mascota',
            'buscar-nombre'
        ];

        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                this.marcarCampoModificado(elemento);
            }
        });
    }

    // Funciones de debug para desarrollo
    debugFiltros() {
        console.log('🔍 Estado actual de filtros:');
        console.table(this.filtrosActivos);
        console.log('📊 Mascotas filtradas:', this.mascotasFiltradas.length);
        console.log('📄 Página actual:', this.paginaActual);
        console.log('❤️ Favoritos:', this.favoritos);
        return {
            filtros: this.filtrosActivos,
            resultados: this.mascotasFiltradas.length,
            pagina: this.paginaActual,
            favoritos: this.favoritos.length
        };
    }

    simularFiltro(campo, valor) {
        const elemento = document.getElementById(`${campo}-mascota`);
        if (elemento) {
            elemento.value = valor;
            this.aplicarFiltros();
            console.log(`✅ Filtro '${campo}' aplicado con valor '${valor}'`);
        } else {
            console.error(`❌ Campo '${campo}-mascota' no encontrado`);
        }
    }

    resetearTodo() {
        this.limpiarFiltros();
        this.favoritos = [];
        localStorage.removeItem('favoritos');
        this.actualizarContadorFavoritos();
        console.log('🔄 Todo reseteado');
    }

    // =============================================
    // NAVEGACIÓN DESDE GALERÍA
    // =============================================
    
    verificarDesdeGaleria() {
        const mascotaDestacada = localStorage.getItem('destacarMascota');
        const origenGaleria = localStorage.getItem('origenGaleria');
        
        if (mascotaDestacada && origenGaleria) {
            console.log(`🖼️ Navegación desde galería - Destacando mascota ID: ${mascotaDestacada}`);
            
            // Limpiar localStorage
            localStorage.removeItem('destacarMascota');
            localStorage.removeItem('origenGaleria');
            
            // Programar el destacado después de que se carguen las mascotas
            setTimeout(() => {
                this.destacarMascota(parseInt(mascotaDestacada));
            }, 1500);
        }
    }
    
    destacarMascota(idMascota) {
        // Buscar la carta de la mascota en el DOM
        const cartaMascota = document.querySelector(`.mascota-card[data-id="${idMascota}"]`);
        
        if (cartaMascota) {
            // Scroll suave hacia la mascota
            cartaMascota.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
            
            // Efecto de destacado
            setTimeout(() => {
                cartaMascota.classList.add('mascota-destacada');
                
                // Mostrar notificación
                const nombreMascota = this.mascotas.find(m => m.id === idMascota)?.nombre || 'la mascota';
                this.mostrarNotificacion(`¡Aquí está ${nombreMascota}! Viniste desde la galería 🐾`, 'success');
                
                // Remover el destacado después de 3 segundos
                setTimeout(() => {
                    cartaMascota.classList.remove('mascota-destacada');
                }, 3000);
            }, 800);
        } else {
            console.warn(`⚠️ No se encontró la carta de la mascota con ID: ${idMascota}`);
        }
    }

    // =============================================
    // DATOS DE MASCOTAS
    // =============================================

    cargarMascotas() {
        this.mascotas = [
            {
                id: 1,
                nombre: "Luna",
                tipo: "Gata",
                raza: "Persa ",
                edad: "2 meses",
                edadMeses: "2 meses",
                genero: "hembra",
                tamaño: "pequeña",
                peso: "1 kg",
                personalidad: ["cariñosa", "juguetona", "inteligente"],
                descripcion: "Luna es una gata increíblemente dulce y cariñosa. Le encanta jugar con niños y otras mascotas.",
                imagen: "../assets/images/luna.webp",
                estado: "disponible",
                badges: ["nuevo"],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-15",
                cuidadosEspeciales: false,
                historia: "Luna fue rescatada de la calle cuando estaba recien nacida. Ha sido cuidada con amor y está lista para encontrar su hogar definitivo.",
                compatibilidad: {
                    niños: true,
                    otrasmascotas: true,
                    apartamento: false
                }
            },
            {
                id: 2,
                nombre: "Milo",
                tipo: "gato",
                raza: "Mestizo",
                edad: "1 año",
                edadMeses: 12,
                genero: "macho",
                tamaño: "mediano",
                peso: "3 kg",
                personalidad: ["independiente", "tranquilo", "curioso"],
                descripcion: "Milo es un gato joven y curioso. Le gusta explorar y es muy independiente, pero también disfruta de las caricias y el tiempo de calidad.",
                imagen: "../assets/images/milo.jpg",
                estado: "disponible",
                badges: [],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-20",
                cuidadosEspeciales: false,
                historia: "Milo llegó a nosotros cuando su familia anterior no pudo seguir cuidándolo. Es un gato sano y sociable.",
                compatibilidad: {
                    niños: true,
                    otrasmascotas: true,
                    apartamento: true
                }
            },
            {
                id: 3,
                nombre: "Rocky",
                tipo: "perro",
                raza: "Pitbull",
                edad: "3 meses",
                edadMeses: "3",
                genero: "macho",
                tamaño: "pequeño",
                peso: "7 kg",
                personalidad: ["leal", "protector", "energico"],
                descripcion: "Rocky es un perro increíblemente leal y protector. Necesita una familia experimentada que entienda su energía y le proporcione ejercicio regular.",
                imagen: "../assets/images/rocky.jpg",
                estado: "disponible",
                badges: [],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-10",
                cuidadosEspeciales: false,
                historia: "Rocky fue abandonado pero ha demostrado ser un perro increíblemente cariñoso con las personas adecuadas.",
                compatibilidad: {
                    niños: false,
                    otrasmascotas: false,
                    apartamento: false
                }
            },
            {
                id: 4,
                nombre: "Bella",
                tipo: "perro",
                raza: "Golden Retriever",
                edad: "5 años",
                edadMeses: 60,
                genero: "hembra",
                tamaño: "grande",
                peso: "25 kg",
                personalidad: ["tranquila", "cariñosa", "obediente"],
                descripcion: "Bella es una perra madura y tranquila, perfecta para una familia que busca una compañera leal y de buen comportamiento.",
                imagen: "../assets/images/bella.webp",
                estado: "disponible",
                badges: [],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-05",
                cuidadosEspeciales: false,
                historia: "Bella llegó cuando su familia se mudó y no pudo llevarla. Es una perra muy bien educada.",
                compatibilidad: {
                    niños: true,
                    otrasmascotas: true,
                    apartamento: true
                }
            },
            {
                id: 5,
                nombre: "Pepito",
                tipo: "cotorra",
                raza: "Cotorra Cherry Headed",
                edad: "5 años",
                edadMeses: 60,
                genero: "Macho",
                tamaño: "pequeño",
                peso: "150 gramos",
                personalidad: ["parlanchin", "inteligente", "sociable", "coquetón"],
                descripcion: "Pepito es un cotorro muy inteligente y parlanchin. Le encanta aprender nuevas palabras y interactuar con las personas. Es muy sociable, divertido y le gusta cantar.",
                imagen: "../assets/images/pepito.jpg",
                estado: "disponible",
                badges: [],
                vacunas: true,
                esterilizado: false,
                microchip: true,
                fechaIngreso: "2023-12-15",
                cuidadosEspeciales: false,
                historia: "Pepito llegó a PETHOUSE cuando su familia anterior se mudó al extranjero. Es una cotorra muy inteligente que sabe cantar y frases divertidas.",
                compatibilidad: {
                    niños: true,
                    otrasmascotas: false,
                    apartamento: true
                }
            },
            {
                id: 6,
                nombre: "Coco",
                tipo: "Hámster",
                raza: "Dorado",
                edad: "2 meses",
                edadMeses: 2,
                genero: "macho",
                tamaño: "pequeño",
                peso: "50 gramos",
                personalidad: ["juguetón", "curioso", "energético"],
                descripcion: "Coco es un adorable hámster bebé dorado de apenas 2 meses. Es muy activo y curioso, siempre explorando su entorno. Le encanta correr en su rueda y guardar comida en sus mejillas. Es perfecto para niños que quieren aprender sobre el cuidado de mascotas pequeñas.",
                imagen: "../assets/images/coco.jpg",
                estado: "disponible",
                badges: [],
                vacunas: true,
                esterilizado: false,
                microchip: false,
                fechaIngreso: "2024-01-12",
                cuidadosEspeciales: true,
                historia: "Coco llegó a Pethouse muy pequeñito cuando su familia anterior se mudó y no podía llevárselo. Ha crecido sano y fuerte bajo nuestro cuidado.",
                compatibilidad: {
                    niños: true,
                    otrasmascotas: false,
                    apartamento: true
                }
            },
            {
                id: 8,
                nombre: "Nala",
                tipo: "gato",
                raza: "Siamés",
                edad: "1 años",
                edadMeses: "12",
                genero: "hembra",
                tamaño: "mediano",
                peso: "2 kg",
                personalidad: ["vocal", "activa", "inteligente"],
                descripcion: "Nala es una gata siamesa muy vocal e inteligente. Le gusta 'conversar' con sus humanos y es muy activa.",
                imagen: "../assets/images/siames.jpg",
                estado: "disponible",
                badges: ["nuevo"],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-18",
                cuidadosEspeciales: false,
                historia: "Nala es una gata joven que fue encontrada en la calle y ha sido socializada con mucho cariño.",
                compatibilidad: {
                    niños: false,
                    otrasmascotas: true,
                    apartamento: true
                }
            },
            {
                id: 9,
                nombre: "Bruno",
                tipo: "perro",
                raza: "Bulldog Francés",
                edad: "2 años",
                edadMeses: 24,
                genero: "macho",
                tamaño: "pequeño",
                peso: "12 kg",
                personalidad: ["tranquilo", "companero", "gracioso"],
                descripcion: "Bruno es un bulldog francés muy gracioso y tranquilo. Es el compañero perfecto para la vida en apartamento.",
                imagen: "../assets/images/bruno.jpg",
                estado: "reservado",
                badges: [],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-14",
                cuidadosEspeciales: true,
                historia: "Bruno necesita cuidados respiratorios especiales pero es un perro increíblemente amoroso.",
                compatibilidad: {
                    niños: true,
                    otrasmascotas: true,
                    apartamento: true
                }
            },
            {
                id: 10,
                nombre: "Simba",
                tipo: "gato",
                raza: "No se",
                edad: "2 años",
                edadMeses: 30,
                genero: "macho",
                tamaño: "grande",
                peso: "3 kg",
                personalidad: ["gentil", "gigante", "cariñoso"],
                descripcion: "Simba es un gato gentil. A pesar de su enfermedad, es increíblemente cariñoso y tranquilo.",
                imagen: "../assets/images/simba.webp",
                estado: "disponible",
                badges: ["especial"],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-11",
                cuidadosEspeciales: false,
                historia: "Simba fue entregado por una familia que no podía manejar su enfermedad, pero es increíblemente dócil.",
                compatibilidad: {
                niños: true,
                otrasmascotas: true,
                apartamento: false
                }
            },
            {
                id: 11,
                nombre: "Filimon",
                tipo: "burro",
                raza: "Burro Doméstico",
                edad: "8 años",
                edadMeses: 96,
                genero: "macho",
                tamaño: "grande",
                peso: "180 kg",
                personalidad: ["gentil", "trabajador", "cariñoso"],
                descripcion: "Filimon es un burro noble y trabajador con un corazón enorme. Es increíblemente gentil con las personas y tiene una personalidad dulce que cautiva a todos. Perfecto para familias rurales.",
                imagen: "../assets/images/filimon.webp",
                estado: "disponible",
                badges: [],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-11",
                cuidadosEspeciales: false,
                historia: "Filimon llegó a PETHOUSE cuando su anterior familia ya no podía cuidarlo adecuadamente. Es un burro muy trabajador que disfruta de la compañía humana y es especialmente tranquilo con niños.",
                compatibilidad: {
                niños: true,
                otrasmascotas: true,
                apartamento: false
                }
            },
                        {
                id: 12,
                nombre: "Chente",
                tipo: "Conejo",
                raza: "Conejo",
                edad: "5 meses",
                edadMeses: 5,
                genero: "macho",
                tamaño: "mediano",
                peso: "1 kg",
                personalidad: ["elegante", "mariachi", "cariñoso"],
                descripcion: "Chente es un conejo que le gusta andar bricando, recibir caricias y ponerse su sombrero de mariachi",
                imagen: "../assets/images/chente.jpg",
                estado: "disponible",
                badges: [],
                vacunas: true,
                esterilizado: true,
                microchip: true,
                fechaIngreso: "2024-01-11",
                cuidadosEspeciales: false,
                historia: "Tambor llegó a Pethouse ",
                compatibilidad: {
                niños: true,
                otrasmascotas: true,
                apartamento: false
                }
            }
        ];

        // Validar datos de mascotas
        try {
            this.validarDatosMascotas();
            this.mascotasFiltradas = [...this.mascotas];
            this.renderizarCatalogo();
            this.actualizarContadorResultados();
            console.log(`✅ ${this.mascotas.length} mascotas cargadas correctamente`);
        } catch (error) {
            console.error('❌ Error al cargar mascotas:', error);
            this.mostrarNotificacion('Error al cargar mascotas', 'error');
        }
    }

    validarDatosMascotas() {
        const camposRequeridos = ['id', 'nombre', 'tipo', 'edad', 'genero', 'personalidad'];
        
        this.mascotas.forEach((mascota, index) => {
            camposRequeridos.forEach(campo => {
                if (!mascota[campo]) {
                    throw new Error(`Mascota ${index + 1}: Campo '${campo}' es requerido`);
                }
            });
            
            // Validar tipos específicos
            if (!['perro', 'gato', 'otros'].includes(mascota.tipo)) {
                console.warn(`⚠️ Mascota ${mascota.nombre}: Tipo '${mascota.tipo}' no reconocido`);
            }
            
            if (!Array.isArray(mascota.personalidad)) {
                throw new Error(`Mascota ${mascota.nombre}: 'personalidad' debe ser un array`);
            }
        });
    }

    // =============================================
    // CONFIGURACIÓN DE EVENTOS
    // =============================================

    configurarEventListeners() {
        // Filtros principales - Solo marcar campos modificados, no aplicar inmediatamente
        const filtroTipo = document.getElementById('tipo-mascota');
        const filtroEdad = document.getElementById('edad-mascota');
        const filtroTamano = document.getElementById('tamano-mascota');
        const filtroGenero = document.getElementById('genero-mascota');
        const filtroPersonalidad = document.getElementById('personalidad-mascota');
        const campoBusqueda = document.getElementById('buscar-nombre');
        
        // Marcar campos modificados visualmente sin aplicar filtros
        if (filtroTipo) filtroTipo.addEventListener('change', () => this.marcarCampoModificado(filtroTipo));
        if (filtroEdad) filtroEdad.addEventListener('change', () => this.marcarCampoModificado(filtroEdad));
        if (filtroTamano) filtroTamano.addEventListener('change', () => this.marcarCampoModificado(filtroTamano));
        if (filtroGenero) filtroGenero.addEventListener('change', () => this.marcarCampoModificado(filtroGenero));
        if (filtroPersonalidad) filtroPersonalidad.addEventListener('change', () => this.marcarCampoModificado(filtroPersonalidad));
        
        if (campoBusqueda) {
            // Solo buscar con debounce si hay al menos 3 caracteres
            campoBusqueda.addEventListener('input', this.debounce((e) => {
                this.marcarCampoModificado(campoBusqueda);
                if (e.target.value.length >= 3 || e.target.value.length === 0) {
                    this.aplicarFiltros();
                }
            }, 500));
            
            // Event listener para Enter - aplicar filtros inmediatamente
            campoBusqueda.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.aplicarFiltros();
                }
            });
        }

        // Botón de búsqueda manual
        const btnBusqueda = document.getElementById('search-btn');
        if (btnBusqueda) {
            btnBusqueda.addEventListener('click', () => this.aplicarFiltros());
        }

        // Botones de filtros
        const btnFiltrar = document.getElementById('btn-filtrar');
        const btnLimpiar = document.getElementById('btn-limpiar');
        const btnFavoritos = document.getElementById('btn-favoritos');
        
        if (btnFiltrar) btnFiltrar.addEventListener('click', () => this.aplicarFiltros());
        if (btnLimpiar) btnLimpiar.addEventListener('click', () => this.limpiarFiltros());
        if (btnFavoritos) btnFavoritos.addEventListener('click', () => this.mostrarFavoritos());

        // Ordenamiento
        const selectOrden = document.getElementById('ordenar-por');
        if (selectOrden) {
            selectOrden.addEventListener('change', (e) => {
                this.ordenamientoActual = e.target.value;
                this.aplicarOrdenamiento();
                this.renderizarCatalogo();
            });
        }

        // Scroll to top
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.getElementById('catalogo-mascotas').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        // Modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.cerrarModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModal();
            }
        });
    }

    // =============================================
    // MANEJO VISUAL DE FILTROS
    // =============================================

    marcarCampoModificado(elemento) {
        // Agregar clase visual para campos con valores
        if (elemento.value && elemento.value !== '') {
            elemento.classList.add('has-value');
        } else {
            elemento.classList.remove('has-value');
        }
        
        // Actualizar indicador de filtros pendientes
        this.actualizarIndicadorFiltrosPendientes();
    }

    actualizarIndicadorFiltrosPendientes() {
        const btnFiltrar = document.getElementById('btn-filtrar');
        const hayFiltrosPendientes = this.hayFiltrosPendientes();
        
        if (btnFiltrar) {
            if (hayFiltrosPendientes) {
                btnFiltrar.classList.add('pending');
                btnFiltrar.innerHTML = '<i class="fas fa-filter"></i> Aplicar Filtros <span class="pending-indicator">●</span>';
                btnFiltrar.style.animation = 'pulse 2s infinite';
            } else {
                btnFiltrar.classList.remove('pending');
                btnFiltrar.innerHTML = '<i class="fas fa-filter"></i> Aplicar Filtros';
                btnFiltrar.style.animation = 'none';
            }
        }
    }

    hayFiltrosPendientes() {
        const elementos = [
            'tipo-mascota',
            'edad-mascota',
            'tamano-mascota',
            'genero-mascota',
            'personalidad-mascota'
        ];

        return elementos.some(id => {
            const elemento = document.getElementById(id);
            return elemento && elemento.value && elemento.value !== '';
        });
    }

    // =============================================
    // SISTEMA DE FILTROS
    // =============================================

    aplicarFiltros() {
        // Mostrar loading
        this.mostrarLoading();
        
        this.filtrosActivos = {
            tipo: document.getElementById('tipo-mascota')?.value || '',
            edad: document.getElementById('edad-mascota')?.value || '',
            tamano: document.getElementById('tamano-mascota')?.value || '',
            genero: document.getElementById('genero-mascota')?.value || '',
            personalidad: document.getElementById('personalidad-mascota')?.value || '',
            busqueda: document.getElementById('buscar-nombre')?.value.toLowerCase() || ''
        };

        // Validar que al menos hay datos para filtrar
        if (!this.mascotas || this.mascotas.length === 0) {
            console.error('No hay mascotas cargadas para filtrar');
            this.ocultarLoading();
            return;
        }

        this.mascotasFiltradas = this.mascotas.filter(mascota => {
            // Filtro por tipo
            if (this.filtrosActivos.tipo && mascota.tipo !== this.filtrosActivos.tipo) {
                return false;
            }

            // Filtro por edad
            if (this.filtrosActivos.edad) {
                const edadMeses = mascota.edadMeses;
                switch (this.filtrosActivos.edad) {
                    case 'cachorro':
                        if (edadMeses > 12) return false;
                        break;
                    case 'joven':
                        if (edadMeses <= 12 || edadMeses > 36) return false;
                        break;
                    case 'adulto':
                        if (edadMeses <= 36 || edadMeses > 84) return false;
                        break;
                    case 'senior':
                        if (edadMeses <= 84) return false;
                        break;
                }
            }

            // Filtro por tamaño
            if (this.filtrosActivos.tamano && mascota.tamaño !== this.filtrosActivos.tamano) {
                return false;
            }

            // Filtro por género
            if (this.filtrosActivos.genero && mascota.genero !== this.filtrosActivos.genero) {
                return false;
            }

            // Filtro por personalidad
            if (this.filtrosActivos.personalidad) {
                if (!mascota.personalidad.includes(this.filtrosActivos.personalidad)) {
                    return false;
                }
            }

            // Filtro por búsqueda
            if (this.filtrosActivos.busqueda) {
                const terminoBusqueda = this.filtrosActivos.busqueda;
                const textoCompleto = `${mascota.nombre} ${mascota.raza} ${mascota.descripcion} ${mascota.personalidad.join(' ')}`.toLowerCase();
                if (!textoCompleto.includes(terminoBusqueda)) {
                    return false;
                }
            }

            return true;
        });

        // Aplicar ordenamiento
        this.aplicarOrdenamiento();
        
        // Resetear página
        this.paginaActual = 1;
        
        // Actualizar vista
        this.renderizarCatalogo();
        this.actualizarContadorResultados();
        this.actualizarPaginacion();
        this.actualizarIndicadorFiltros();
        
        // Mostrar feedback si se aplicaron filtros
        const hayFiltrosActivos = Object.values(this.filtrosActivos).some(valor => valor !== '');
        if (hayFiltrosActivos) {
            const numResultados = this.mascotasFiltradas.length;
            this.mostrarNotificacion(
                `Filtros aplicados: ${numResultados} mascota${numResultados !== 1 ? 's' : ''} encontrada${numResultados !== 1 ? 's' : ''}`, 
                'success'
            );
            
            // Scroll suave a resultados
            setTimeout(() => {
                document.getElementById('catalogo-mascotas')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }

    mostrarLoading() {
        const contenedor = document.getElementById('mascotas-grid');
        if (contenedor) {
            contenedor.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p>Aplicando filtros...</p></div>';
        }
    }

    ocultarLoading() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.style.display = 'none';
        }
    }

    actualizarIndicadorFiltros() {
        const btnFiltrar = document.getElementById('btn-filtrar');
        const hayFiltrosActivos = Object.values(this.filtrosActivos).some(valor => valor !== '');
        
        if (btnFiltrar) {
            if (hayFiltrosActivos) {
                btnFiltrar.classList.add('active');
                btnFiltrar.innerHTML = '<i class="fas fa-check"></i> Filtros Aplicados';
            } else {
                btnFiltrar.classList.remove('active');
                btnFiltrar.innerHTML = '<i class="fas fa-filter"></i> Aplicar Filtros';
            }
        }
    }

    aplicarOrdenamiento() {
        switch (this.ordenamientoActual) {
            case 'nombre':
                this.mascotasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'edad-asc':
                this.mascotasFiltradas.sort((a, b) => a.edadMeses - b.edadMeses);
                break;
            case 'edad-desc':
                this.mascotasFiltradas.sort((a, b) => b.edadMeses - a.edadMeses);
                break;
            case 'reciente':
                this.mascotasFiltradas.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));
                break;
            case 'urgente':
                this.mascotasFiltradas.sort((a, b) => {
                    const aUrgente = a.badges.includes('urgente');
                    const bUrgente = b.badges.includes('urgente');
                    if (aUrgente && !bUrgente) return -1;
                    if (!aUrgente && bUrgente) return 1;
                    return 0;
                });
                break;
        }
    }

    limpiarFiltros() {
        // Limpiar todos los campos de filtro
        const elementos = [
            'tipo-mascota',
            'edad-mascota', 
            'tamano-mascota',
            'genero-mascota',
            'personalidad-mascota',
            'buscar-nombre'
        ];

        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = '';
                // Remover clases visuales
                elemento.classList.remove('has-value');
            }
        });
        
        // Resetear filtros activos
        this.filtrosActivos = {};
        this.mascotasFiltradas = [...this.mascotas];
        this.paginaActual = 1;
        
        // Resetear ordenamiento a default
        const selectOrden = document.getElementById('ordenar-por');
        if (selectOrden) {
            selectOrden.value = 'recientes';
            this.ordenamientoActual = 'recientes';
        }
        
        // Aplicar ordenamiento por defecto
        this.aplicarOrdenamiento();
        
        // Actualizar vista
        this.renderizarCatalogo();
        this.actualizarContadorResultados();
        this.actualizarPaginacion();
        this.actualizarIndicadorFiltros();
        this.actualizarIndicadorFiltrosPendientes();
        
        // Feedback visual
        this.mostrarNotificacion('Filtros limpiados correctamente', 'success');
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'times' : 'info'}"></i>
            <span>${mensaje}</span>
        `;
        
        // Añadir estilos
        Object.assign(notificacion.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notificacion);
        
        // Animar entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }

    mostrarFavoritos() {
        // Filtrar solo las mascotas marcadas como favoritas
        this.mascotasFiltradas = this.mascotas.filter(mascota => 
            this.favoritos.includes(mascota.id)
        );
        
        if (this.mascotasFiltradas.length === 0) {
            // Mostrar mensaje si no hay favoritos
            const contenedor = document.getElementById('mascotas-grid');
            if (contenedor) {
                contenedor.innerHTML = `
                    <div class="no-results-state" style="display: block; grid-column: 1 / -1;">
                        <div class="no-results-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                        <h3>No tienes mascotas favoritas</h3>
                        <p>Agrega mascotas a tus favoritos haciendo clic en el corazón ❤️</p>
                        <button onclick="app.volverACatalogo()" class="btn-primary">
                            <i class="fas fa-search"></i>
                            Explorar Mascotas
                        </button>
                    </div>
                `;
            }
        } else {
            // Resetear página y mostrar favoritos
            this.paginaActual = 1;
            this.renderizarCatalogo();
            this.actualizarContadorResultados();
            this.actualizarPaginacion();
        }
    }

    volverACatalogo() {
        this.limpiarFiltros();
    }

    toggleFavorito(idMascota) {
        const index = this.favoritos.indexOf(idMascota);
        if (index > -1) {
            // Remover de favoritos
            this.favoritos.splice(index, 1);
        } else {
            // Agregar a favoritos
            this.favoritos.push(idMascota);
        }
        
        // Guardar en localStorage
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
        
        // Actualizar contador
        this.actualizarContadorFavoritos();
        
        // Actualizar UI si estamos mostrando favoritos
        const btnFavoritos = document.getElementById('btn-favoritos');
        if (btnFavoritos && btnFavoritos.classList.contains('active')) {
            this.mostrarFavoritos();
        } else {
            // Solo actualizar el catálogo actual
            this.renderizarCatalogo();
        }
    }

    actualizarContadorFavoritos() {
        const contador = document.getElementById('favoritos-count');
        if (contador) {
            contador.textContent = this.favoritos.length;
        }
    }

    mostrarMascotaAlAzar() {
        const mascotasDisponibles = this.mascotas.filter(m => m.estado === 'disponible');
        if (mascotasDisponibles.length > 0) {
            const mascotaAleatoria = mascotasDisponibles[Math.floor(Math.random() * mascotasDisponibles.length)];
            this.mostrarDetallesMascota(mascotaAleatoria.id);
        }
    }

    // =============================================
    // RENDERIZADO DEL CATÁLOGO
    // =============================================

    renderizarCatalogo() {
        const contenedor = document.getElementById('mascotas-grid');
        if (!contenedor) return;

        // Mostrar estado de carga
        contenedor.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p>Cargando mascotas...</p></div>';

        setTimeout(() => {
            const inicio = (this.paginaActual - 1) * this.mascotasPorPagina;
            const fin = inicio + this.mascotasPorPagina;
            const mascotasPagina = this.mascotasFiltradas.slice(inicio, fin);

            if (mascotasPagina.length === 0) {
                contenedor.innerHTML = this.generarEstadoVacio();
                return;
            }

            contenedor.innerHTML = mascotasPagina.map(mascota => this.generarCardMascota(mascota)).join('');
            
            // Configurar eventos para las nuevas cards
            this.configurarEventosCards();
            
            // Animar cards
            this.animarCards();
        }, 500);
    }

    generarCardMascota(mascota) {
        const esFavorito = this.favoritos.includes(mascota.id);
        const iconoGenero = mascota.genero === 'macho' ? 'mars' : 'venus';
        const colorGenero = mascota.genero === 'macho' ? '#3498db' : '#e91e63';

        return `
            <div class="mascota-card" data-id="${mascota.id}">
                <div class="mascota-imagen">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}" 
                         onerror="this.src='../assets/images/perrofeliz.webp'; this.onerror=null;" 
                         loading="lazy">
                    
                    ${mascota.badges.length > 0 ? `
                        <div class="mascota-badges">
                            ${mascota.badges.map(badge => `
                                <span class="mascota-badge ${badge}">${this.obtenerTextoBadge(badge)}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="mascota-favorito ${esFavorito ? 'active' : ''}" data-id="${mascota.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                
                <div class="mascota-info">
                    <h3 class="mascota-nombre">${mascota.nombre}</h3>
                    
                    <div class="mascota-detalles">
                        <div class="detalle-item">
                            <i class="fas fa-${iconoGenero}" style="color: ${colorGenero}"></i>
                            <span>${mascota.genero}</span>
                        </div>
                        <div class="detalle-item">
                            <i class="fas fa-birthday-cake"></i>
                            <span>${mascota.edad}</span>
                        </div>
                        <div class="detalle-item">
                            <i class="fas fa-weight"></i>
                            <span>${mascota.peso}</span>
                        </div>
                        <div class="detalle-item">
                            <i class="fas fa-ruler"></i>
                            <span>${mascota.tamaño}</span>
                        </div>
                    </div>
                    
                    <p class="mascota-descripcion">${mascota.descripcion}</p>
                    
                    <div class="mascota-personalidad">
                        ${mascota.personalidad.map(trait => `
                            <span class="personalidad-tag">${trait}</span>
                        `).join('')}
                    </div>
                    
                    <div class="mascota-acciones">
                        ${mascota.estado === 'disponible' ? `
                            <button class="btn-accion btn-adoptar" data-id="${mascota.id}">
                                <i class="fas fa-heart"></i>
                                Adoptar
                            </button>
                        ` : `
                            <button class="btn-accion btn-adoptar" disabled>
                                <i class="fas fa-clock"></i>
                                Reservado
                            </button>
                        `}
                        <button class="btn-accion btn-ver-mas" data-id="${mascota.id}">
                            <i class="fas fa-info-circle"></i>
                            Ver más
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generarEstadoVacio() {
        const hayFiltrosActivos = Object.values(this.filtrosActivos).some(valor => valor !== '');
        
        return `
            <div class="no-results-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div class="no-results-icon" style="font-size: 4rem; color: #9ca3af; margin-bottom: 1rem;">
                    <i class="fas fa-${hayFiltrosActivos ? 'search' : 'heart'}"></i>
                </div>
                <h3 style="font-size: 1.5rem; color: #374151; margin-bottom: 1rem;">
                    ${hayFiltrosActivos ? 'No se encontraron mascotas' : 'No hay mascotas disponibles'}
                </h3>
                <p style="color: #6b7280; margin-bottom: 2rem; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                    ${hayFiltrosActivos 
                        ? 'Intenta ajustar los criterios de búsqueda para encontrar más opciones.'
                        : 'Actualmente no hay mascotas disponibles para adopción. Vuelve a revisar pronto.'
                    }
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    ${hayFiltrosActivos ? `
                        <button class="btn-primary" onclick="window.limpiarFiltros()" style="padding: 0.75rem 1.5rem; border-radius: 8px; background: #4a7c59; color: white; border: none; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-times"></i> Limpiar Filtros
                        </button>
                        <button class="btn-secondary" onclick="window.mostrarMascotaAlAzar()" style="padding: 0.75rem 1.5rem; border-radius: 8px; background: transparent; color: #4a7c59; border: 2px solid #4a7c59; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-random"></i> Mascota al Azar
                        </button>
                    ` : `
                        <a href="contacto.html" class="btn-primary" style="padding: 0.75rem 1.5rem; border-radius: 8px; background: #4a7c59; color: white; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-envelope"></i> Contactar
                        </a>
                    `}
                </div>
            </div>
        `;
    }

    obtenerTextoBadge(badge) {
        const badges = {
            urgente: 'Urgente',
            nuevo: 'Nuevo',
            especial: 'Cuidados especiales'
        };
        return badges[badge] || badge;
    }

    // =============================================
    // EVENTOS DE CARDS
    // =============================================

    configurarEventosCards() {
        // Favoritos
        document.querySelectorAll('.mascota-favorito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.toggleFavorito(id);
            });
        });

        // Ver detalles
        document.querySelectorAll('.btn-ver-mas').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.mostrarDetallesMascota(id);
            });
        });

        // Adoptar
        document.querySelectorAll('.btn-adoptar:not([disabled])').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.iniciarProcesoAdopcion(id);
            });
        });

        // Click en card completa
        document.querySelectorAll('.mascota-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                this.mostrarDetallesMascota(id);
            });
        });
    }

    toggleFavorito(id) {
        const index = this.favoritos.indexOf(id);
        const btn = document.querySelector(`.mascota-favorito[data-id="${id}"]`);
        
        if (index > -1) {
            this.favoritos.splice(index, 1);
            btn.classList.remove('active');
        } else {
            this.favoritos.push(id);
            btn.classList.add('active');
        }
        
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
        this.mostrarNotificacion(
            index > -1 ? 'Removido de favoritos' : 'Agregado a favoritos',
            'info'
        );
    }

    // =============================================
    // MODAL DE DETALLES
    // =============================================

    mostrarDetallesMascota(id) {
        const mascota = this.mascotas.find(m => m.id === id);
        if (!mascota) return;

        const modalHTML = this.generarModalMascota(mascota);
        
        // Crear modal si no existe
        let modal = document.getElementById('modal-mascota');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-mascota';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = modalHTML;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Configurar eventos del modal
        this.configurarEventosModal(mascota);
    }

    generarModalMascota(mascota) {
        const esFavorito = this.favoritos.includes(mascota.id);
        
        return `
            <div class="modal-content">
                <button class="modal-close" onclick="adopcionesApp.cerrarModal()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
                    <div>
                        <img src="${mascota.imagen}" alt="${mascota.nombre}" onerror="this.src='../assets/images/perrofeliz.webp'; this.onerror=null;" style="width: 100%; border-radius: 12px;">
                        
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${mascota.badges.map(badge => `
                                <span class="mascota-badge ${badge}">${this.obtenerTextoBadge(badge)}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; color: var(--text-primary); margin: 0;">${mascota.nombre}</h2>
                            <button class="mascota-favorito ${esFavorito ? 'active' : ''}" data-id="${mascota.id}" style="position: static;">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                        
                        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div><strong>Raza:</strong> ${mascota.raza}</div>
                                <div><strong>Edad:</strong> ${mascota.edad}</div>
                                <div><strong>Género:</strong> ${mascota.genero}</div>
                                <div><strong>Tamaño:</strong> ${mascota.tamaño}</div>
                                <div><strong>Peso:</strong> ${mascota.peso}</div>
                                <div><strong>Estado:</strong> ${mascota.estado}</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 2rem;">
                            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">Personalidad</h4>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${mascota.personalidad.map(trait => `
                                    <span class="personalidad-tag">${trait}</span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 2rem;">
                            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">Historia</h4>
                            <p style="color: var(--text-secondary); line-height: 1.6;">${mascota.historia}</p>
                        </div>
                        
                        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                            <h4 style="color: var(--text-primary); margin-bottom: 1rem;">Información médica</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-syringe" style="color: ${mascota.vacunas ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                    <span>Vacunas: ${mascota.vacunas ? 'Al día' : 'Pendientes'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-cut" style="color: ${mascota.esterilizado ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                    <span>Esterilizado: ${mascota.esterilizado ? 'Sí' : 'No'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-microchip" style="color: ${mascota.microchip ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                    <span>Microchip: ${mascota.microchip ? 'Sí' : 'No'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-heart-pulse" style="color: ${mascota.cuidadosEspeciales ? 'var(--warning-color)' : 'var(--success-color)'}"></i>
                                    <span>Cuidados especiales: ${mascota.cuidadosEspeciales ? 'Sí' : 'No'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                            <h4 style="color: var(--text-primary); margin-bottom: 1rem;">Compatibilidad</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-child" style="color: ${mascota.compatibilidad.niños ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                    <span>Niños: ${mascota.compatibilidad.niños ? 'Sí' : 'No'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-paw" style="color: ${mascota.compatibilidad.otrasmascotas ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                    <span>Otras mascotas: ${mascota.compatibilidad.otrasmascotas ? 'Sí' : 'No'}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-building" style="color: ${mascota.compatibilidad.apartamento ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                    <span>Apartamento: ${mascota.compatibilidad.apartamento ? 'Sí' : 'No'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem;">
                            ${mascota.estado === 'disponible' ? `
                                <button class="cta-btn primary large" onclick="adopcionesApp.iniciarProcesoAdopcion(${mascota.id})" style="flex: 1;">
                                    <i class="fas fa-heart"></i>
                                    Iniciar adopción
                                </button>
                            ` : `
                                <button class="cta-btn" disabled style="flex: 1; opacity: 0.5;">
                                    <i class="fas fa-clock"></i>
                                    No disponible
                                </button>
                            `}
                            <button class="cta-btn secondary" onclick="adopcionesApp.compartirMascota(${mascota.id})" style="flex: 0 0 auto;">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    configurarEventosModal(mascota) {
        // Favorito en modal
        const btnFavorito = document.querySelector('#modal-mascota .mascota-favorito');
        if (btnFavorito) {
            btnFavorito.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorito(mascota.id);
            });
        }
    }

    cerrarModal() {
        const modal = document.getElementById('modal-mascota');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // =============================================
    // ACCIONES DE ADOPCIÓN
    // =============================================

    iniciarProcesoAdopcion(id) {
        const mascota = this.mascotas.find(m => m.id === id);
        if (!mascota || mascota.estado !== 'disponible') return;

        // Verificar si el usuario está logueado
        if (!this.isUserLoggedIn()) {
            this.mostrarModalLogin(id);
            return;
        }

        // Si está logueado, mostrar confirmación y proceder
        this.mostrarConfirmacionAdopcion(id);
    }

    // Verificar si el usuario está logueado (mejorado)
    isUserLoggedIn() {
        // Verificar diferentes formatos de sesión
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || 
                           sessionStorage.getItem('userLoggedIn') === 'true';
        
        // Verificar sesión completa del sistema
        const sesionPethouse = localStorage.getItem('sesion_pethouse') || 
                              sessionStorage.getItem('sesion_pethouse');
        
        if (sesionPethouse) {
            try {
                const sesion = JSON.parse(sesionPethouse);
                const fechaSesion = new Date(sesion.fechaLogin);
                const ahora = new Date();
                const horasTranscurridas = (ahora - fechaSesion) / (1000 * 60 * 60);
                
                // Sesión válida por 24 horas
                if (horasTranscurridas < 24 && sesion.usuario) {
                    console.log('✅ Sesión válida encontrada para:', sesion.usuario.nombre);
                    return true;
                }
            } catch (e) {
                console.error('❌ Error al validar sesión:', e);
            }
        }
        
        if (userLoggedIn) {
            console.log('✅ Usuario logueado detectado');
            return true;
        }
        
        console.log('❌ Usuario no logueado');
        return false;
    }

    // Mostrar modal pidiendo login
    mostrarModalLogin(mascotaId) {
        const modalHtml = `
            <div class="login-required-modal">
                <div class="modal-icon">
                    <i class="fas fa-user-lock"></i>
                </div>
                <h3>Inicia Sesión para Adoptar</h3>
                <p>Para proceder con la adopción necesitas tener una cuenta activa en PETHOUSE.</p>
                <div class="modal-benefits">
                    <ul>
                        <li><i class="fas fa-check"></i> Proceso de adopción más rápido</li>
                        <li><i class="fas fa-check"></i> Seguimiento de tu solicitud</li>
                        <li><i class="fas fa-check"></i> Comunicación directa con organizaciones</li>
                        <li><i class="fas fa-check"></i> Historial de adopciones</li>
                    </ul>
                </div>
                <div class="modal-actions">
                    <button class="btn-modal primary" onclick="adoptionsManager.redirectToLogin('${mascotaId}')">
                        <i class="fas fa-sign-in-alt"></i>
                        Iniciar Sesión
                    </button>
                    <button class="btn-modal secondary" onclick="adoptionsManager.redirectToRegister('${mascotaId}')">
                        <i class="fas fa-user-plus"></i>
                        Crear Cuenta
                    </button>
                </div>
                <p class="modal-note">¿No tienes cuenta? <a href="#" onclick="adoptionsManager.redirectToRegister('${mascotaId}')">Regístrate gratis</a></p>
            </div>
        `;

        this.mostrarModal(modalHtml);
    }

    // Redirigir a login guardando la intención de adopción
    redirectToLogin(mascotaId) {
        localStorage.setItem('pendingAdoption', mascotaId);
        localStorage.setItem('returnUrl', 'adopciones.html');
        window.location.href = 'login.html?reason=adoption&pet=' + mascotaId;
    }

    // Redirigir a registro guardando la intención de adopción
    redirectToRegister(mascotaId) {
        localStorage.setItem('pendingAdoption', mascotaId);
        localStorage.setItem('returnUrl', 'adopciones.html');
        window.location.href = 'registro.html?reason=adoption&pet=' + mascotaId;
    }

    // Mostrar confirmación de adopción para usuarios logueados
    mostrarConfirmacionAdopcion(id) {
        const mascota = this.mascotas.find(m => m.id === id);
        
        const modalHtml = `
            <div class="adoption-start-modal">
                <div class="modal-header">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}" onerror="this.src='../assets/images/perrofeliz.webp'; this.onerror=null;" class="modal-pet-image">
                    <div class="modal-pet-info">
                        <h3>¿Quieres adoptar a ${mascota.nombre}?</h3>
                        <p>${mascota.tipo} • ${mascota.edad} • ${mascota.ubicacion || 'Chicontepec, Veracruz'}</p>
                    </div>
                </div>
                <div class="modal-body">
                    <p>Elige cómo quieres proceder con la adopción:</p>
                    <div class="adoption-options">
                        <div class="adoption-option">
                            <div class="option-icon">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="option-content">
                                <h4>Adoptar Directamente</h4>
                                <p>Ya estoy seguro(a), quiero adoptar a ${mascota.nombre}</p>
                                <button class="btn-modal primary" onclick="adoptionsManager.startDirectAdoption('${id}')">
                                    <i class="fas fa-file-alt"></i>
                                    Llenar Formulario
                                </button>
                            </div>
                        </div>
                        
                        <div class="adoption-option">
                            <div class="option-icon">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="option-content">
                                <h4>Verificar Compatibilidad IA</h4>
                                <p>Usar nuestro asistente IA para confirmar que es el match perfecto</p>
                                <button class="btn-modal secondary" onclick="adoptionsManager.startAIWizard('${id}')">
                                    <i class="fas fa-magic"></i>
                                    Usar IA Express
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-modal secondary" onclick="adoptionsManager.cerrarModal()">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        this.mostrarModal(modalHtml);
    }

    // Iniciar adopción directa (ir al formulario)
    startDirectAdoption(id) {
        console.log('📝 Iniciando adopción directa para mascota ID:', id);
        
        // Verificar autenticación
        if (!this.isUserLoggedIn()) {
            console.log('⚠️ Usuario perdió la sesión, solicitando login nuevamente');
            this.cerrarModal();
            this.mostrarModalLogin(id);
            return;
        }
        
        console.log('✅ Redirigiendo al formulario de adopción...');
        
        this.cerrarModal();
        this.mostrarNotificacion('Redirigiendo al formulario de adopción...', 'success');
        
        // Guardar información de la adopción
        localStorage.setItem('mascotaAdopcion', id);
        localStorage.setItem('procesoAdopcion', 'formulario-directo');
        
        setTimeout(() => {
            // Redirigir a proceso-adopcion.html con el ID de la mascota
            window.location.href = `proceso-adopcion.html?id=${id}&action=adopt`;
        }, 1500);
    }

    // Iniciar wizard IA (ir a IA Express)
    startAIWizard(id) {
        console.log('🤖 Iniciando wizard IA para mascota ID:', id);
        
        // Verificar autenticación
        if (!this.isUserLoggedIn()) {
            console.log('⚠️ Usuario perdió la sesión, solicitando login nuevamente');
            this.cerrarModal();
            this.mostrarModalLogin(id);
            return;
        }
        
        console.log('✅ Redirigiendo a IA Express...');
        
        this.cerrarModal();
        this.mostrarNotificacion('Iniciando asistente IA de compatibilidad...', 'success');
        
        // Guardar información de la adopción
        localStorage.setItem('mascotaAdopcion', id);
        localStorage.setItem('procesoAdopcion', 'wizard-ia');
        
        setTimeout(() => {
            // Redirigir al wizard IA de adopción con la mascota seleccionada
            window.location.href = 'adopcion-express.html?pet=' + id + '&step=adoption';
        }, 1500);
    }

    // Proceder con la adopción (método anterior - ahora redirige a opciones)
    proceedWithAdoption(id) {
        console.log('🐕 Procediendo con adopción para mascota ID:', id);
        
        // Verificar nuevamente la autenticación
        if (!this.isUserLoggedIn()) {
            console.log('⚠️ Usuario perdió la sesión, solicitando login nuevamente');
            this.cerrarModal();
            this.mostrarModalLogin(id);
            return;
        }
        
        console.log('✅ Autenticación confirmada, iniciando wizard...');
        
        this.cerrarModal();
        this.mostrarNotificacion('Iniciando proceso de adopción digital...', 'success');
        
        // Guardar información de la adopción
        localStorage.setItem('mascotaAdopcion', id);
        localStorage.setItem('procesoAdopcion', 'iniciado');
        
        setTimeout(() => {
            // Redirigir al wizard IA de adopción con la mascota seleccionada
            window.location.href = 'adopcion-express.html?pet=' + id + '&step=adoption';
        }, 1500);
    }

    // =============================================
    // UTILIDADES DE TESTING
    // =============================================

    // Función para simular login (solo para testing)
    simulateLogin() {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', 'Usuario Demo');
        localStorage.setItem('userEmail', 'demo@pethouse.com');
        this.mostrarNotificacion('Sesión iniciada como Usuario Demo', 'success');
        console.log('🔑 Sesión simulada iniciada - para testing');
    }

    // Función para simular logout (solo para testing)
    simulateLogout() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        this.mostrarNotificacion('Sesión cerrada', 'info');
        console.log('🔑 Sesión cerrada - para testing');
    }

    // Función para mostrar modal genérico (mejorada)
    mostrarModal(contenido, tipo = 'default') {
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (modalBody && modalOverlay) {
            modalBody.innerHTML = contenido;
            modalOverlay.classList.add('active');
            
            // Agregar clase específica para el tipo de modal
            modalOverlay.className = `modal-overlay active ${tipo}`;
        }
    }

    compartirMascota(id) {
        const mascota = this.mascotas.find(m => m.id === id);
        if (!mascota) return;

        if (navigator.share) {
            navigator.share({
                title: `Conoce a ${mascota.nombre}`,
                text: `${mascota.descripcion}`,
                url: window.location.href + '?mascota=' + id
            });
        } else {
            // Fallback para navegadores sin soporte para Web Share API
            const url = window.location.href + '?mascota=' + id;
            navigator.clipboard.writeText(url).then(() => {
                this.mostrarNotificacion('Enlace copiado al portapapeles', 'success');
            });
        }
    }

    // =============================================
    // PAGINACIÓN
    // =============================================

    actualizarContadorResultados() {
        const contador = document.getElementById('resultados-count');
        if (contador) {
            const total = this.mascotasFiltradas.length;
            const inicio = (this.paginaActual - 1) * this.mascotasPorPagina + 1;
            const fin = Math.min(this.paginaActual * this.mascotasPorPagina, total);
            
            contador.textContent = total > 0 
                ? `Mostrando ${inicio}-${fin} de ${total} mascotas`
                : 'No se encontraron mascotas';
        }
    }

    actualizarPaginacion() {
        const totalPaginas = Math.ceil(this.mascotasFiltradas.length / this.mascotasPorPagina);
        const contenedorPaginacion = document.getElementById('pagination');
        
        if (!contenedorPaginacion || totalPaginas <= 1) {
            if (contenedorPaginacion) contenedorPaginacion.innerHTML = '';
            return;
        }

        let html = `
            <button class="page-btn" ${this.paginaActual === 1 ? 'disabled' : ''} onclick="adopcionesApp.irPagina(${this.paginaActual - 1})">
                <i class="fas fa-chevron-left"></i>
                Anterior
            </button>
            <div class="page-numbers">
        `;

        const inicio = Math.max(1, this.paginaActual - 2);
        const fin = Math.min(totalPaginas, this.paginaActual + 2);

        if (inicio > 1) {
            html += `<button class="page-btn" onclick="adopcionesApp.irPagina(1)">1</button>`;
            if (inicio > 2) html += `<span style="padding: 0 0.5rem;">...</span>`;
        }

        for (let i = inicio; i <= fin; i++) {
            html += `
                <button class="page-btn ${i === this.paginaActual ? 'active' : ''}" onclick="adopcionesApp.irPagina(${i})">
                    ${i}
                </button>
            `;
        }

        if (fin < totalPaginas) {
            if (fin < totalPaginas - 1) html += `<span style="padding: 0 0.5rem;">...</span>`;
            html += `<button class="page-btn" onclick="adopcionesApp.irPagina(${totalPaginas})">${totalPaginas}</button>`;
        }

        html += `
            </div>
            <button class="page-btn" ${this.paginaActual === totalPaginas ? 'disabled' : ''} onclick="adopcionesApp.irPagina(${this.paginaActual + 1})">
                Siguiente
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        contenedorPaginacion.innerHTML = html;

        // Actualizar información de paginación
        const infoPaginacion = document.getElementById('pagination-info');
        if (infoPaginacion) {
            infoPaginacion.textContent = `Página ${this.paginaActual} de ${totalPaginas}`;
        }
    }

    irPagina(pagina) {
        const totalPaginas = Math.ceil(this.mascotasFiltradas.length / this.mascotasPorPagina);
        
        if (pagina < 1 || pagina > totalPaginas) return;
        
        this.paginaActual = pagina;
        this.renderizarCatalogo();
        this.actualizarContadorResultados();
        this.actualizarPaginacion();
        
        // Scroll al inicio del catálogo
        document.getElementById('catalogo-mascotas').scrollIntoView({
            behavior: 'smooth'
        });
    }

    // =============================================
    // ANIMACIONES Y EFECTOS
    // =============================================

    animarContadores() {
        const contadores = document.querySelectorAll('.stat-number');
        
        contadores.forEach(contador => {
            const valorFinal = parseInt(contador.textContent);
            let valorActual = 0;
            const incremento = valorFinal / 50;
            
            const intervalo = setInterval(() => {
                valorActual += incremento;
                if (valorActual >= valorFinal) {
                    contador.textContent = valorFinal + '+';
                    clearInterval(intervalo);
                } else {
                    contador.textContent = Math.floor(valorActual);
                }
            }, 50);
        });
    }

    animarCards() {
        const cards = document.querySelectorAll('.mascota-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    configurarIntersectionObserver() {
        const opciones = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, opciones);

        // Observar elementos para animaciones
        document.querySelectorAll('.proceso-step, .historia-card').forEach(el => {
            observer.observe(el);
        });
    }

    // =============================================
    // NAVEGACIÓN
    // =============================================

    configurarNavegacion() {
        // Marcar enlace activo
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('href') === 'adopciones.html') {
                item.classList.add('active');
            }
        });

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                
                // Animar hamburger
                const spans = mobileToggle.querySelectorAll('span');
                if (navMenu.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            });

            // Cerrar menú al hacer click en un enlace
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-item')) {
                    navMenu.classList.remove('active');
                    const spans = mobileToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            });
        }
    }

    // =============================================
    // UTILIDADES
    // =============================================

    debounce(func, wait) {
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

    // Mostrar formulario de adopción directa
    mostrarFormularioAdopcion(id) {
        const mascota = this.mascotas.find(m => m.id === id);
        
        const formHtml = `
            <div class="adoption-form-modal">
                <div class="modal-header">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}" onerror="this.src='../assets/images/perrofeliz.webp'; this.onerror=null;" class="modal-pet-image">
                    <div class="modal-pet-info">
                        <h3>Formulario de Adopción - ${mascota.nombre}</h3>
                        <p>${mascota.tipo} • ${mascota.edad} • ${mascota.ubicacion || 'Chicontepec, Veracruz'}</p>
                    </div>
                </div>
                
                <div class="modal-body">
                    <form id="adoption-form" class="adoption-form">
                        <div class="form-section">
                            <h4><i class="fas fa-user"></i> Información Personal</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Nombre Completo *</label>
                                    <input type="text" name="nombre" required>
                                </div>
                                <div class="form-group">
                                    <label>Teléfono *</label>
                                    <input type="tel" name="telefono" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Email *</label>
                                    <input type="email" name="email" required>
                                </div>
                                <div class="form-group">
                                    <label>Edad *</label>
                                    <input type="number" name="edad" min="18" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <h4><i class="fas fa-home"></i> Información del Hogar</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Tipo de Vivienda *</label>
                                    <select name="tipoVivienda" required>
                                        <option value="">Seleccionar...</option>
                                        <option value="casa">Casa</option>
                                        <option value="apartamento">Apartamento</option>
                                        <option value="finca">Finca</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>¿Tienes patio? *</label>
                                    <select name="patio" required>
                                        <option value="">Seleccionar...</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>¿Tienes otras mascotas? *</label>
                                <select name="otrasMascotas" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="no">No</option>
                                    <option value="perros">Sí, perros</option>
                                    <option value="gatos">Sí, gatos</option>
                                    <option value="ambos">Sí, perros y gatos</option>
                                    <option value="otros">Sí, otras mascotas</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-section">
                            <h4><i class="fas fa-heart"></i> Experiencia y Motivación</h4>
                            <div class="form-group">
                                <label>¿Por qué quieres adoptar? *</label>
                                <textarea name="motivacion" rows="3" required placeholder="Cuéntanos por qué quieres adoptar a ${mascota.nombre}..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Experiencia previa con mascotas</label>
                                <textarea name="experiencia" rows="2" placeholder="Describe tu experiencia previa cuidando mascotas..."></textarea>
                            </div>
                        </div>

                        <div class="form-section">
                            <h4><i class="fas fa-clock"></i> Disponibilidad</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Horas disponibles por día *</label>
                                    <select name="horasDisponibles" required>
                                        <option value="">Seleccionar...</option>
                                        <option value="1-3">1-3 horas</option>
                                        <option value="4-6">4-6 horas</option>
                                        <option value="7-9">7-9 horas</option>
                                        <option value="todo-el-dia">Todo el día</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>¿Trabajas desde casa? *</label>
                                    <select name="trabajoCasa" required>
                                        <option value="">Seleccionar...</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                        <option value="parcial">Parcialmente</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-terms">
                            <label class="checkbox-label">
                                <input type="checkbox" name="terminos" required>
                                <span class="checkmark"></span>
                                Acepto los términos y condiciones del proceso de adopción *
                            </label>
                        </div>
                    </form>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-modal primary" onclick="adoptionsManager.submitAdoptionForm('${id}')">
                        <i class="fas fa-paper-plane"></i>
                        Enviar Solicitud
                    </button>
                    <button class="btn-modal secondary" onclick="adoptionsManager.cerrarModal()">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        this.mostrarModal(formHtml, 'adoption-form-modal');
    }

    // Enviar formulario de adopción
    submitAdoptionForm(id) {
        const form = document.getElementById('adoption-form');
        const formData = new FormData(form);
        
        // Validar formulario
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Convertir datos del formulario
        const datos = {};
        for (let [key, value] of formData.entries()) {
            datos[key] = value;
        }
        
        console.log('📝 Enviando solicitud de adopción:', datos);
        
        this.cerrarModal();
        this.mostrarNotificacion('Procesando solicitud de adopción...', 'info');
        
        // Simular envío del formulario
        setTimeout(() => {
            this.mostrarNotificacion('¡Solicitud enviada exitosamente!', 'success');
            this.mostrarConfirmacionEnvio(id, datos);
        }, 2000);
    }

    // Mostrar confirmación de envío
    mostrarConfirmacionEnvio(id, datos) {
        const mascota = this.mascotas.find(m => m.id === id);
        
        const confirmacionHtml = `
            <div class="confirmation-modal">
                <div class="success-header">
                    <i class="fas fa-check-circle"></i>
                    <h3>¡Solicitud Enviada!</h3>
                </div>
                
                <div class="modal-body">
                    <div class="pet-summary">
                        <img src="${mascota.imagen}" alt="${mascota.nombre}" onerror="this.src='../assets/images/perrofeliz.webp'; this.onerror=null;">
                        <div>
                            <h4>${mascota.nombre}</h4>
                            <p>${mascota.tipo} • ${mascota.edad}</p>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h4>Próximos Pasos:</h4>
                        <ol>
                            <li><i class="fas fa-envelope"></i> Recibirás un email de confirmación</li>
                            <li><i class="fas fa-phone"></i> La organización te contactará en 24-48 horas</li>
                            <li><i class="fas fa-video"></i> Programarán una videollamada contigo</li>
                            <li><i class="fas fa-home"></i> Evaluación virtual del hogar</li>
                            <li><i class="fas fa-heart"></i> ¡Conocerás a ${mascota.nombre}!</li>
                        </ol>
                    </div>
                    
                    <div class="contact-info">
                        <p><strong>Número de Solicitud:</strong> #ADO${Date.now().toString().slice(-6)}</p>
                        <p><strong>Email de contacto:</strong> adopciones@pethouse.com</p>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-modal primary" onclick="adoptionsManager.cerrarModal()">
                        <i class="fas fa-check"></i>
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.mostrarModal(confirmacionHtml, 'confirmation-modal');
        }, 500);
    }

    // =============================================
    // FUNCIONES DE TESTING/DEBUG
    // =============================================

    simulateLogin() {
        const sesionData = {
            usuario: {
                nombre: 'Usuario Test',
                email: 'test@pethouse.com',
                tipo: 'adoptante'
            },
            fechaLogin: new Date().toISOString(),
            activa: true
        };
        
        localStorage.setItem('sesion_pethouse', JSON.stringify(sesionData));
        localStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('userLoggedIn', 'true');
        
        console.log('✅ Sesión simulada creada');
        console.log('🔄 Recargar página para ver efectos');
        return true;
    }

    simulateLogout() {
        localStorage.removeItem('sesion_pethouse');
        localStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('sesion_pethouse');
        sessionStorage.removeItem('userLoggedIn');
        
        console.log('❌ Sesión eliminada');
        console.log('🔄 Recargar página para ver efectos');
        return true;
    }

    debugSession() {
        console.log('🔍 DEBUG - Estado de sesión:');
        console.log('localStorage userLoggedIn:', localStorage.getItem('userLoggedIn'));
        console.log('sessionStorage userLoggedIn:', sessionStorage.getItem('userLoggedIn'));
        console.log('localStorage sesion_pethouse:', localStorage.getItem('sesion_pethouse'));
        console.log('sessionStorage sesion_pethouse:', sessionStorage.getItem('sesion_pethouse'));
        console.log('isUserLoggedIn():', this.isUserLoggedIn());
        
        return {
            localStorage: {
                userLoggedIn: localStorage.getItem('userLoggedIn'),
                sesion_pethouse: localStorage.getItem('sesion_pethouse')
            },
            sessionStorage: {
                userLoggedIn: sessionStorage.getItem('userLoggedIn'),
                sesion_pethouse: sessionStorage.getItem('sesion_pethouse')
            },
            isLoggedIn: this.isUserLoggedIn()
        };
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear notificación temporal
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${mensaje}</span>
        `;
        
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--${tipo === 'success' ? 'success' : tipo === 'error' ? 'accent' : 'secondary'}-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notificacion);
        
        // Animar entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }
}

// =============================================
// INICIALIZACIÓN
// =============================================

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia principal de adopciones
    window.adopcionesApp = new AdopcionesApp();
    
    // También crear el manager para compatibilidad con las nuevas funciones
    window.adoptionsManager = window.adopcionesApp;
    
    // Verificar si hay una mascota específica en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const mascotaId = urlParams.get('mascota');
    
    if (mascotaId) {
        setTimeout(() => {
            window.adopcionesApp.mostrarDetallesMascota(parseInt(mascotaId));
        }, 1000);
    }
    
    // Información de testing en consola
    console.log('🐾 PETHOUSE - Sistema de Adopciones Cargado');
    console.log('📝 Para testing, usa en la consola:');
    console.log('   adoptionsManager.simulateLogin() - Simular login');
    console.log('   adoptionsManager.simulateLogout() - Cerrar sesión');
    console.log('   adoptionsManager.debugSession() - Ver estado de sesión');
    console.log('💡 Estado actual:', adoptionsManager.isUserLoggedIn() ? 'Logueado ✅' : 'No logueado ❌');
    
    // Verificar estado de sesión automáticamente
    adoptionsManager.debugSession();
});

// =============================================
// FUNCIONES GLOBALES
// =============================================

// Funciones que pueden ser llamadas desde HTML
window.irPagina = (pagina) => window.adopcionesApp.irPagina(pagina);
window.limpiarFiltros = () => window.adopcionesApp.limpiarFiltros();
window.mostrarMascotaAlAzar = () => window.adopcionesApp.mostrarMascotaAlAzar();
window.toggleFavorito = (idMascota) => window.adopcionesApp.toggleFavorito(idMascota);
window.aplicarFiltros = () => window.adopcionesApp.aplicarFiltros();
window.app = window.adopcionesApp; // Acceso global para debug

// Función de debug para verificar imágenes
window.verificarImagenes = function() {
    const imagenes = document.querySelectorAll('img[src*="assets/images"]');
    console.log(`🖼️ Verificando ${imagenes.length} imágenes...`);
    
    imagenes.forEach((img, index) => {
        console.log(`${index + 1}. ${img.src} - ${img.complete && img.naturalHeight !== 0 ? '✅ Cargada' : '❌ Error'}`);
        
        if (!img.complete || img.naturalHeight === 0) {
            console.warn(`⚠️ Imagen con problemas: ${img.src}`);
        }
    });
};

// Auto-verificar imágenes después de cargar
setTimeout(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Función adicional disponible: verificarImagenes()');
    }
}, 1000);

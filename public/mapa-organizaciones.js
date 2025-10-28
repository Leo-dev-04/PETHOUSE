/* ===============================================
   MAPA DE ORGANIZACIONES - JAVASCRIPT
   PETHOUSE Platform
   =============================================== */

// Variables globales
let mapa = null;
let marcadores = [];
let infoPanel = null;
let organizaciones = [];

// Datos de organizaciones reales en México
const organizacionesData = [
    {
        id: 1,
        nombre: "Fundación ADAN (Amigos de los Animales)",
        tipo: "Fundación",
        ciudad: "Ciudad de México",
        direccion: "Av. Río Mixcoac 211, CDMX",
        coordenadas: [19.3732, -99.1871],
        descripcion: "Fundación mexicana dedicada al rescate, rehabilitación y adopción responsable de animales abandonados desde 1984.",
        animalesDisponibles: 120,
        voluntarios: 45,
        telefono: "+52 55 5563-3401",
        email: "adopciones@fundacionadan.org",
        imagen: "assets/images/familia.jpeg",
        especialidades: ["Perros", "Gatos", "Rehabilitación", "Adopción"],
        horario: "Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM",
        calificacion: 4.9,
        verificado: true
    },
    {
        id: 2,
        nombre: "Milagros Caninos México",
        tipo: "Refugio",
        ciudad: "Guadalajara",
        direccion: "Carretera a Chapala Km 16.5, Tlajomulco, Jalisco",
        coordenadas: [20.5418, -103.4434],
        descripcion: "Refugio especializado en la rehabilitación de perros con discapacidades y necesidades especiales.",
        animalesDisponibles: 85,
        voluntarios: 28,
        telefono: "+52 33 3688-4567",
        email: "contacto@milagroscaninos.org",
        imagen: "assets/images/perrofeliz.webp",
        especialidades: ["Perros con Discapacidad", "Rehabilitación", "Terapia"],
        horario: "Todos los días: 8:00 AM - 5:00 PM",
        calificacion: 4.8,
        verificado: true
    },
    {
        id: 3,
        nombre: "Santuario Rayito de Sol",
        tipo: "Santuario",
        ciudad: "Teotihuacán",
        direccion: "Carretera Teotihuacán-Tulancingo Km 8, Estado de México",
        coordenadas: [19.6925, -98.8560],
        descripcion: "Santuario animal que rescata y rehabilita todo tipo de animales, especializándose en casos extremos de maltrato.",
        animalesDisponibles: 200,
        voluntarios: 60,
        telefono: "+52 594 956-0639",
        email: "rayitodesol@santuario.org.mx",
        imagen: "assets/images/gata.jpg",
        especialidades: ["Perros", "Gatos", "Animales de Granja", "Rehabilitación Extrema"],
        horario: "Visitas con cita previa - Martes a Domingo: 10:00 AM - 4:00 PM",
        calificacion: 4.9,
        verificado: true
    },
    {
        id: 4,
        nombre: "Adopta Tijuana",
        tipo: "Organización Civil",
        ciudad: "Tijuana",
        direccion: "Blvd. Gral. Rodolfo Sánchez Taboada 1531, Tijuana, BC",
        coordenadas: [32.5147, -117.0382],
        descripcion: "Organización civil enfocada en la adopción responsable y control poblacional en la frontera norte.",
        animalesDisponibles: 95,
        voluntarios: 35,
        telefono: "+52 664 634-7890",
        email: "info@adoptatijuana.org",
        imagen: "assets/images/canelo.webp",
        especialidades: ["Adopción", "Esterilización", "Control Poblacional"],
        horario: "Lunes a Sábado: 9:00 AM - 6:00 PM",
        calificacion: 4.6,
        verificado: true
    },
    {
        id: 5,
        nombre: "Brigada de Rescate Animal Puebla",
        tipo: "Brigada",
        ciudad: "Puebla",
        direccion: "Av. 31 Poniente 3116, Col. Las Cuartillas, Puebla",
        coordenadas: [19.0176, -98.2368],
        descripcion: "Brigada especializada en rescate de emergencia y adopción de gatos callejeros en Puebla.",
        animalesDisponibles: 65,
        voluntarios: 22,
        telefono: "+52 222 456-7890",
        email: "rescate@brigadapuebla.mx",
        imagen: "assets/images/coco.jpg",
        especialidades: ["Gatos", "Rescate de Emergencia", "TNR (Trap-Neuter-Return)"],
        horario: "Lunes a Viernes: 8:00 AM - 7:00 PM, Emergencias 24/7",
        calificacion: 4.7,
        verificado: true
    },
    {
        id: 6,
        nombre: "Hogar Animalia AC",
        tipo: "Asociación Civil",
        ciudad: "Monterrey",
        direccion: "Av. González entre Violeta y Azucena, Col. Jardín, San Pedro Garza García, NL",
        coordenadas: [25.6515, -100.3691],
        descripcion: "Asociación civil con más de 15 años rescatando animales en el área metropolitana de Monterrey.",
        animalesDisponibles: 110,
        voluntarios: 40,
        telefono: "+52 81 8356-7890",
        email: "adopciones@hogaranimalia.org",
        imagen: "assets/images/pit.jpg",
        especialidades: ["Perros", "Gatos", "Animales Senior", "Medicina Veterinaria"],
        horario: "Martes a Domingo: 10:00 AM - 6:00 PM",
        calificacion: 4.8,
        verificado: true
    }
];

/* ===============================================
   INICIALIZACIÓN DEL MAPA
   =============================================== */

document.addEventListener('DOMContentLoaded', function() {
    inicializarMapa();
    inicializarControladores();
    inicializarBusquedaAvanzada();
    inicializarDashboard();
    cargarOrganizaciones();
    animacionesEntrada();
    inicializarHeatmap();
    configurarFiltrosAvanzados();
});

/* ===============================================
   DASHBOARD Y ANALÍTICAS
   =============================================== */

function inicializarDashboard() {
    crearPanelAnalisis();
    actualizarMetricasEnTiempoReal();
    inicializarGraficos();
}

function crearPanelAnalisis() {
    const dashboardHTML = `
        <div class="dashboard-panel" id="dashboard-panel">
            <div class="dashboard-header">
                <h3><i class="fas fa-chart-bar"></i> Análisis de Adopciones</h3>
                <button class="btn-toggle-dashboard" onclick="toggleDashboard()">
                    <i class="fas fa-chevron-up"></i>
                </button>
            </div>
            <div class="dashboard-content">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-paw" style="color: #4A90E2;"></i>
                        </div>
                        <div class="metric-info">
                            <span class="metric-number" id="total-animales">0</span>
                            <span class="metric-label">Animales Disponibles</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-heart" style="color: #E74C3C;"></i>
                        </div>
                        <div class="metric-info">
                            <span class="metric-number" id="adopciones-mes">0</span>
                            <span class="metric-label">Adopciones Este Mes</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-users" style="color: #7ED321;"></i>
                        </div>
                        <div class="metric-info">
                            <span class="metric-number" id="voluntarios-activos">0</span>
                            <span class="metric-label">Voluntarios Activos</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-clock" style="color: #F5A623;"></i>
                        </div>
                        <div class="metric-info">
                            <span class="metric-number" id="tiempo-promedio">0</span>
                            <span class="metric-label">Días Prom. Adopción</span>
                        </div>
                    </div>
                </div>
                
                <div class="charts-container">
                    <div class="chart-section">
                        <h4>Distribución por Tipo de Animal</h4>
                        <canvas id="chart-tipos" width="300" height="150"></canvas>
                    </div>
                    <div class="chart-section">
                        <h4>Adopciones por Ciudad</h4>
                        <canvas id="chart-ciudades" width="300" height="150"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar dashboard antes del mapa
    const mapSection = document.querySelector('.map-section');
    mapSection.insertAdjacentHTML('beforebegin', dashboardHTML);
}

function actualizarMetricasEnTiempoReal() {
    const totalAnimales = organizaciones.reduce((sum, org) => sum + org.animalesDisponibles, 0);
    const totalVoluntarios = organizaciones.reduce((sum, org) => sum + org.voluntarios, 0);
    
    // Simular datos dinámicos
    const adopcionesMes = Math.floor(Math.random() * 200) + 150;
    const tiempoPromedio = Math.floor(Math.random() * 20) + 15;
    
    animarMetrica('total-animales', totalAnimales);
    animarMetrica('adopciones-mes', adopcionesMes);
    animarMetrica('voluntarios-activos', totalVoluntarios);
    animarMetrica('tiempo-promedio', tiempoPromedio);
}

function animarMetrica(elementId, valorFinal) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    
    let valorActual = 0;
    const incremento = valorFinal / 30;
    
    const timer = setInterval(() => {
        valorActual += incremento;
        if (valorActual >= valorFinal) {
            valorActual = valorFinal;
            clearInterval(timer);
        }
        elemento.textContent = Math.floor(valorActual);
    }, 50);
}

function toggleDashboard() {
    const panel = document.getElementById('dashboard-panel');
    const btn = document.querySelector('.btn-toggle-dashboard i');
    
    panel.classList.toggle('collapsed');
    btn.classList.toggle('fa-chevron-up');
    btn.classList.toggle('fa-chevron-down');
}

function inicializarMapa() {
    // Crear el mapa centrado en México
    mapa = L.map('mapa-organizaciones', {
        zoomControl: false
    }).setView([23.6345, -102.5528], 5);

    // Agregar tiles del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);

    // Agregar control de zoom personalizado
    L.control.zoom({
        position: 'bottomright'
    }).addTo(mapa);

    // Configurar el panel de información
    infoPanel = document.querySelector('.info-panel');
    
    console.log('Mapa inicializado correctamente');
}

function inicializarControladores() {
    // Controlador de búsqueda
    const searchInput = document.getElementById('buscar-ubicacion');
    const btnSearch = document.querySelector('.btn-search');
    
    if (searchInput && btnSearch) {
        btnSearch.addEventListener('click', realizarBusqueda);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                realizarBusqueda();
            }
        });
    }

    // Controladores de filtros
    const tipoFilter = document.getElementById('tipo-organizacion');
    const distanciaFilter = document.getElementById('distancia');
    
    if (tipoFilter) {
        tipoFilter.addEventListener('change', aplicarFiltros);
    }
    
    if (distanciaFilter) {
        distanciaFilter.addEventListener('change', aplicarFiltros);
    }

    // Controlador de ubicación actual
    const btnUbicacion = document.querySelector('.btn-ubicacion');
    if (btnUbicacion) {
        btnUbicacion.addEventListener('click', obtenerUbicacionActual);
    }

    // Controlador para cerrar panel
    const btnClose = document.querySelector('.btn-close');
    if (btnClose) {
        btnClose.addEventListener('click', cerrarInfoPanel);
    }

    console.log('Controladores inicializados');
}

/* ===============================================
   HEATMAP Y CLUSTERING AVANZADO
   =============================================== */

let heatmapLayer = null;
let clusterGroup = null;

function inicializarHeatmap() {
    // Simular datos de densidad de adopciones
    const heatmapData = [
        [19.4326, -99.1332, 0.8], // CDMX - Alta densidad
        [20.6597, -103.3496, 0.6], // Guadalajara
        [25.6866, -100.3161, 0.5], // Monterrey
        [19.0414, -98.2063, 0.4], // Puebla
        [32.5149, -117.0382, 0.3], // Tijuana
        [16.8531, -99.8237, 0.2], // Acapulco
        // Puntos adicionales para mayor densidad
        [19.3732, -99.1871, 0.7], // Zona sur CDMX
        [19.4994, -99.1264, 0.9], // Zona norte CDMX
        [20.5418, -103.4434, 0.5], // Zona metropolitana GDL
    ];
    
    // Crear capa de mapa de calor (simulado con círculos)
    heatmapLayer = L.layerGroup();
    
    heatmapData.forEach(point => {
        const circle = L.circle([point[0], point[1]], {
            color: getHeatmapColor(point[2]),
            fillColor: getHeatmapColor(point[2]),
            fillOpacity: 0.3,
            radius: point[2] * 20000
        });
        circle.bindPopup(`Densidad de adopciones: ${(point[2] * 100).toFixed(0)}%`);
        heatmapLayer.addLayer(circle);
    });
}

function getHeatmapColor(intensity) {
    if (intensity > 0.7) return '#FF0000';
    if (intensity > 0.5) return '#FF8000';
    if (intensity > 0.3) return '#FFFF00';
    return '#00FF00';
}

function toggleHeatmap() {
    if (mapa.hasLayer(heatmapLayer)) {
        mapa.removeLayer(heatmapLayer);
        document.querySelector('.btn-heatmap').classList.remove('active');
    } else {
        mapa.addLayer(heatmapLayer);
        document.querySelector('.btn-heatmap').classList.add('active');
    }
}

function inicializarClustering() {
    // Agrupar marcadores cercanos
    clusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 80
    });
    
    marcadores.forEach(marcador => {
        clusterGroup.addLayer(marcador);
    });
    
    mapa.addLayer(clusterGroup);
}

function cargarOrganizaciones() {
    organizaciones = organizacionesData;
    mostrarOrganizacionesEnMapa();
    actualizarEstadisticas();
    console.log(`${organizaciones.length} organizaciones cargadas`);
}

function mostrarOrganizacionesEnMapa() {
    // Limpiar marcadores existentes
    marcadores.forEach(marcador => {
        mapa.removeLayer(marcador);
    });
    marcadores = [];

    // Agregar marcadores para cada organización
    organizaciones.forEach(org => {
        const marcador = crearMarcador(org);
        marcadores.push(marcador);
        marcador.addTo(mapa);
    });
}

function crearMarcador(organizacion) {
    // Determinar el ícono según el tipo
    let iconoClass = '';
    let color = '#4A90E2';
    
    switch(organizacion.tipo.toLowerCase()) {
        case 'fundación':
            iconoClass = 'fas fa-heart';
            color = '#4A90E2';
            break;
        case 'refugio':
            iconoClass = 'fas fa-home';
            color = '#7ED321';
            break;
        case 'veterinaria':
            iconoClass = 'fas fa-stethoscope';
            color = '#F5A623';
            break;
        default:
            iconoClass = 'fas fa-map-marker';
    }

    // Crear ícono personalizado
    const customIcon = L.divIcon({
        html: `<div class="marcador-${organizacion.tipo.toLowerCase()}" style="background: ${color};">
                <i class="${iconoClass}" style="font-size: 14px;"></i>
               </div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });

    // Crear marcador
    const marcador = L.marker(organizacion.coordenadas, { icon: customIcon });

    // Crear popup
    const popupContent = crearPopupContent(organizacion);
    marcador.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });

    // Agregar evento click
    marcador.on('click', function() {
        mostrarInfoOrganizacion(organizacion);
    });

    return marcador;
}

function crearPopupContent(org) {
    return `
        <div class="popup-organizacion">
            <div class="popup-org-name">${org.nombre}</div>
            <div class="popup-org-type">${org.tipo}</div>
            <div class="popup-org-info">
                <p><i class="fas fa-map-marker-alt"></i> ${org.ciudad}</p>
                <p><i class="fas fa-paw"></i> ${org.animalesDisponibles} animales disponibles</p>
                <p><i class="fas fa-users"></i> ${org.voluntarios} voluntarios</p>
                ${org.verificado ? '<p><i class="fas fa-check-circle" style="color: #7ED321;"></i> Verificado</p>' : ''}
            </div>
            <button onclick="mostrarInfoOrganizacion(${org.id})" class="btn-popup">
                Ver más información
            </button>
        </div>
    `;
}

/* ===============================================
   PANEL DE INFORMACIÓN
   =============================================== */

function mostrarInfoOrganizacion(orgId) {
    const org = typeof orgId === 'object' ? orgId : organizaciones.find(o => o.id === orgId);
    
    if (!org) return;

    const infoContent = document.querySelector('.info-content');
    if (!infoContent) return;

    infoContent.innerHTML = `
        <div class="org-detail">
            <div class="org-detail-header">
                <h3>${org.nombre}</h3>
                <span class="org-type-badge">${org.tipo}</span>
                ${org.verificado ? '<i class="fas fa-check-circle verificado" title="Organización Verificada"></i>' : ''}
            </div>
            
            <div class="org-detail-rating">
                ${generarEstrellas(org.calificacion)}
                <span class="rating-number">${org.calificacion}/5.0</span>
            </div>
            
            <div class="org-detail-info">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Ubicación</strong>
                        <p>${org.direccion}</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>Horario</strong>
                        <p>${org.horario}</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-paw"></i>
                    <div>
                        <strong>Animales Disponibles</strong>
                        <p>${org.animalesDisponibles} mascotas en adopción</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <div>
                        <strong>Equipo</strong>
                        <p>${org.voluntarios} voluntarios activos</p>
                    </div>
                </div>
            </div>
            
            <div class="org-especialidades">
                <strong>Especialidades:</strong>
                <div class="especialidades-tags">
                    ${org.especialidades.map(esp => `<span class="tag">${esp}</span>`).join('')}
                </div>
            </div>
            
            <div class="org-description">
                <p>${org.descripcion}</p>
            </div>
            
            <div class="org-detail-actions">
                <button class="btn-contactar-org" onclick="contactarOrganizacion('${org.email}', '${org.telefono}')">
                    <i class="fas fa-phone"></i> Contactar
                </button>
                <button class="btn-visitar" onclick="mostrarRuta(${org.coordenadas[0]}, ${org.coordenadas[1]})">
                    <i class="fas fa-route"></i> Cómo llegar
                </button>
                <button class="btn-adoptar" onclick="window.location.href='adopciones.html?org=${org.id}'">
                    <i class="fas fa-heart"></i> Ver Adopciones
                </button>
            </div>
        </div>
    `;

    // Mostrar panel
    infoPanel.classList.add('active');
    
    // Centrar mapa en la organización
    mapa.setView(org.coordenadas, 14);
}

function generarEstrellas(calificacion) {
    let estrellas = '';
    const estrellasLlenas = Math.floor(calificacion);
    const tieneMediaEstrella = calificacion % 1 !== 0;
    
    for (let i = 0; i < estrellasLlenas; i++) {
        estrellas += '<i class="fas fa-star"></i>';
    }
    
    if (tieneMediaEstrella) {
        estrellas += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const estrellasVacias = 5 - Math.ceil(calificacion);
    for (let i = 0; i < estrellasVacias; i++) {
        estrellas += '<i class="far fa-star"></i>';
    }
    
    return estrellas;
}

function cerrarInfoPanel() {
    infoPanel.classList.remove('active');
}

/* ===============================================
   BÚSQUEDA AVANZADA Y AUTOCOMPLETADO
   =============================================== */

let ciudadesMexico = [
    "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez",
    "Torreón", "Querétaro", "San Luis Potosí", "Mérida", "Mexicali", "Aguascalientes",
    "Cuernavaca", "Saltillo", "Hermosillo", "Culiacán", "Durango", "Tampico", "Morelia",
    "Toluca", "Reynosa", "Chihuahua", "Veracruz", "Acapulco", "Cancún", "Oaxaca"
];

function inicializarBusquedaAvanzada() {
    const searchInput = document.getElementById('buscar-ubicacion');
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    searchInput.parentNode.appendChild(resultsContainer);
    
    // Autocompletado en tiempo real
    searchInput.addEventListener('input', function(e) {
        const valor = e.target.value.toLowerCase();
        if (valor.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        // Buscar en ciudades
        const ciudadesCoincidentes = ciudadesMexico.filter(ciudad => 
            ciudad.toLowerCase().includes(valor)
        ).slice(0, 5);
        
        // Buscar en organizaciones
        const orgsCoincidentes = organizaciones.filter(org => 
            org.nombre.toLowerCase().includes(valor) ||
            org.ciudad.toLowerCase().includes(valor) ||
            org.especialidades.some(esp => esp.toLowerCase().includes(valor))
        ).slice(0, 3);
        
        mostrarResultadosAutocompletado(ciudadesCoincidentes, orgsCoincidentes, resultsContainer);
    });
    
    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.innerHTML = '';
        }
    });
}

function mostrarResultadosAutocompletado(ciudades, organizaciones, container) {
    let html = '<div class="autocomplete-results">';
    
    if (ciudades.length > 0) {
        html += '<div class="result-section"><h4><i class="fas fa-map-marker-alt"></i> Ciudades</h4>';
        ciudades.forEach(ciudad => {
            html += `<div class="result-item" onclick="buscarEnCiudad('${ciudad}')">
                        <i class="fas fa-map-marker-alt"></i> ${ciudad}
                     </div>`;
        });
        html += '</div>';
    }
    
    if (organizaciones.length > 0) {
        html += '<div class="result-section"><h4><i class="fas fa-building"></i> Organizaciones</h4>';
        organizaciones.forEach(org => {
            html += `<div class="result-item" onclick="enfocarOrganizacion(${org.id})">
                        <i class="fas fa-paw"></i> ${org.nombre}
                        <span class="result-location">${org.ciudad}</span>
                     </div>`;
        });
        html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function buscarEnCiudad(ciudad) {
    const orgsEnCiudad = organizaciones.filter(org => org.ciudad === ciudad);
    if (orgsEnCiudad.length > 0) {
        const coords = orgsEnCiudad[0].coordenadas;
        mapa.setView(coords, 12);
        mostrarResultadosBusqueda(orgsEnCiudad);
        document.getElementById('buscar-ubicacion').value = ciudad;
        document.querySelector('.search-results').innerHTML = '';
    }
}

function enfocarOrganizacion(orgId) {
    const org = organizaciones.find(o => o.id === orgId);
    if (org) {
        mapa.setView(org.coordenadas, 15);
        mostrarInfoOrganizacion(org);
        document.getElementById('buscar-ubicacion').value = org.nombre;
        document.querySelector('.search-results').innerHTML = '';
    }
}

function realizarBusqueda() {
    const termino = document.getElementById('buscar-ubicacion').value.trim();
    
    if (!termino) {
        mostrarNotificacion('Por favor ingresa una ubicación para buscar', 'warning');
        return;
    }

    // Mostrar indicador de carga
    const btnSearch = document.querySelector('.btn-search');
    const originalText = btnSearch.innerHTML;
    btnSearch.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btnSearch.disabled = true;

    // Simular búsqueda (en producción sería una llamada a una API de geocodificación)
    setTimeout(() => {
        const resultados = organizaciones.filter(org => 
            org.ciudad.toLowerCase().includes(termino.toLowerCase()) ||
            org.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            org.direccion.toLowerCase().includes(termino.toLowerCase())
        );

        if (resultados.length > 0) {
            mostrarResultadosBusqueda(resultados);
            mostrarNotificacion(`Se encontraron ${resultados.length} organizaciones`, 'success');
        } else {
            mostrarNotificacion('No se encontraron organizaciones en esa ubicación', 'info');
        }

        // Restaurar botón
        btnSearch.innerHTML = originalText;
        btnSearch.disabled = false;
    }, 1500);
}

function mostrarResultadosBusqueda(resultados) {
    // Limpiar marcadores actuales
    marcadores.forEach(marcador => mapa.removeLayer(marcador));
    marcadores = [];

    // Mostrar solo los resultados
    resultados.forEach(org => {
        const marcador = crearMarcador(org);
        marcadores.push(marcador);
        marcador.addTo(mapa);
    });

    // Ajustar vista del mapa a los resultados
    if (resultados.length === 1) {
        mapa.setView(resultados[0].coordenadas, 14);
    } else if (resultados.length > 1) {
        const group = new L.featureGroup(marcadores);
        mapa.fitBounds(group.getBounds().pad(0.1));
    }
}

function aplicarFiltros() {
    const tipoSeleccionado = document.getElementById('tipo-organizacion').value;
    const distanciaSeleccionada = document.getElementById('distancia').value;

    let organizacionesFiltradas = [...organizaciones];

    // Filtrar por tipo
    if (tipoSeleccionado && tipoSeleccionado !== 'todos') {
        organizacionesFiltradas = organizacionesFiltradas.filter(org => 
            org.tipo.toLowerCase() === tipoSeleccionado.toLowerCase()
        );
    }

    // Filtrar por distancia (simulado - en producción usaría geolocalización real)
    if (distanciaSeleccionada && distanciaSeleccionada !== 'todas') {
        // Lógica de filtrado por distancia
        console.log(`Filtrando por distancia: ${distanciaSeleccionada}km`);
    }

    // Actualizar marcadores en el mapa
    mostrarOrganizacionesFiltradas(organizacionesFiltradas);
    
    mostrarNotificacion(`Mostrando ${organizacionesFiltradas.length} organizaciones`, 'info');
}

function mostrarOrganizacionesFiltradas(organizacionesFiltradas) {
    // Limpiar marcadores actuales
    marcadores.forEach(marcador => mapa.removeLayer(marcador));
    marcadores = [];

    // Agregar marcadores filtrados
    organizacionesFiltradas.forEach(org => {
        const marcador = crearMarcador(org);
        marcadores.push(marcador);
        marcador.addTo(mapa);
    });
}

/* ===============================================
   GEOLOCALIZACIÓN
   =============================================== */

function obtenerUbicacionActual() {
    if (!navigator.geolocation) {
        mostrarNotificacion('Tu navegador no soporta geolocalización', 'error');
        return;
    }

    const btnUbicacion = document.querySelector('.btn-ubicacion');
    const originalText = btnUbicacion.innerHTML;
    btnUbicacion.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ubicando...';
    btnUbicacion.disabled = true;

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Centrar mapa en ubicación actual
            mapa.setView([lat, lng], 12);
            
            // Agregar marcador de ubicación actual
            const marcadorUsuario = L.marker([lat, lng], {
                icon: L.divIcon({
                    html: '<div class="marcador-usuario"><i class="fas fa-user"></i></div>',
                    className: 'marcador-usuario-class',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5]
                })
            }).addTo(mapa);
            
            marcadorUsuario.bindPopup('Tu ubicación actual').openPopup();
            
            // Encontrar organizaciones cercanas
            encontrarOrganizacionesCercanas(lat, lng);
            
            mostrarNotificacion('Ubicación encontrada. Mostrando organizaciones cercanas', 'success');
            
            // Restaurar botón
            btnUbicacion.innerHTML = originalText;
            btnUbicacion.disabled = false;
        },
        function(error) {
            let mensaje = 'No se pudo obtener tu ubicación';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensaje = 'Permiso de ubicación denegado';
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensaje = 'Ubicación no disponible';
                    break;
                case error.TIMEOUT:
                    mensaje = 'Tiempo de espera agotado';
                    break;
            }
            
            mostrarNotificacion(mensaje, 'error');
            
            // Restaurar botón
            btnUbicacion.innerHTML = originalText;
            btnUbicacion.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

function encontrarOrganizacionesCercanas(lat, lng) {
    // Calcular distancias y ordenar por proximidad
    const organizacionesConDistancia = organizaciones.map(org => {
        const distancia = calcularDistancia(lat, lng, org.coordenadas[0], org.coordenadas[1]);
        return { ...org, distancia };
    }).sort((a, b) => a.distancia - b.distancia);

    // Mostrar las 5 más cercanas
    const cercanas = organizacionesConDistancia.slice(0, 5);
    
    console.log('Organizaciones cercanas:', cercanas);
    
    // Actualizar vista para mostrar solo las cercanas
    mostrarOrganizacionesFiltradas(cercanas);
}

function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/* ===============================================
   FUNCIONES DE INTERACCIÓN
   =============================================== */

function contactarOrganizacion(email, telefono) {
    const opciones = `
        <div class="contacto-opciones">
            <p>¿Cómo deseas contactar a esta organización?</p>
            <div class="opciones-botones">
                <button onclick="window.location.href='mailto:${email}'" class="btn-email">
                    <i class="fas fa-envelope"></i> Email
                </button>
                <button onclick="window.location.href='tel:${telefono}'" class="btn-telefono">
                    <i class="fas fa-phone"></i> Llamar
                </button>
                <button onclick="abrirWhatsApp('${telefono}')" class="btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            </div>
        </div>
    `;
    
    mostrarModal('Contactar Organización', opciones);
}

function abrirWhatsApp(telefono) {
    const numeroLimpio = telefono.replace(/\D/g, '');
    const mensaje = encodeURIComponent('Hola, me interesa conocer más sobre las mascotas disponibles para adopción.');
    window.open(`https://wa.me/52${numeroLimpio}?text=${mensaje}`, '_blank');
}

function mostrarRuta(lat, lng) {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
}

/* ===============================================
   UTILIDADES Y NOTIFICACIONES
   =============================================== */

function actualizarEstadisticas() {
    const totalOrganizaciones = organizaciones.length;
    const totalAnimales = organizaciones.reduce((sum, org) => sum + org.animalesDisponibles, 0);
    const ciudadesUnicas = [...new Set(organizaciones.map(org => org.ciudad))].length;

    // Actualizar números en el hero con animación
    animarNumero('.stat-number:nth-child(1)', totalOrganizaciones);
    animarNumero('.stat-number:nth-child(2)', ciudadesUnicas);
    animarNumero('.stat-number:nth-child(3)', totalAnimales);
}

function animarNumero(selector, valorFinal) {
    const elemento = document.querySelector(selector);
    if (!elemento) return;

    let valorActual = 0;
    const incremento = valorFinal / 50;
    const timer = setInterval(() => {
        valorActual += incremento;
        if (valorActual >= valorFinal) {
            valorActual = valorFinal;
            clearInterval(timer);
        }
        elemento.textContent = Math.floor(valorActual).toLocaleString();
    }, 50);
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-content">
            <i class="fas fa-${getIconoNotificacion(tipo)}"></i>
            <span>${mensaje}</span>
            <button class="btn-cerrar-notificacion">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Agregar al DOM
    document.body.appendChild(notificacion);

    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 100);

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        ocultarNotificacion(notificacion);
    }, 5000);

    // Agregar event listener para cerrar manualmente
    notificacion.querySelector('.btn-cerrar-notificacion').addEventListener('click', () => {
        ocultarNotificacion(notificacion);
    });
}

function getIconoNotificacion(tipo) {
    switch(tipo) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function ocultarNotificacion(notificacion) {
    notificacion.classList.remove('mostrar');
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.parentNode.removeChild(notificacion);
        }
    }, 300);
}

function mostrarModal(titulo, contenido) {
    // Crear modal si no existe
    let modal = document.getElementById('modal-dinamico');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-dinamico';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="btn-cerrar-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Agregar event listeners
        modal.querySelector('.btn-cerrar-modal').addEventListener('click', cerrarModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }

    // Actualizar contenido
    modal.querySelector('.modal-title').textContent = titulo;
    modal.querySelector('.modal-body').innerHTML = contenido;

    // Mostrar modal
    modal.classList.add('activo');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    const modal = document.getElementById('modal-dinamico');
    if (modal) {
        modal.classList.remove('activo');
        document.body.style.overflow = '';
    }
}

function animacionesEntrada() {
    // Animar entrada de elementos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animado');
            }
        });
    });

    document.querySelectorAll('.org-card, .info-item').forEach(el => {
        observer.observe(el);
    });
}

/* ===============================================
   EVENTOS GLOBALES
   =============================================== */

// Manejar redimensionamiento de ventana
window.addEventListener('resize', function() {
    if (mapa) {
        setTimeout(() => {
            mapa.invalidateSize();
        }, 100);
    }
});

// Manejar tecla Escape para cerrar panel/modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (infoPanel && infoPanel.classList.contains('active')) {
            cerrarInfoPanel();
        }
        cerrarModal();
    }
});

// Función global para botones en popups
window.mostrarInfoOrganizacion = function(orgId) {
    const org = organizaciones.find(o => o.id === orgId);
    if (org) {
        mostrarInfoOrganizacion(org);
    }
};

// Función global para ver organización en mapa desde cards
window.verEnMapa = function(lat, lng) {
    // Centrar el mapa en las coordenadas
    mapa.setView([lat, lng], 14);
    
    // Buscar el marcador correspondiente y abrir su popup
    marcadores.forEach(marcador => {
        const markerLatLng = marcador.getLatLng();
        if (Math.abs(markerLatLng.lat - lat) < 0.001 && Math.abs(markerLatLng.lng - lng) < 0.001) {
            marcador.openPopup();
        }
    });
    
    // Scroll hacia el mapa
    document.getElementById('mapa-organizaciones').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    mostrarNotificacion('Organización localizada en el mapa', 'success');
};

/* ===============================================
   FILTROS AVANZADOS E INTELIGENCIA ARTIFICIAL
   =============================================== */

function configurarFiltrosAvanzados() {
    crearPanelFiltrosAvanzados();
    inicializarSistemaRecomendaciones();
}

function crearPanelFiltrosAvanzados() {
    const filtrosHTML = `
        <div class="filtros-avanzados" id="filtros-avanzados">
            <div class="filtros-header">
                <h3><i class="fas fa-sliders-h"></i> Filtros Inteligentes</h3>
                <button class="btn-toggle-filtros" onclick="toggleFiltrosAvanzados()">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
            <div class="filtros-content">
                <div class="filtro-group">
                    <label>Tipo de Animal Buscado</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" value="perros" checked> 🐕 Perros</label>
                        <label><input type="checkbox" value="gatos" checked> 🐱 Gatos</label>
                        <label><input type="checkbox" value="exoticos"> 🦎 Exóticos</label>
                    </div>
                </div>
                
                <div class="filtro-group">
                    <label>Características Especiales</label>
                    <div class="tags-selector">
                        <span class="tag selectable" data-tag="entrenado">Entrenado</span>
                        <span class="tag selectable" data-tag="sociable">Sociable</span>
                        <span class="tag selectable" data-tag="discapacidad">Con Discapacidad</span>
                        <span class="tag selectable" data-tag="esterilizado">Esterilizado</span>
                        <span class="tag selectable" data-tag="emergencia">Caso Urgente</span>
                    </div>
                </div>
                
                <div class="recomendaciones-ai">
                    <h4><i class="fas fa-brain"></i> Recomendaciones IA</h4>
                    <div id="recomendaciones-lista">
                        <!-- Se llena dinámicamente -->
                    </div>
                </div>
                
                <div class="filtros-actions">
                    <button class="btn-aplicar-filtros" onclick="aplicarFiltrosAvanzados()">
                        <i class="fas fa-filter"></i> Aplicar Filtros
                    </button>
                    <button class="btn-toggle-heatmap" onclick="toggleHeatmap()">
                        <i class="fas fa-fire"></i> Mapa de Calor
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insertar después de los controles básicos
    const controlsSection = document.querySelector('.map-controls');
    if (controlsSection) {
        controlsSection.insertAdjacentHTML('afterend', filtrosHTML);
        configurarEventosFiltros();
    }
}

function inicializarSistemaRecomendaciones() {
    const recomendaciones = [
        {
            titulo: "🏆 Más Exitosas",
            descripcion: "Organizaciones con mayor tasa de adopción",
            organizaciones: organizaciones.sort((a, b) => b.calificacion - a.calificacion).slice(0, 2)
        },
        {
            titulo: "🚨 Casos Urgentes", 
            descripcion: "Animales que necesitan hogar urgentemente",
            organizaciones: organizaciones.filter(org => org.animalesDisponibles > 80)
        }
    ];
    
    mostrarRecomendaciones(recomendaciones);
}

function mostrarRecomendaciones(recomendaciones) {
    const container = document.getElementById('recomendaciones-lista');
    if (!container) return;
    
    let html = '';
    
    recomendaciones.forEach(categoria => {
        html += `
            <div class="recomendacion-categoria">
                <h5>${categoria.titulo}</h5>
                <p>${categoria.descripcion}</p>
                <div class="orgs-recomendadas">
        `;
        
        categoria.organizaciones.forEach(org => {
            html += `
                <div class="org-recomendada" onclick="enfocarOrganizacion(${org.id})">
                    <span class="org-nombre">${org.nombre}</span>
                    <span class="org-ubicacion">${org.ciudad}</span>
                    <div class="org-rating">${'⭐'.repeat(Math.floor(org.calificacion))}</div>
                </div>
            `;
        });
        
        html += '</div></div>';
    });
    
    container.innerHTML = html;
}

function aplicarFiltrosAvanzados() {
    const tiposAnimales = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value);
    const tagsSeleccionados = Array.from(document.querySelectorAll('.tag.selected')).map(tag => tag.dataset.tag);
    
    let organizacionesFiltradas = organizaciones.map(org => {
        let score = 0;
        
        const tienePerros = org.especialidades.some(esp => esp.toLowerCase().includes('perro'));
        const tieneGatos = org.especialidades.some(esp => esp.toLowerCase().includes('gato'));
        
        if (tiposAnimales.includes('perros') && tienePerros) score += 2;
        if (tiposAnimales.includes('gatos') && tieneGatos) score += 2;
        
        tagsSeleccionados.forEach(tag => {
            if (org.especialidades.some(esp => esp.toLowerCase().includes(tag))) {
                score += 3;
            }
        });
        
        score += org.calificacion;
        
        return { ...org, score };
    }).filter(org => org.score > 0).sort((a, b) => b.score - a.score);
    
    mostrarOrganizacionesFiltradas(organizacionesFiltradas);
    mostrarNotificacion(`Encontradas ${organizacionesFiltradas.length} organizaciones inteligentes`, 'success');
}

function toggleFiltrosAvanzados() {
    const panel = document.getElementById('filtros-avanzados');
    if (panel) {
        panel.classList.toggle('collapsed');
    }
}

function configurarEventosFiltros() {
    document.querySelectorAll('.tag.selectable').forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
            aplicarFiltrosAvanzados();
        });
    });
    
    document.querySelectorAll('#filtros-avanzados input').forEach(input => {
        input.addEventListener('change', aplicarFiltrosAvanzados);
    });
}

window.toggleFiltrosAvanzados = toggleFiltrosAvanzados;
window.aplicarFiltrosAvanzados = aplicarFiltrosAvanzados;
window.toggleHeatmap = toggleHeatmap;

console.log('Mapa de Organizaciones - JavaScript cargado correctamente');

// Verificación de dependencias
setTimeout(() => {
    console.log('🔍 Verificando dependencias del mapa...');
    
    // Verificar Leaflet
    if (typeof L !== 'undefined') {
        console.log('✅ Leaflet.js cargado correctamente');
    } else {
        console.error('❌ Leaflet.js no está disponible');
    }
    
    // Verificar contenedor del mapa
    const contenedorMapa = document.getElementById('mapa-organizaciones');
    if (contenedorMapa) {
        console.log('✅ Contenedor del mapa encontrado');
    } else {
        console.error('❌ Contenedor del mapa no encontrado');
    }
    
    // Verificar panel de información
    const panelInfo = document.querySelector('.info-panel');
    if (panelInfo) {
        console.log('✅ Panel de información encontrado');
    } else {
        console.error('❌ Panel de información no encontrado');
    }
    
    // Verificar controles de búsqueda
    const inputBusqueda = document.getElementById('buscar-ubicacion');
    if (inputBusqueda) {
        console.log('✅ Control de búsqueda encontrado');
    } else {
        console.error('❌ Control de búsqueda no encontrado');
    }
    
    // Verificar estado del mapa
    if (mapa) {
        console.log('✅ Mapa inicializado correctamente');
        console.log(`📍 Centro del mapa: ${mapa.getCenter()}`);
        console.log(`🔍 Zoom actual: ${mapa.getZoom()}`);
    } else {
        console.error('❌ Mapa no inicializado');
    }
    
    // Verificar marcadores
    console.log(`📌 Marcadores cargados: ${marcadores.length}`);
    
    // Verificar organizaciones
    console.log(`🏢 Organizaciones cargadas: ${organizaciones.length}`);
    
    console.log('🎯 Verificación completa');
}, 2000);

// Función de diagnóstico global
window.diagnosticoMapa = function() {
    console.log('=== DIAGNÓSTICO DEL MAPA ===');
    console.log('Mapa:', mapa);
    console.log('Marcadores:', marcadores);
    console.log('Organizaciones:', organizaciones);
    console.log('Panel de info:', infoPanel);
    console.log('Contenedor del mapa:', document.getElementById('mapa-organizaciones'));
    console.log('===========================');
};
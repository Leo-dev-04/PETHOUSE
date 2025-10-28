// ========================================
//   PANEL DE ADMINISTRACIÓN - ORGANIZACIONES
// ========================================

class AdminOrganizaciones {
    constructor() {
        this.solicitudes = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilter = 'pendiente';
        this.init();
    }

    async init() {
        await this.cargarSolicitudes();
        await this.cargarEstadisticas();
        this.setupEventListeners();
        this.renderSolicitudes();
    }

    // ========================================
    //   CARGAR DATOS
    // ========================================

    async cargarSolicitudes(filtro = 'pendiente') {
        try {
            showLoading('Cargando solicitudes...');
            
            // Usar la función global que tiene fallback a localStorage
            const resultado = await window.obtenerSolicitudesAdmin({
                estado: filtro,
                page: this.currentPage,
                limit: this.itemsPerPage
            });
            
            if (resultado.success) {
                this.solicitudes = resultado.data || [];
                this.totalPages = resultado.pagination?.total || 1;
                this.currentFilter = filtro;
                
                // Actualizar estadísticas si están disponibles
                if (resultado.estadisticas) {
                    this.renderEstadisticas(resultado.estadisticas);
                }
            } else {
                throw new Error(resultado.error || 'Error al cargar solicitudes');
            }
            
            hideLoading();
            
        } catch (error) {
            console.error('Error cargando solicitudes:', error);
            hideLoading();
            showNotification('Error al cargar solicitudes', 'error');
            
            // Fallback directo a localStorage si falla todo
            try {
                const solicitudesLocales = JSON.parse(localStorage.getItem('pethouse_solicitudes_organizaciones') || '[]');
                this.solicitudes = solicitudesLocales;
                console.log('📋 Fallback: Cargadas', this.solicitudes.length, 'solicitudes desde localStorage');
            } catch (fallbackError) {
                console.error('Error en fallback:', fallbackError);
                this.solicitudes = [];
            }
        }
    }

    async cargarEstadisticas() {
        try {
            // Intentar obtener estadísticas del servidor
            const response = await fetch('/api/admin/dashboard/stats');
            
            if (response.ok) {
                const stats = await response.json();
                this.renderEstadisticas(stats.organizaciones);
                return;
            }
        } catch (error) {
            console.warn('⚠️ Error cargando estadísticas del servidor, calculando localmente:', error);
        }
        
        // Fallback: calcular estadísticas desde localStorage
        try {
            const solicitudesLocales = JSON.parse(localStorage.getItem('pethouse_solicitudes_organizaciones') || '[]');
            
            const estadisticas = {
                total: solicitudesLocales.length,
                pendientes: solicitudesLocales.filter(s => s.estado === 'pendiente').length,
                aprobadas: solicitudesLocales.filter(s => s.estado === 'aprobada' || s.verificada).length,
                rechazadas: solicitudesLocales.filter(s => s.estado === 'rechazada').length
            };
            
            console.log('📊 Estadísticas calculadas localmente:', estadisticas);
            this.renderEstadisticas(estadisticas);
            
        } catch (error) {
            console.error('Error calculando estadísticas locales:', error);
            // Mostrar estadísticas en cero si hay error
            this.renderEstadisticas({
                total: 0,
                pendientes: 0,
                aprobadas: 0,
                rechazadas: 0
            });
        }
    }

    // ========================================
    //   RENDERIZADO
    // ========================================

    renderEstadisticas(stats) {
        const statsContainer = document.getElementById('statsContainer');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stat-admin">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.pendientes || 0}</div>
                    <div class="stat-label">Pendientes</div>
                </div>
            </div>
            
            <div class="stat-admin">
                <div class="stat-icon approved">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.aprobadas || stats.verificadas || 0}</div>
                    <div class="stat-label">Aprobadas</div>
                </div>
            </div>
            
            <div class="stat-admin">
                <div class="stat-icon rejected">
                    <i class="fas fa-times-circle"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.rechazadas || 0}</div>
                    <div class="stat-label">Rechazadas</div>
                </div>
            </div>
            
            <div class="stat-admin">
                <div class="stat-icon total">
                    <i class="fas fa-building"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.total || 0}</div>
                    <div class="stat-label">Total</div>
                </div>
            </div>
        `;
    }

    renderSolicitudes() {
        const solicitudesContainer = document.getElementById('solicitudesContainer');
        if (!solicitudesContainer) return;

        if (this.solicitudes.length === 0) {
            const totalSolicitudes = JSON.parse(localStorage.getItem('pethouse_solicitudes_organizaciones') || '[]').length;
            
            if (totalSolicitudes === 0) {
                solicitudesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No hay solicitudes registradas</h3>
                        <p>Las nuevas solicitudes aparecerán aquí cuando las organizaciones se registren</p>
                        <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; color: #0369a1;">
                            <strong>💡 Para probar el sistema:</strong><br>
                            Ve a <a href="registro-organizacion.html" target="_blank" style="color: #0284c7; text-decoration: underline;">Registro de Organizaciones</a> y completa el formulario
                        </div>
                    </div>
                `;
            } else {
                solicitudesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-filter"></i>
                        <h3>No hay solicitudes ${this.currentFilter === 'pendiente' ? 'pendientes' : this.currentFilter}</h3>
                        <p>Cambia el filtro para ver otras solicitudes o todas las existentes</p>
                        <button class="btn btn-primary" onclick="adminOrganizaciones.cambiarFiltro('todas')" style="margin-top: 15px;">
                            <i class="fas fa-eye"></i> Ver Todas las Solicitudes
                        </button>
                    </div>
                `;
            }
            return;
        }

        const solicitudesHTML = this.solicitudes.map(solicitud => this.createSolicitudCard(solicitud)).join('');
        
        solicitudesContainer.innerHTML = `
            <div class="solicitudes-grid">
                ${solicitudesHTML}
            </div>
            
            ${this.createPaginationHTML()}
        `;
    }

    createSolicitudCard(solicitud) {
        const fechaRegistro = new Date(solicitud.fechaRegistro || solicitud.fechaSolicitud).toLocaleDateString('es-MX');
        const estadoBadge = this.getEstadoBadge(solicitud);

        return `
            <div class="solicitud-card" data-id="${solicitud.id}">
                <div class="solicitud-header">
                    <div class="organizacion-info">
                        <h3>${solicitud.nombreOrganizacion}</h3>
                        <span class="tipo-org">${this.getTipoOrganizacion(solicitud.tipoOrganizacion)}</span>
                    </div>
                    ${estadoBadge}
                </div>
                
                <div class="solicitud-body">
                    <div class="info-row">
                        <i class="fas fa-envelope"></i>
                        <span>${solicitud.emailContacto || solicitud.email || 'No especificado'}</span>
                    </div>
                    
                    <div class="info-row">
                        <i class="fas fa-phone"></i>
                        <span>${solicitud.telefonoContacto || solicitud.telefono || 'No especificado'}</span>
                    </div>
                    
                    <div class="info-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${solicitud.direccion || solicitud.ubicacion?.ciudad || 'No especificada'}</span>
                    </div>
                    
                    <div class="info-row">
                        <i class="fas fa-calendar"></i>
                        <span>Registrado: ${fechaRegistro}</span>
                    </div>
                    
                    <div class="descripcion">
                        <p style="word-wrap: break-word; overflow-wrap: break-word; white-space: pre-wrap; max-width: 100%; word-break: break-word;">
                            ${solicitud.descripcion ? 
                                (solicitud.descripcion.length > 120 ? 
                                    solicitud.descripcion.substring(0, 120) + '...' : 
                                    solicitud.descripcion
                                ) : 
                                'No hay descripción disponible'
                            }
                        </p>
                    </div>
                </div>
                
                <div class="solicitud-actions">
                    <button class="btn btn-info btn-sm" onclick="adminOrganizaciones.verDetalles('${solicitud.id}')">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                    
                    ${this.currentFilter === 'pendiente' ? `
                        <button class="btn btn-success btn-sm" onclick="adminOrganizaciones.aprobarSolicitud('${solicitud.id}')">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                        
                        <button class="btn btn-danger btn-sm" onclick="adminOrganizaciones.rechazarSolicitud('${solicitud.id}')">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getEstadoBadge(solicitud) {
        const estado = solicitud.estado || 'pendiente';
        
        switch (estado) {
            case 'aprobada':
                return '<span class="badge badge-success">Aprobada</span>';
            case 'rechazada':
                return '<span class="badge badge-danger">Rechazada</span>';
            case 'pendiente':
            default:
                return '<span class="badge badge-warning">Pendiente</span>';
        }
    }

    getTipoOrganizacion(tipo) {
        const tipos = {
            'fundacion': 'Fundación',
            'refugio': 'Refugio',
            'ong': 'ONG',
            'asociacion': 'Asociación Civil',
            'otro': 'Otro'
        };
        return tipos[tipo] || tipo;
    }

    createPaginationHTML() {
        if (this.totalPages <= 1) return '';

        let paginationHTML = '<div class="pagination">';
        
        // Botón anterior
        if (this.currentPage > 1) {
            paginationHTML += `<button class="btn btn-outline" onclick="adminOrganizaciones.cambiarPagina(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>`;
        }
        
        // Números de página
        for (let i = 1; i <= this.totalPages; i++) {
            const activeClass = i === this.currentPage ? 'btn-primary' : 'btn-outline';
            paginationHTML += `<button class="btn ${activeClass}" onclick="adminOrganizaciones.cambiarPagina(${i})">${i}</button>`;
        }
        
        // Botón siguiente
        if (this.currentPage < this.totalPages) {
            paginationHTML += `<button class="btn btn-outline" onclick="adminOrganizaciones.cambiarPagina(${this.currentPage + 1})">
                Siguiente <i class="fas fa-chevron-right"></i>
            </button>`;
        }
        
        paginationHTML += '</div>';
        return paginationHTML;
    }

    // ========================================
    //   ACCIONES
    // ========================================

    async aprobarSolicitud(id) {
        const solicitud = this.solicitudes.find(s => s.id === id);
        if (!solicitud) return;

        const confirmado = confirm(`¿Estás seguro de que quieres aprobar a "${solicitud.nombreOrganizacion}"?\n\nEsto les dará acceso completo a la plataforma y se crearán sus credenciales de acceso.`);
        
        if (!confirmado) return;

        try {
            showLoading('Aprobando solicitud y creando acceso...');
            
            // 1. Aprobar la solicitud
            const resultado = await window.cambiarEstadoSolicitud(id, 'aprobada', 'Organización aprobada desde panel de administración');
            
            if (resultado.success) {
                // 2. Crear credenciales de acceso para la organización
                const credenciales = await this.crearAccesoOrganizacion(solicitud);
                
                if (credenciales.success) {
                    // 3. Enviar email de bienvenida con credenciales
                    await this.enviarEmailBienvenida(solicitud, credenciales.data);
                    
                    hideLoading();
                    showNotification(`¡Organización "${solicitud.nombreOrganizacion}" aprobada exitosamente!\nCredenciales enviadas por email.`, 'success');
                } else {
                    // Aprobación exitosa pero fallo en credenciales
                    hideLoading();
                    showNotification(`Organización aprobada, pero hubo un problema creando las credenciales.\nPor favor, créalas manualmente.`, 'warning');
                }
                
                // Recargar datos
                await this.cargarSolicitudes(this.currentFilter);
                await this.cargarEstadisticas();
                this.renderSolicitudes();
            } else {
                throw new Error(resultado.error || 'Error al aprobar solicitud');
            }
            
        } catch (error) {
            console.error('Error aprobando solicitud:', error);
            hideLoading();
            showNotification('Error al aprobar la solicitud', 'error');
        }
    }

    async rechazarSolicitud(id) {
        const solicitud = this.solicitudes.find(s => s.id === id);
        if (!solicitud) return;

        const motivo = prompt(`¿Por qué rechazas la solicitud de "${solicitud.nombreOrganizacion}"?\n\nEspecifica el motivo:`);
        
        if (!motivo || motivo.trim() === '') {
            showNotification('Debes especificar un motivo para rechazar la solicitud', 'warning');
            return;
        }

        try {
            showLoading('Rechazando solicitud...');
            
            // Usar la función global que tiene fallback a localStorage
            const resultado = await window.cambiarEstadoSolicitud(id, 'rechazada', motivo.trim());
            
            if (resultado.success) {
                hideLoading();
                showNotification(`Solicitud de "${solicitud.nombreOrganizacion}" rechazada`, 'info');
                
                // Recargar datos
                await this.cargarSolicitudes(this.currentFilter);
                await this.cargarEstadisticas();
                this.renderSolicitudes();
            } else {
                throw new Error(resultado.error || 'Error al rechazar solicitud');
            }
            
        } catch (error) {
            console.error('Error rechazando solicitud:', error);
            hideLoading();
            showNotification('Error al rechazar la solicitud', 'error');
        }
    }

    // ========================================
    //   CREACIÓN DE ACCESO PARA ORGANIZACIONES
    // ========================================

    async crearAccesoOrganizacion(solicitud) {
        try {
            console.log('Creando acceso para:', solicitud.nombreOrganizacion);
            
            // Generar contraseña temporal segura
            const contraseñaTemporal = this.generarContraseñaSegura();
            
            // Datos del usuario organizacional
            const datosUsuario = {
                id: `org_${solicitud.id}`,
                email: solicitud.emailContacto || solicitud.email,
                contraseña: contraseñaTemporal,
                nombre: solicitud.nombreOrganizacion,
                tipo: 'organizacion',
                organizacion: {
                    id: solicitud.id,
                    nombreOrganizacion: solicitud.nombreOrganizacion,
                    tipoOrganizacion: solicitud.tipoOrganizacion,
                    emailContacto: solicitud.emailContacto || solicitud.email,
                    telefonoContacto: solicitud.telefonoContacto || solicitud.telefono,
                    direccion: solicitud.direccion,
                    ciudad: solicitud.ciudad,
                    estado: solicitud.estado,
                    sitioWeb: solicitud.sitioWeb,
                    descripcion: solicitud.descripcion,
                    verificada: true,
                    activa: true,
                    fechaVerificacion: new Date().toISOString(),
                    fechaCreacion: solicitud.fechaCreacion || new Date().toISOString()
                },
                permisos: ['dashboard', 'mascotas', 'adopciones', 'estadisticas'],
                fechaCreacion: new Date().toISOString(),
                requiereCambioContraseña: true
            };

            // Intentar crear en servidor
            try {
                const response = await fetch('/api/organizaciones/crear-acceso', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosUsuario)
                });

                if (response.ok) {
                    const resultado = await response.json();
                    console.log('Acceso creado en servidor:', resultado);
                    return {
                        success: true,
                        data: {
                            email: datosUsuario.email,
                            contraseñaTemporal: contraseñaTemporal,
                            nombreOrganizacion: datosUsuario.nombre,
                            servidor: true
                        }
                    };
                }
            } catch (serverError) {
                console.log('Error en servidor, usando localStorage:', serverError.message);
            }

            // Fallback: Guardar en localStorage
            const usuariosOrganizaciones = JSON.parse(localStorage.getItem('usuariosOrganizaciones') || '[]');
            
            // Verificar si ya existe
            const existeUsuario = usuariosOrganizaciones.find(u => u.email === datosUsuario.email);
            if (existeUsuario) {
                // Actualizar usuario existente
                existeUsuario.organizacion = datosUsuario.organizacion;
                existeUsuario.contraseña = contraseñaTemporal;
                existeUsuario.requiereCambioContraseña = true;
            } else {
                // Crear nuevo usuario
                usuariosOrganizaciones.push(datosUsuario);
            }

            localStorage.setItem('usuariosOrganizaciones', JSON.stringify(usuariosOrganizaciones));

            console.log('Acceso creado en localStorage para:', datosUsuario.email);
            return {
                success: true,
                data: {
                    email: datosUsuario.email,
                    contraseñaTemporal: contraseñaTemporal,
                    nombreOrganizacion: datosUsuario.nombre,
                    servidor: false
                }
            };

        } catch (error) {
            console.error('Error creando acceso:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    generarContraseñaSegura() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
        let contraseña = '';
        
        // Asegurar al menos una mayúscula, una minúscula, un número y un símbolo
        contraseña += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
        contraseña += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
        contraseña += '0123456789'[Math.floor(Math.random() * 10)];
        contraseña += '@#$%&*'[Math.floor(Math.random() * 6)];
        
        // Completar hasta 12 caracteres
        for (let i = 0; i < 8; i++) {
            contraseña += caracteres[Math.floor(Math.random() * caracteres.length)];
        }
        
        // Mezclar la contraseña
        return contraseña.split('').sort(() => Math.random() - 0.5).join('');
    }

    async enviarEmailBienvenida(solicitud, credenciales) {
        try {
            console.log('Enviando email de bienvenida a:', credenciales.email);
            
            const datosEmail = {
                destinatario: credenciales.email,
                asunto: '🎉 ¡Bienvenido a PETHOUSE! - Acceso Aprobado',
                contenido: this.generarEmailBienvenida(solicitud, credenciales)
            };

            // Intentar enviar por servidor
            try {
                const response = await fetch('/api/email/enviar-bienvenida', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosEmail)
                });

                if (response.ok) {
                    console.log('Email enviado por servidor');
                    return { success: true, metodo: 'servidor' };
                }
            } catch (serverError) {
                console.log('Error enviando por servidor:', serverError.message);
            }

            // Fallback: Simular envío y mostrar información
            console.log('=== EMAIL DE BIENVENIDA (SIMULADO) ===');
            console.log('Para:', credenciales.email);
            console.log('Asunto:', datosEmail.asunto);
            console.log('Contenido:', datosEmail.contenido);
            console.log('=====================================');

            // Mostrar modal con la información de acceso
            this.mostrarModalCredenciales(solicitud, credenciales);

            return { success: true, metodo: 'simulado' };

        } catch (error) {
            console.error('Error enviando email:', error);
            return { success: false, error: error.message };
        }
    }

    generarEmailBienvenida(solicitud, credenciales) {
        return `
🎉 ¡Felicidades ${credenciales.nombreOrganizacion}!

Tu solicitud ha sido APROBADA y ya tienes acceso completo a PETHOUSE.

🔑 TUS CREDENCIALES DE ACCESO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: ${credenciales.email}
🔒 Contraseña temporal: ${credenciales.contraseñaTemporal}

🚀 PRIMEROS PASOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Accede al sistema: ${window.location.origin}/pages/login.html
2. Inicia sesión con tus credenciales
3. Cambia tu contraseña por una personalizada
4. Completa tu perfil organizacional
5. ¡Comienza a publicar mascotas para adopción!

💡 FUNCIONALIDADES DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Dashboard con estadísticas en tiempo real
✅ Gestión completa de mascotas
✅ Recepción de solicitudes de adopción
✅ Aparición en el mapa de organizaciones
✅ Comunicación directa con adoptantes

🆘 ¿NECESITAS AYUDA?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 Soporte: soporte@pethouse.com
📚 Guía completa: ${window.location.origin}/pages/guia-organizaciones.html

¡Gracias por unirte a nuestra misión de conectar mascotas con familias amorosas!

🐾 Equipo PETHOUSE
        `.trim();
    }

    mostrarModalCredenciales(solicitud, credenciales) {
        // Crear modal para mostrar credenciales
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'modalCredenciales';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>🎉 Organización Aprobada</h2>
                    <button class="modal-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="background: linear-gradient(45deg, #10b981, #3b82f6); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 10px 0;">¡${credenciales.nombreOrganizacion} ha sido aprobada!</h3>
                            <p style="margin: 0;">Acceso completo concedido a la plataforma PETHOUSE</p>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h4 style="color: #10b981; margin-bottom: 15px;">🔑 Credenciales de Acceso</h4>
                        <div style="background: white; padding: 15px; border-radius: 6px; font-family: monospace;">
                            <p><strong>📧 Email:</strong> ${credenciales.email}</p>
                            <p><strong>🔒 Contraseña temporal:</strong> <span style="background: #fbbf24; padding: 2px 6px; border-radius: 3px; font-weight: bold;">${credenciales.contraseñaTemporal}</span></p>
                        </div>
                        <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 10px; margin-top: 10px;">
                            <small><strong>⚠️ Importante:</strong> La organización debe cambiar esta contraseña en su primer acceso.</small>
                        </div>
                    </div>
                    
                    <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #3b82f6; margin-bottom: 10px;">📋 Próximos Pasos</h4>
                        <ol style="margin: 0; padding-left: 20px;">
                            <li>La organización debe acceder a: <strong>/pages/login.html</strong></li>
                            <li>Iniciar sesión con las credenciales proporcionadas</li>
                            <li>Cambiar la contraseña temporal</li>
                            <li>Acceder a su dashboard organizacional</li>
                            <li>Comenzar a gestionar mascotas</li>
                        </ol>
                    </div>
                    
                    <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px;">
                        <h4 style="color: #10b981; margin-bottom: 10px;">✅ Funcionalidades Habilitadas</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>• Dashboard personalizado</div>
                            <div>• Gestión de mascotas</div>
                            <div>• Recepción de adopciones</div>
                            <div>• Estadísticas en tiempo real</div>
                            <div>• Aparición en mapa</div>
                            <div>• Comunicación con usuarios</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal').style.display='none'">
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    async verDetalles(id) {
        try {
            showLoading('Cargando detalles...');
            
            // Primero buscar en las solicitudes ya cargadas
            let solicitud = this.solicitudes.find(s => s.id === id);
            
            // Si no está en memoria, buscar en localStorage
            if (!solicitud) {
                const solicitudesLocal = JSON.parse(localStorage.getItem('solicitudesOrganizaciones') || '[]');
                solicitud = solicitudesLocal.find(s => s.id === id);
            }
            
            // Si aún no se encuentra, intentar servidor como último recurso
            if (!solicitud) {
                try {
                    const response = await fetch(`/api/admin/solicitudes-organizaciones/${id}`);
                    if (response.ok) {
                        solicitud = await response.json();
                    }
                } catch (serverError) {
                    console.log('Servidor no disponible, usando datos locales');
                }
            }
            
            hideLoading();
            
            if (solicitud) {
                this.mostrarModalDetalles(solicitud);
            } else {
                showNotification('No se pudo encontrar la solicitud', 'error');
            }
            
        } catch (error) {
            console.error('Error cargando detalles:', error);
            hideLoading();
            showNotification('Error al cargar los detalles', 'error');
        }
    }

    mostrarModalDetalles(solicitud) {
        const modal = document.getElementById('modalDetalles') || this.createModalDetalles();
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="detalle-organizacion">
                <div class="detalle-header">
                    <h3>${solicitud.nombreOrganizacion}</h3>
                    <span class="tipo-badge">${this.getTipoOrganizacion(solicitud.tipoOrganizacion)}</span>
                    ${this.getEstadoBadge(solicitud)}
                </div>
                
                <div class="detalle-section">
                    <h4><i class="fas fa-info-circle"></i> Información General</h4>
                    <div class="detalle-grid">
                        <div class="detalle-item">
                            <strong>Email:</strong> ${solicitud.emailContacto || solicitud.email || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Teléfono:</strong> ${solicitud.telefonoContacto || solicitud.telefono || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Persona de Contacto:</strong> ${solicitud.personaContacto || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Cargo:</strong> ${solicitud.cargoContacto || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Fecha de Solicitud:</strong> ${solicitud.fechaCreacion ? new Date(solicitud.fechaCreacion).toLocaleDateString() : 'No especificada'}
                        </div>
                        <div class="detalle-item">
                            <strong>Número de Solicitud:</strong> ${solicitud.numeroSolicitud || solicitud.id}
                        </div>
                    </div>
                </div>
                
                <div class="detalle-section">
                    <h4><i class="fas fa-map-marker-alt"></i> Ubicación</h4>
                    <div class="detalle-grid">
                        <div class="detalle-item">
                            <strong>Dirección:</strong> ${solicitud.direccion || 'No especificada'}
                        </div>
                        <div class="detalle-item">
                            <strong>Ciudad:</strong> ${solicitud.ciudad || 'No especificada'}
                        </div>
                        <div class="detalle-item">
                            <strong>Estado:</strong> ${solicitud.estado || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Código Postal:</strong> ${solicitud.codigoPostal || 'No especificado'}
                        </div>
                    </div>
                </div>
                
                <div class="detalle-section">
                    <h4><i class="fas fa-align-left"></i> Descripción</h4>
                    <div class="descripcion-contenedor">
                        <p style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%; white-space: pre-wrap;">${solicitud.descripcion || 'No hay descripción disponible'}</p>
                    </div>
                </div>
                
                <div class="detalle-section">
                    <h4><i class="fas fa-paw"></i> Información Adicional</h4>
                    <div class="detalle-grid">
                        <div class="detalle-item">
                            <strong>Tipos de Mascotas:</strong> ${Array.isArray(solicitud.tiposMascotas) ? solicitud.tiposMascotas.join(', ') : (solicitud.tiposMascotas || 'No especificado')}
                        </div>
                        <div class="detalle-item">
                            <strong>Servicios:</strong> ${Array.isArray(solicitud.servicios) ? solicitud.servicios.join(', ') : (solicitud.servicios || 'No especificado')}
                        </div>
                        <div class="detalle-item">
                            <strong>Capacidad de Mascotas:</strong> ${solicitud.capacidadMascotas || 'No especificada'}
                        </div>
                        <div class="detalle-item">
                            <strong>Años de Experiencia:</strong> ${solicitud.experienciaAnios || 'No especificado'}
                        </div>
                        <div class="detalle-item">
                            <strong>Sitio Web:</strong> ${solicitud.sitioWeb ? `<a href="${solicitud.sitioWeb}" target="_blank">${solicitud.sitioWeb}</a>` : 'No especificado'}
                        </div>
                    </div>
                </div>
                
                ${solicitud.estado === 'aprobada' && solicitud.comentariosAprobacion ? `
                    <div class="detalle-section success-section">
                        <h4><i class="fas fa-check-circle"></i> Comentarios de Aprobación</h4>
                        <p style="word-wrap: break-word;">${solicitud.comentariosAprobacion}</p>
                        <small>Aprobada el: ${new Date(solicitud.fechaAprobacion).toLocaleDateString()}</small>
                    </div>
                ` : ''}
                
                ${solicitud.estado === 'rechazada' && solicitud.motivoRechazo ? `
                    <div class="detalle-section error-section">
                        <h4><i class="fas fa-times-circle"></i> Motivo de Rechazo</h4>
                        <p style="word-wrap: break-word;">${solicitud.motivoRechazo}</p>
                        <small>Rechazada el: ${new Date(solicitud.fechaRechazo).toLocaleDateString()}</small>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Mostrar modal
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    createModalDetalles() {
        const modal = document.createElement('div');
        modal.id = 'modalDetalles';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Detalles de la Solicitud</h2>
                    <button class="modal-close" onclick="this.closest('.modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Contenido dinámico -->
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').style.display='none'">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    getEstadoTexto(solicitud) {
        const estado = solicitud.estado || 'pendiente';
        
        switch (estado) {
            case 'aprobada':
                return 'Aprobada y Activa';
            case 'rechazada':
                return 'Rechazada';
            case 'pendiente':
            default:
                return 'Pendiente de Verificación';
        }
    }

    // ========================================
    //   EVENTOS Y NAVEGACIÓN
    // ========================================

    setupEventListeners() {
        // Filtros
        const filtroSelect = document.getElementById('filtroEstado');
        if (filtroSelect) {
            filtroSelect.addEventListener('change', (e) => {
                this.cambiarFiltro(e.target.value);
            });
        }

        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.buscarOrganizaciones(e.target.value);
                }, 500);
            });
        }

        // Refrescar
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refrescarDatos();
            });
        }

        // Listener para nuevas solicitudes desde el formulario de registro
        window.addEventListener('solicitudEnviada', (event) => {
            console.log('🔔 Nueva solicitud detectada en admin panel:', event.detail);
            // Recargar datos automáticamente
            setTimeout(() => {
                this.refrescarDatos();
                showNotification('Nueva solicitud recibida - Panel actualizado', 'info');
            }, 1000);
        });

        // Listener para cambios en localStorage (si se actualiza desde otra pestaña)
        window.addEventListener('storage', (event) => {
            if (event.key === 'pethouse_solicitudes_organizaciones') {
                console.log('🔄 Cambios detectados en localStorage');
                setTimeout(() => {
                    this.refrescarDatos();
                }, 500);
            }
        });
    }

    async cambiarFiltro(filtro) {
        this.currentFilter = filtro;
        this.currentPage = 1;
        await this.cargarSolicitudes(filtro);
        this.renderSolicitudes();
    }

    async cambiarPagina(pagina) {
        this.currentPage = pagina;
        await this.cargarSolicitudes(this.currentFilter);
        this.renderSolicitudes();
        
        // Scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async refrescarDatos() {
        await this.cargarSolicitudes(this.currentFilter);
        await this.cargarEstadisticas();
        this.renderSolicitudes();
        showNotification('Datos actualizados', 'success');
    }

    buscarOrganizaciones(termino) {
        // Implementar búsqueda local por ahora
        const solicitudesFiltradas = this.solicitudes.filter(solicitud => 
            solicitud.nombreOrganizacion.toLowerCase().includes(termino.toLowerCase()) ||
            solicitud.email.toLowerCase().includes(termino.toLowerCase()) ||
            (solicitud.ubicacion?.ciudad || '').toLowerCase().includes(termino.toLowerCase())
        );

        // Renderizar resultados filtrados
        const solicitudesContainer = document.getElementById('solicitudesContainer');
        if (solicitudesContainer) {
            const solicitudesHTML = solicitudesFiltradas.map(solicitud => this.createSolicitudCard(solicitud)).join('');
            solicitudesContainer.innerHTML = `<div class="solicitudes-grid">${solicitudesHTML}</div>`;
        }
    }
}

// ========================================
//   FUNCIONES UTILITARIAS
// ========================================

function showLoading(message = 'Cargando...') {
    // Crear o mostrar spinner de carga
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p id="loaderMessage">${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        document.getElementById('loaderMessage').textContent = message;
    }
    loader.style.display = 'flex';
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Crear notificación toast
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar al contenedor de notificaciones
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// ========================================
//   INICIALIZACIÓN
// ========================================

let adminOrganizaciones;

document.addEventListener('DOMContentLoaded', () => {
    adminOrganizaciones = new AdminOrganizaciones();
});

// Exportar para uso global
window.adminOrganizaciones = adminOrganizaciones;
// ========================================
//   TIENDA MODERNA - FUNCIONALIDAD AVANZADA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initTiendaModerna();
});

// Variables globales
let currentCategory = 'todos';
let currentSort = 'relevancia';
let currentFilters = {
    priceMin: 0,
    priceMax: 2000,
    animals: [],
    sizes: [],
    brands: []
};
let cart = JSON.parse(localStorage.getItem('cart_pethouse') || '[]');
let favorites = JSON.parse(localStorage.getItem('favorites_pethouse') || '[]');
let currentPage = 1;
const itemsPerPage = 12;

function initTiendaModerna() {
    console.log('🛒 Inicializando Tienda Moderna...');
    
    // Inicializar funcionalidades
    initMobileNavigation();
    initSearch();
    initNavigation();
    initFilters();
    initCart();
    initProducts();
    updateCartDisplay();
    
    console.log('✅ Tienda Moderna inicializada correctamente');
}

// NAVEGACIÓN MÓVIL
function initMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
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
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
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
            }
        });
    }
}

// BÚSQUEDA
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 500);
    });
    
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

function performSearch(query) {
    console.log('🔍 Buscando:', query);
    
    if (query.trim() === '') {
        loadProducts();
        return;
    }
    
    const products = getProductDatabase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayProducts(filteredProducts);
    updateResultsCount(filteredProducts.length, `para "${query}"`);
}

// NAVEGACIÓN
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const categoryCards = document.querySelectorAll('.category-card');
    const sortSelect = document.getElementById('sort-select');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Actualizar navegación activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            currentPage = 1;
            loadProducts();
        });
    });
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Actualizar navegación
            navLinks.forEach(l => l.classList.remove('active'));
            const targetNav = document.querySelector(`[data-category="${category}"]`);
            if (targetNav) {
                targetNav.classList.add('active');
            }
            
            currentCategory = category;
            currentPage = 1;
            loadProducts();
            
            // Scroll a productos
            document.querySelector('.products-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        loadProducts();
    });
}

// FILTROS
function initFilters() {
    const filterBtn = document.getElementById('filter-btn');
    const closeFilters = document.getElementById('close-filters');
    const sidebar = document.getElementById('filters-sidebar');
    const overlay = document.getElementById('overlay');
    const priceSliders = document.querySelectorAll('.price-slider');
    const filterOptions = document.querySelectorAll('.filter-option input');
    const clearFilters = document.querySelector('.clear-filters');
    const applyFilters = document.querySelector('.apply-filters');
    
    // Abrir/cerrar filtros
    filterBtn.addEventListener('click', () => openFilters());
    closeFilters.addEventListener('click', () => closeFiltersPanel());
    overlay.addEventListener('click', () => closeFiltersPanel());
    
    // Sliders de precio
    priceSliders.forEach(slider => {
        slider.addEventListener('input', updatePriceDisplay);
    });
    
    // Opciones de filtro
    filterOptions.forEach(option => {
        option.addEventListener('change', updateFilterOptions);
    });
    
    // Acciones
    clearFilters.addEventListener('click', resetFilters);
    applyFilters.addEventListener('click', applyCurrentFilters);
    
    updatePriceDisplay();
}

function openFilters() {
    const sidebar = document.getElementById('filters-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFiltersPanel() {
    const sidebar = document.getElementById('filters-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function updatePriceDisplay() {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    const minDisplay = document.getElementById('price-min-display');
    const maxDisplay = document.getElementById('price-max-display');
    
    let minVal = parseInt(minSlider.value);
    let maxVal = parseInt(maxSlider.value);
    
    if (minVal > maxVal) {
        if (minSlider === document.activeElement) {
            maxSlider.value = minVal;
            maxVal = minVal;
        } else {
            minSlider.value = maxVal;
            minVal = maxVal;
        }
    }
    
    minDisplay.textContent = minVal;
    maxDisplay.textContent = maxVal;
    
    currentFilters.priceMin = minVal;
    currentFilters.priceMax = maxVal;
}

function updateFilterOptions() {
    const animalFilters = document.querySelectorAll('.filter-option input[value="perros"], .filter-option input[value="gatos"], .filter-option input[value="ambos"]');
    const sizeFilters = document.querySelectorAll('.filter-option input[value="pequeno"], .filter-option input[value="mediano"], .filter-option input[value="grande"]');
    const brandFilters = document.querySelectorAll('.filter-option input[value="pethouse"], .filter-option input[value="pedigree"], .filter-option input[value="hills"], .filter-option input[value="royal"]');
    
    currentFilters.animals = Array.from(animalFilters).filter(f => f.checked).map(f => f.value);
    currentFilters.sizes = Array.from(sizeFilters).filter(f => f.checked).map(f => f.value);
    currentFilters.brands = Array.from(brandFilters).filter(f => f.checked).map(f => f.value);
}

function resetFilters() {
    // Reset sliders
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 2000;
    
    // Reset checkboxes
    document.querySelectorAll('.filter-option input').forEach(input => {
        input.checked = false;
    });
    
    // Reset filters object
    currentFilters = {
        priceMin: 0,
        priceMax: 2000,
        animals: [],
        sizes: [],
        brands: []
    };
    
    updatePriceDisplay();
}

function applyCurrentFilters() {
    loadProducts();
    closeFiltersPanel();
}

// CARRITO
function initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const continueBtn = document.querySelector('.btn-continue');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    cartBtn.addEventListener('click', () => openCart());
    closeCart.addEventListener('click', () => closeCartPanel());
    continueBtn.addEventListener('click', () => closeCartPanel());
    checkoutBtn.addEventListener('click', () => proceedToCheckout());
    
    // Escuchar clicks del overlay para cerrar carrito
    const overlayEl = document.getElementById('overlay');
    if (overlayEl) {
        overlayEl.addEventListener('click', () => {
            closeCartPanel();
            closeFiltersPanel();
        });
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar) cartSidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCartDisplay();
}

function closeCartPanel() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId) {
    const products = getProductDatabase();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart_pethouse', JSON.stringify(cart));
    updateCartDisplay();
    
    // Mostrar feedback
    mostrarExito('Producto agregado', `${product.name} se agregó al carrito`);
    
    // Animar botón
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart_pethouse', JSON.stringify(cart));
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart_pethouse', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Actualizar contador y total en header
    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
    
    // Mostrar/ocultar contenido del carrito
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        
        // Renderizar items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-content">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Actualizar totales
        document.getElementById('cart-subtotal').textContent = `$${totalAmount.toFixed(2)}`;
        document.getElementById('cart-total-amount').textContent = `$${totalAmount.toFixed(2)}`;
        
        // Calcular animales ayudados (aprox $100 MXN = 1 animal por semana)
        const animalsHelped = Math.floor(totalAmount / 100);
        document.getElementById('animals-helped').textContent = animalsHelped;
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        mostrarError('Carrito vacío', 'Agrega productos antes de proceder al pago');
        return;
    }
    
    // Simular proceso de checkout
    mostrarInfo('Redirigiendo...', 'Te llevaremos a la página de pago seguro');
    
    setTimeout(() => {
        // En una implementación real, aquí se redirigiría a la página de checkout
        mostrarExito('¡Gracias por tu compra!', 'Tu pedido está siendo procesado. Recibirás un email de confirmación.');
        
        // Limpiar carrito después de "compra"
        cart = [];
        localStorage.setItem('cart_pethouse', JSON.stringify(cart));
        updateCartDisplay();
        closeCartPanel();
    }, 2000);
}

// PRODUCTOS
function initProducts() {
    loadFeaturedProducts();
    loadProducts();
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    const products = getProductDatabase();
    const featuredProducts = products.filter(p => p.featured).slice(0, 4);
    
    featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadProducts() {
    const products = getProductDatabase();
    let filteredProducts = products;
    
    // Filtrar por categoría
    if (currentCategory !== 'todos') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    // Aplicar filtros
    filteredProducts = applyFilters(filteredProducts);
    
    // Ordenar
    filteredProducts = sortProducts(filteredProducts);
    
    // Paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    displayProducts(paginatedProducts);
    updateResultsCount(filteredProducts.length);
    updatePagination(filteredProducts.length);
}

function applyFilters(products) {
    return products.filter(product => {
        // Filtro de precio
        if (product.price < currentFilters.priceMin || product.price > currentFilters.priceMax) {
            return false;
        }
        
        // Filtro de animales
        if (currentFilters.animals.length > 0 && !currentFilters.animals.includes(product.animal)) {
            return false;
        }
        
        // Filtro de tamaño
        if (currentFilters.sizes.length > 0 && !currentFilters.sizes.includes(product.size)) {
            return false;
        }
        
        // Filtro de marca
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brand)) {
            return false;
        }
        
        return true;
    });
}

function sortProducts(products) {
    switch (currentSort) {
        case 'precio-asc':
            return products.sort((a, b) => a.price - b.price);
        case 'precio-desc':
            return products.sort((a, b) => b.price - a.price);
        case 'nombre':
            return products.sort((a, b) => a.name.localeCompare(b.name));
        case 'popularidad':
            return products.sort((a, b) => b.popularity - a.popularity);
        default:
            return products;
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <i class="fas fa-search" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros o buscar otros términos</p>
                <button onclick="resetFilters(); loadProducts();" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Limpiar filtros
                </button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const isFavorite = favorites.includes(product.id);
    const discountPercent = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.featured ? '<span class="product-badge featured">Destacado</span>' : ''}
                ${product.category === 'donaciones' ? '<span class="product-badge donation">Donación</span>' : ''}
                ${discountPercent > 0 ? `<span class="product-badge">${discountPercent}% OFF</span>` : ''}
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${product.id}')">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <i class="fas fa-${product.animal === 'perros' ? 'dog' : product.animal === 'gatos' ? 'cat' : 'paw'}"></i>
                    <span>Para ${product.animal}</span>
                    <span>•</span>
                    <span>${product.size}</span>
                    <span>•</span>
                    <span>${product.brand}</span>
                </div>
                <div class="product-price">
                    <div>
                        <span class="price-current">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    ${discountPercent > 0 ? `<span class="price-discount">${discountPercent}% OFF</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart('${product.id}')" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al carrito
                    </button>
                    <button class="quick-view" onclick="quickView('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateResultsCount(count, searchTerm = '') {
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = `${count} productos encontrados ${searchTerm}`;
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Actualizar botones prev/next
    const prevBtn = pagination.querySelector('.prev');
    const nextBtn = pagination.querySelector('.next');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts();
            scrollToProducts();
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadProducts();
            scrollToProducts();
        }
    };
    
    // Actualizar números de página (simplificado)
    const pageNumbers = pagination.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            loadProducts();
            scrollToProducts();
        };
        pageNumbers.appendChild(pageBtn);
    }
    
    if (totalPages > 5) {
        const dots = document.createElement('span');
        dots.className = 'page-dots';
        dots.textContent = '...';
        pageNumbers.appendChild(dots);
        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = `page-btn ${totalPages === currentPage ? 'active' : ''}`;
        lastPageBtn.textContent = totalPages;
        lastPageBtn.onclick = () => {
            currentPage = totalPages;
            loadProducts();
            scrollToProducts();
        };
        pageNumbers.appendChild(lastPageBtn);
    }
}

function scrollToProducts() {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// FAVORITOS
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        mostrarInfo('Eliminado de favoritos', 'Producto removido de tu lista de favoritos');
    } else {
        favorites.push(productId);
        mostrarExito('Agregado a favoritos', 'Producto agregado a tu lista de favoritos');
    }
    
    localStorage.setItem('favorites_pethouse', JSON.stringify(favorites));
    
    // Actualizar UI
    const favoriteBtn = document.querySelector(`[data-product-id="${productId}"] .favorite-btn`);
    if (favoriteBtn) {
        favoriteBtn.classList.toggle('active');
    }
}

// VISTA RÁPIDA
function quickView(productId) {
    const products = getProductDatabase();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Crear modal de vista rápida (simplificado)
    mostrarInfo('Vista rápida', `${product.name} - $${product.price.toFixed(2)}\n\n${product.description}`);
}

// BASE DE DATOS DE PRODUCTOS (SIMULADA)
function getProductDatabase() {
    return [
        // Alimentación
        {
            id: 'alimento-001',
            name: 'Croquetas Premium para Perros Adultos',
            description: 'Alimento balanceado con proteínas de alta calidad para perros adultos de todas las razas.',
            price: 800.00,
            originalPrice: 920.00,
            category: 'alimentacion',
            animal: 'perros',
            size: 'grande',
            brand: 'pedigree',
            image: '../assets/images/croquetas/premium-adulto.webp',
            featured: true,
            popularity: 95
        },
        {
            id: 'alimento-002',
            name: 'Comida para Gatos Esterilizados',
            description: 'Fórmula especial para gatos esterilizados que ayuda a mantener un peso saludable.',
            price: 195.00,
            category: 'alimentacion',
            animal: 'gatos',
            size: 'mediano',
            brand: 'hills',
            image: '../assets/images/gata.jpg',
            featured: false,
            popularity: 88
        },
        {
            id: 'alimento-003',
            name: 'Snacks Naturales PETHOUSE',
            description: 'Premios saludables hechos con ingredientes naturales, libres de conservadores.',
            price: 45.00,
            category: 'alimentacion',
            animal: 'ambos',
            size: 'pequeno',
            brand: 'pethouse',
            image: '../assets/images/coco.jpg',
            featured: true,
            popularity: 92
        },
        
        // Accesorios
        {
            id: 'collar-001',
            name: 'Collar Ajustable con Identificación',
            description: 'Collar resistente y cómodo con placa de identificación personalizable.',
            price: 125.00,
            originalPrice: 150.00,
            category: 'accesorios',
            animal: 'perros',
            size: 'mediano',
            brand: 'pethouse',
            image: '../assets/images/perro2.webp',
            featured: false,
            popularity: 85
        },
        {
            id: 'collar-002',
            name: 'Arnés Deportivo Acolchado',
            description: 'Arnés ergonómico con acolchado suave, ideal para paseos largos y actividades.',
            price: 180.00,
            category: 'accesorios',
            animal: 'perros',
            size: 'grande',
            brand: 'pethouse',
            image: '../assets/images/pit.jpg',
            featured: true,
            popularity: 90
        },
        {
            id: 'collar-003',
            name: 'Correa Retráctil 5 metros',
            description: 'Correa retráctil de alta calidad con sistema de frenado suave.',
            price: 95.00,
            category: 'accesorios',
            animal: 'perros',
            size: 'mediano',
            brand: 'pedigree',
            image: '../assets/images/canelo.webp',
            featured: false,
            popularity: 78
        },
        
        // Juguetes
        {
            id: 'juguete-001',
            name: 'Pelota Interactiva con Sonido',
            description: 'Pelota resistente que emite sonidos para mantener entretenida a tu mascota.',
            price: 65.00,
            category: 'juguetes',
            animal: 'perros',
            size: 'mediano',
            brand: 'pethouse',
            image: '../assets/images/coco2.jpeg',
            featured: false,
            popularity: 82
        },
        {
            id: 'juguete-002',
            name: 'Set de Ratones para Gatos',
            description: 'Conjunto de 6 ratones de diferentes texturas para estimular el instinto de caza.',
            price: 35.00,
            category: 'juguetes',
            animal: 'gatos',
            size: 'pequeno',
            brand: 'hills',
            image: '../assets/images/gata.jpg',
            featured: true,
            popularity: 87
        },
        
        // Higiene
        {
            id: 'higiene-001',
            name: 'Shampoo Hipoalergénico',
            description: 'Shampoo suave formulado especialmente para pieles sensibles.',
            price: 85.00,
            category: 'higiene',
            animal: 'ambos',
            size: 'mediano',
            brand: 'royal',
            image: '../assets/images/inicio.jpeg',
            featured: false,
            popularity: 80
        },
        {
            id: 'higiene-002',
            name: 'Cepillo Desenredante Profesional',
            description: 'Cepillo ergonómico que elimina nudos sin lastimar a tu mascota.',
            price: 120.00,
            originalPrice: 140.00,
            category: 'higiene',
            animal: 'ambos',
            size: 'pequeno',
            brand: 'pethouse',
            image: '../assets/images/fondo.webp',
            featured: true,
            popularity: 91
        },
        
        // Donaciones
        {
            id: 'donacion-001',
            name: 'Alimenta un Rescatado por 1 Semana',
            description: 'Tu donación alimentará a uno de nuestros rescatados durante una semana completa.',
            price: 100.00,
            category: 'donaciones',
            animal: 'ambos',
            size: 'mediano',
            brand: 'pethouse',
            image: '../assets/images/LOGO.jpg',
            featured: true,
            popularity: 100
        },
        {
            id: 'donacion-002',
            name: 'Vacunación Completa',
            description: 'Cubre el costo de vacunación completa para un animal rescatado.',
            price: 350.00,
            category: 'donaciones',
            animal: 'ambos',
            size: 'grande',
            brand: 'pethouse',
            image: '../assets/images/LOGO.jpg',
            featured: true,
            popularity: 98
        },
        {
            id: 'donacion-003',
            name: 'Kit de Emergencia Animal',
            description: 'Proporciona medicamentos y suministros para emergencias veterinarias.',
            price: 500.00,
            category: 'donaciones',
            animal: 'ambos',
            size: 'grande',
            brand: 'pethouse',
            image: '../assets/images/LOGO.jpg',
            featured: false,
            popularity: 96
        }
    ];
}

// UTILIDADES GLOBALES
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleFavorite = toggleFavorite;
window.quickView = quickView;

console.log('🛒 Tienda Moderna cargada completamente');

// Seguridad: restaurar overflow si queda bloqueado y atajo ESC para cerrar paneles
function restoreBodyScroll() {
    if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
    }
}

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') restoreBodyScroll();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeCartPanel();
        closeFiltersPanel();
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.classList.remove('active');
        restoreBodyScroll();
    }
});
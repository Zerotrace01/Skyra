// SKYRA - Interactive JavaScript for Women's Accessories E-commerce

// Global state management
const SKYRA = {
    cart: JSON.parse(localStorage.getItem('skyra_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('skyra_wishlist')) || [],
    user: JSON.parse(localStorage.getItem('skyra_user')) || null,
    
    // Sample product data
    products: [
        {
            id: 1,
            name: "Golden Chain Necklace",
            category: "Necklaces",
            price: 299,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            isBestSeller: true,
            isNew: false,
            description: "Elegant golden chain necklace perfect for everyday wear"
        },
        {
            id: 2,
            name: "Pearl Drop Earrings",
            category: "Earrings",
            price: 199,
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            isBestSeller: true,
            isNew: false,
            description: "Classic pearl drop earrings for a timeless look"
        },
        {
            id: 3,
            name: "Silver Charm Bracelet",
            category: "Bracelets",
            price: 249,
            image: "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            isBestSeller: false,
            isNew: true,
            description: "Delicate silver bracelet with beautiful charms"
        },
        {
            id: 4,
            name: "Rose Gold Ring Set",
            category: "Rings",
            price: 399,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            isBestSeller: true,
            isNew: false,
            description: "Set of three rose gold rings for layering"
        },
        {
            id: 5,
            name: "Crystal Stud Earrings",
            category: "Earrings",
            price: 149,
            image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            isBestSeller: false,
            isNew: true,
            description: "Sparkling crystal stud earrings for any occasion"
        },
        {
            id: 6,
            name: "Statement Pendant",
            category: "Necklaces",
            price: 349,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            isBestSeller: true,
            isNew: false,
            description: "Bold statement pendant necklace for special occasions"
        }
    ],
    
    // Checkout data
    checkout: {
        shipping: {},
        payment: {
            method: 'cod'
        },
        items: []
    }
};

// Utility Functions
const Utils = {
    // Format price in Indian Rupees
    formatPrice: (price) => {
        return `₹${price.toLocaleString('en-IN')}`;
    },
    
    // Generate order number
    generateOrderNumber: () => {
        return 'SKY' + Date.now().toString().slice(-8);
    },
    
    // Show toast notification
    showToast: (message, type = 'success') => {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');
        
        toastMessage.textContent = message;
        
        // Update icon based on type
        if (type === 'success') {
            toastIcon.innerHTML = '<i data-lucide="check-circle"></i>';
            toast.style.backgroundColor = 'var(--color-accent-800)';
        } else if (type === 'error') {
            toastIcon.innerHTML = '<i data-lucide="alert-circle"></i>';
            toast.style.backgroundColor = '#dc2626';
        }
        
        toast.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },
    
    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone number (Indian format)
    validatePhone: (phone) => {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/\D/g, ''));
    },
    
    // Validate PIN code (Indian format)
    validatePincode: (pincode) => {
        const re = /^[1-9]\d{5}$/;
        return re.test(pincode);
    },
    
    // Smooth scroll to element
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId.replace('#', ''));
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Save to localStorage with error handling
    saveToStorage: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },
    
    // Animation helper for element entrance
    animateOnScroll: () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.product-card, .collection-card, .feature-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

// Cart Management
const CartManager = {
    // Add item to cart
    addToCart: (productId, quantity = 1) => {
        const product = SKYRA.products.find(p => p.id === productId);
        if (!product) return false;
        
        const existingItem = SKYRA.cart.find(item => item.product.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            SKYRA.cart.push({
                product: product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        Utils.saveToStorage('skyra_cart', SKYRA.cart);
        CartManager.updateCartUI();
        Utils.showToast(`${product.name} added to cart!`);
        
        return true;
    },
    
    // Remove item from cart
    removeFromCart: (productId) => {
        SKYRA.cart = SKYRA.cart.filter(item => item.product.id !== productId);
        Utils.saveToStorage('skyra_cart', SKYRA.cart);
        CartManager.updateCartUI();
        Utils.showToast('Item removed from cart');
    },
    
    // Update quantity
    updateQuantity: (productId, newQuantity) => {
        if (newQuantity <= 0) {
            CartManager.removeFromCart(productId);
            return;
        }
        
        const item = SKYRA.cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity = newQuantity;
            Utils.saveToStorage('skyra_cart', SKYRA.cart);
            CartManager.updateCartUI();
        }
    },
    
    // Get cart total
    getCartTotal: () => {
        return SKYRA.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },
    
    // Update cart UI
    updateCartUI: () => {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartFooter = document.getElementById('cartFooter');
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');
        
        // Update cart count
        const itemCount = SKYRA.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        
        if (SKYRA.cart.length === 0) {
            cartItems.innerHTML = '';
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            return;
        }
        
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        
        // Render cart items
        cartItems.innerHTML = SKYRA.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.product.name}</div>
                    <div class="cart-item-price">${Utils.formatPrice(item.product.price)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="CartManager.updateQuantity(${item.product.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i data-lucide="minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="CartManager.updateQuantity(${item.product.id}, ${item.quantity + 1})">
                                <i data-lucide="plus"></i>
                            </button>
                        </div>
                        <button class="remove-item-btn" onclick="CartManager.removeFromCart(${item.product.id})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update totals
        const subtotal = CartManager.getCartTotal();
        const shipping = subtotal >= 499 ? 0 : 49;
        const total = subtotal + shipping;
        
        subtotalElement.textContent = Utils.formatPrice(subtotal);
        shippingElement.textContent = shipping === 0 ? 'FREE' : Utils.formatPrice(shipping);
        totalElement.textContent = Utils.formatPrice(total);
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },
    
    // Clear cart
    clearCart: () => {
        SKYRA.cart = [];
        Utils.saveToStorage('skyra_cart', SKYRA.cart);
        CartManager.updateCartUI();
    }
};

// Product Management
const ProductManager = {
    // Render products
    renderProducts: (container, products) => {
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-badges">
                        ${product.isBestSeller ? '<span class="badge badge-bestseller">Best Seller</span>' : ''}
                        ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
                        ${product.price <= 500 ? '<span class="badge badge-under500">Under ₹500</span>' : ''}
                    </div>
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${Utils.formatPrice(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn-primary add-to-cart-btn" onclick="CartManager.addToCart(${product.id})">
                            Add to Cart
                        </button>
                        <button class="wishlist-btn" onclick="WishlistManager.toggleWishlist(${product.id})" aria-label="Add to wishlist">
                            <i data-lucide="heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
};

// Wishlist Management
const WishlistManager = {
    // Toggle wishlist
    toggleWishlist: (productId) => {
        const product = SKYRA.products.find(p => p.id === productId);
        if (!product) return;
        
        const isInWishlist = SKYRA.wishlist.some(item => item.id === productId);
        
        if (isInWishlist) {
            SKYRA.wishlist = SKYRA.wishlist.filter(item => item.id !== productId);
            Utils.showToast(`${product.name} removed from wishlist`);
        } else {
            SKYRA.wishlist.push(product);
            Utils.showToast(`${product.name} added to wishlist!`);
        }
        
        Utils.saveToStorage('skyra_wishlist', SKYRA.wishlist);
        WishlistManager.updateWishlistUI();
    },
    
    // Update wishlist UI
    updateWishlistUI: () => {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productCard = btn.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId);
            const isInWishlist = SKYRA.wishlist.some(item => item.id === productId);
            
            if (isInWishlist) {
                btn.classList.add('active');
                btn.style.backgroundColor = 'var(--color-primary-100)';
                btn.style.color = 'var(--color-primary-700)';
            } else {
                btn.classList.remove('active');
                btn.style.backgroundColor = 'var(--color-secondary-100)';
                btn.style.color = 'var(--color-text-secondary)';
            }
        });
    }
};

// Navigation Manager
const NavigationManager = {
    // Handle navigation
    init: () => {
        // Desktop navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    Utils.scrollToElement(targetId);
                    NavigationManager.setActiveNav(link);
                }
            });
        });
        
        // Mobile navigation
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    Utils.scrollToElement(targetId);
                    NavigationManager.closeMobileMenu();
                }
            });
        });
        
        // Hero buttons
        document.querySelector('.shop-now-btn')?.addEventListener('click', () => {
            Utils.scrollToElement('#shop');
        });
        
        document.querySelector('.explore-btn')?.addEventListener('click', () => {
            Utils.scrollToElement('#collections');
        });
        
        // Collection buttons
        document.querySelectorAll('.collection-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.scrollToElement('#shop');
            });
        });
        
        // View all button
        document.querySelector('.view-all-btn')?.addEventListener('click', () => {
            Utils.scrollToElement('#shop');
        });
        
        // Update active navigation on scroll
        NavigationManager.initScrollSpy();
    },
    
    // Set active navigation
    setActiveNav: (activeLink) => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    },
    
    // Initialize scroll spy
    initScrollSpy: () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-88px 0px 0px 0px' });
        
        sections.forEach(section => observer.observe(section));
    },
    
    // Open mobile menu
    openMobileMenu: () => {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    // Close mobile menu
    closeMobileMenu: () => {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Cart UI Manager
const CartUI = {
    // Toggle cart sidebar
    toggleCart: () => {
        const cartSidebar = document.getElementById('cartSidebar');
        const isActive = cartSidebar.classList.contains('active');
        
        if (isActive) {
            CartUI.closeCart();
        } else {
            CartUI.openCart();
        }
    },
    
    // Open cart
    openCart: () => {
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add event listener to close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', CartUI.handleOutsideClick);
        }, 100);
    },
    
    // Close cart
    closeCart: () => {
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('click', CartUI.handleOutsideClick);
    },
    
    // Handle outside click
    handleOutsideClick: (e) => {
        const cartSidebar = document.getElementById('cartSidebar');
        if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-btn')) {
            CartUI.closeCart();
        }
    }
};

// Payment Manager
const PaymentManager = {
    // Initialize checkout tabs
    initCheckoutTabs: () => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                PaymentManager.switchTab(targetTab);
            });
        });
        
        // Next tab buttons
        document.querySelectorAll('.next-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextTab = btn.dataset.next;
                if (PaymentManager.validateCurrentTab()) {
                    PaymentManager.switchTab(nextTab);
                }
            });
        });
        
        // Payment method selection
        document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
            input.addEventListener('change', PaymentManager.handlePaymentMethodChange);
        });
        
        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', PaymentManager.formatCardNumber);
        }
        
        // Expiry date formatting
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', PaymentManager.formatExpiryDate);
        }
    },
    
    // Switch tab
    switchTab: (targetTab) => {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === targetTab) {
                btn.classList.add('active');
            }
            
            // Mark completed tabs
            const tabOrder = ['shipping', 'payment', 'review'];
            const currentIndex = tabOrder.indexOf(targetTab);
            const btnIndex = tabOrder.indexOf(btn.dataset.tab);
            
            if (btnIndex < currentIndex) {
                btn.classList.add('completed');
            } else {
                btn.classList.remove('completed');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${targetTab}Tab`).classList.add('active');
        
        // Populate review tab if switching to it
        if (targetTab === 'review') {
            PaymentManager.populateReview();
        }
    },
    
    // Validate current tab
    validateCurrentTab: () => {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return true;
        
        if (activeTab.id === 'shippingTab') {
            return PaymentManager.validateShippingForm();
        } else if (activeTab.id === 'paymentTab') {
            return PaymentManager.validatePaymentForm();
        }
        
        return true;
    },
    
    // Validate shipping form
    validateShippingForm: () => {
        const form = document.getElementById('shippingForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Required fields
        const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
        
        if (missingFields.length > 0) {
            Utils.showToast('Please fill in all required fields', 'error');
            return false;
        }
        
        // Email validation
        if (!Utils.validateEmail(data.email)) {
            Utils.showToast('Please enter a valid email address', 'error');
            return false;
        }
        
        // Phone validation
        if (!Utils.validatePhone(data.phone)) {
            Utils.showToast('Please enter a valid 10-digit phone number', 'error');
            return false;
        }
        
        // Pincode validation
        if (!Utils.validatePincode(data.pincode)) {
            Utils.showToast('Please enter a valid 6-digit PIN code', 'error');
            return false;
        }
        
        // Save shipping data
        SKYRA.checkout.shipping = data;
        
        return true;
    },
    
    // Validate payment form
    validatePaymentForm: () => {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        SKYRA.checkout.payment.method = selectedMethod;
        
        if (selectedMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('cardName').value;
            
            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                Utils.showToast('Please fill in all card details', 'error');
                return false;
            }
            
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                Utils.showToast('Please enter a valid 16-digit card number', 'error');
                return false;
            }
            
            if (cvv.length !== 3) {
                Utils.showToast('Please enter a valid 3-digit CVV', 'error');
                return false;
            }
            
            SKYRA.checkout.payment.cardDetails = {
                number: cardNumber,
                expiry: expiryDate,
                cvv: cvv,
                name: cardName
            };
        }
        
        return true;
    },
    
    // Handle payment method change
    handlePaymentMethodChange: (e) => {
        const cardDetails = document.getElementById('cardDetails');
        if (e.target.value === 'card') {
            cardDetails.style.display = 'block';
        } else {
            cardDetails.style.display = 'none';
        }
    },
    
    // Format card number
    formatCardNumber: (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substring(0, 19);
        }
        e.target.value = formattedValue;
    },
    
    // Format expiry date
    formatExpiryDate: (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    },
    
    // Populate review tab
    populateReview: () => {
        const reviewShipping = document.getElementById('reviewShipping');
        const reviewPayment = document.getElementById('reviewPayment');
        const reviewItems = document.getElementById('reviewItems');
        const reviewSubtotal = document.getElementById('reviewSubtotal');
        const reviewShippingCost = document.getElementById('reviewShippingCost');
        const reviewTotal = document.getElementById('reviewTotal');
        
        // Populate shipping details
        const shipping = SKYRA.checkout.shipping;
        reviewShipping.innerHTML = `
            <p><strong>${shipping.fullName}</strong></p>
            <p>${shipping.address}</p>
            <p>${shipping.city}, ${shipping.state} - ${shipping.pincode}</p>
            <p>Phone: ${shipping.phone}</p>
            <p>Email: ${shipping.email}</p>
        `;
        
        // Populate payment method
        const paymentMethod = SKYRA.checkout.payment.method;
        const paymentLabels = {
            'card': 'Credit/Debit Card',
            'upi': 'UPI Payment',
            'netbanking': 'Net Banking',
            'wallet': 'Digital Wallet',
            'cod': 'Cash on Delivery'
        };
        reviewPayment.textContent = paymentLabels[paymentMethod];
        
        // Populate items
        reviewItems.innerHTML = SKYRA.cart.map(item => `
            <div class="review-item">
                <div class="review-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}" loading="lazy">
                </div>
                <div class="review-item-details">
                    <div class="review-item-name">${item.product.name}</div>
                    <div class="review-item-price">Qty: ${item.quantity} × ${Utils.formatPrice(item.product.price)}</div>
                </div>
            </div>
        `).join('');
        
        // Calculate and display totals
        const subtotal = CartManager.getCartTotal();
        const shippingCost = subtotal >= 499 ? 0 : 49;
        const total = subtotal + shippingCost;
        
        reviewSubtotal.textContent = Utils.formatPrice(subtotal);
        reviewShippingCost.textContent = shippingCost === 0 ? 'FREE' : Utils.formatPrice(shippingCost);
        reviewTotal.textContent = Utils.formatPrice(total);
    }
};

// Modal Manager
const ModalManager = {
    // Open payment modal
    openPaymentModal: () => {
        if (SKYRA.cart.length === 0) {
            Utils.showToast('Your cart is empty', 'error');
            return;
        }
        
        const modal = document.getElementById('paymentModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset to first tab
        PaymentManager.switchTab('shipping');
        
        // Close cart sidebar
        CartUI.closeCart();
    },
    
    // Close payment modal
    closePaymentModal: () => {
        const modal = document.getElementById('paymentModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    // Open success modal
    openSuccessModal: (orderNumber) => {
        const modal = document.getElementById('successModal');
        const orderNumberSpan = document.getElementById('orderNumber');
        
        orderNumberSpan.textContent = orderNumber;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Close payment modal
        ModalManager.closePaymentModal();
    },
    
    // Close success modal
    closeSuccessModal: () => {
        const modal = document.getElementById('successModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Process Payment
const processPayment = () => {
    const placeOrderBtn = document.querySelector('.place-order-btn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Processing...';
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Simulate payment processing
    setTimeout(() => {
        const orderNumber = Utils.generateOrderNumber();
        
        // Clear cart after successful order
        CartManager.clearCart();
        
        // Show success modal
        ModalManager.openSuccessModal(orderNumber);
        
        // Reset button
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = '<i data-lucide="lock"></i> Place Secure Order';
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    }, 2000);
};

// Search functionality
const SearchManager = {
    init: () => {
        const searchBtn = document.querySelector('.search-btn');
        searchBtn?.addEventListener('click', SearchManager.toggleSearch);
    },
    
    toggleSearch: () => {
        // Simple search implementation - can be expanded
        const query = prompt('Search for products...');
        if (query) {
            const filteredProducts = SKYRA.products.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
            
            const container = document.getElementById('productsGrid');
            if (filteredProducts.length > 0) {
                ProductManager.renderProducts(container, filteredProducts);
                Utils.scrollToElement('#shop');
                Utils.showToast(`Found ${filteredProducts.length} products for "${query}"`);
            } else {
                Utils.showToast(`No products found for "${query}"`, 'error');
            }
        }
    }
};

// Form Enhancement
const FormManager = {
    init: () => {
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm?.addEventListener('submit', FormManager.handleNewsletterSubmit);
        
        // Add loading states to forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', FormManager.addLoadingState);
        });
    },
    
    handleNewsletterSubmit: (e) => {
        e.preventDefault();
        const email = e.target.querySelector('.newsletter-input').value;
        
        if (Utils.validateEmail(email)) {
            Utils.showToast('Thank you for subscribing to our newsletter!');
            e.target.reset();
        } else {
            Utils.showToast('Please enter a valid email address', 'error');
        }
    },
    
    addLoadingState: (e) => {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalText;
            }, 1000);
        }
    }
};

// Performance optimizations
const PerformanceManager = {
    init: () => {
        // Lazy loading for images
        PerformanceManager.initLazyLoading();
        
        // Preload critical resources
        PerformanceManager.preloadResources();
        
        // Optimize scroll performance
        PerformanceManager.optimizeScroll();
    },
    
    initLazyLoading: () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('img-loading');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.classList.add('img-loading');
                imageObserver.observe(img);
            });
        }
    },
    
    preloadResources: () => {
        // Preload hero image
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = heroImage.src;
            document.head.appendChild(link);
        }
    },
    
    optimizeScroll: () => {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            
            // Update header background opacity
            if (scrolled > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
};

// Accessibility enhancements
const AccessibilityManager = {
    init: () => {
        // Keyboard navigation
        AccessibilityManager.initKeyboardNavigation();
        
        // Focus management
        AccessibilityManager.initFocusManagement();
        
        // ARIA enhancements
        AccessibilityManager.initAriaEnhancements();
    },
    
    initKeyboardNavigation: () => {
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    modal.classList.remove('active');
                });
                
                // Close cart sidebar
                const cartSidebar = document.getElementById('cartSidebar');
                if (cartSidebar.classList.contains('active')) {
                    CartUI.closeCart();
                }
                
                // Close mobile menu
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu.classList.contains('active')) {
                    NavigationManager.closeMobileMenu();
                }
                
                document.body.style.overflow = '';
            }
        });
        
        // Enter key for buttons
        document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    },
    
    initFocusManagement: () => {
        // Trap focus in modals
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        } else if (!e.shiftKey && document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
        });
    },
    
    initAriaEnhancements: () => {
        // Update ARIA attributes dynamically
        const updateCartAria = () => {
            const cartBtn = document.querySelector('.cart-btn');
            const itemCount = SKYRA.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBtn.setAttribute('aria-label', `Shopping cart with ${itemCount} items`);
        };
        
        // Update on cart changes
        const originalUpdateCartUI = CartManager.updateCartUI;
        CartManager.updateCartUI = function() {
            originalUpdateCartUI.call(this);
            updateCartAria();
        };
        
        // Initial update
        updateCartAria();
    }
};

// Global functions for HTML onclick handlers
window.toggleCart = CartUI.toggleCart;
window.openPaymentModal = ModalManager.openPaymentModal;
window.closePaymentModal = ModalManager.closePaymentModal;
window.closeSuccessModal = ModalManager.closeSuccessModal;
window.processPayment = processPayment;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    NavigationManager.init();
    CartManager.updateCartUI();
    SearchManager.init();
    FormManager.init();
    PerformanceManager.init();
    AccessibilityManager.init();
    
    // Load products
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        ProductManager.renderProducts(productsGrid, SKYRA.products);
        WishlistManager.updateWishlistUI();
    }
    
    // Initialize payment modal
    PaymentManager.initCheckoutTabs();
    
    // Event listeners
    document.querySelector('.menu-toggle')?.addEventListener('click', NavigationManager.openMobileMenu);
    document.querySelector('.mobile-menu-close')?.addEventListener('click', NavigationManager.closeMobileMenu);
    document.querySelector('.cart-btn')?.addEventListener('click', CartUI.toggleCart);
    document.querySelector('.cart-close')?.addEventListener('click', CartUI.closeCart);
    
    // Modal close handlers
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize animations
    Utils.animateOnScroll();
    
    // Show welcome message
    setTimeout(() => {
        Utils.showToast('Welcome to SKYRA! Discover luxury accessories under ₹500');
    }, 1000);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any running animations or intervals
        console.log('Page hidden - optimizing performance');
    } else {
        // Resume normal operations
        console.log('Page visible - resuming normal operations');
    }
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // This can be implemented for offline functionality
        console.log('Service Worker support detected');
    });
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SKYRA,
        Utils,
        CartManager,
        ProductManager,
        WishlistManager,
        PaymentManager,
        NavigationManager
    };
}
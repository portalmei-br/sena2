// Telesena Prize Consultation System
// Professional CPF consultation with simulated API

class TelesenaSystem {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.animateStats();
    }

    init() {
        // Initialize system
        this.cpfInput = document.getElementById('cpf-input');
        this.searchBtn = document.getElementById('search-btn');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.prizeModal = document.getElementById('prize-modal');
        this.noPrizeModal = document.getElementById('no-prize-modal');
        
        // Setup CPF mask
        this.setupCPFMask();
        
        // Setup mobile navigation
        this.setupMobileNav();
        
        // Setup FAQ accordion
        this.setupFAQ();
        
        // Setup back to top button
        this.setupBackToTop();
        
        // Setup scroll effects
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Search button click
        this.searchBtn.addEventListener('click', () => this.searchPrize());
        
        // Enter key on CPF input
        this.cpfInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchPrize();
            }
        });
        
        // Scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.getElementById('como-funciona').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    setupCPFMask() {
        this.cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
            
            // Update button state
            this.updateSearchButtonState();
        });
    }

    updateSearchButtonState() {
        const cpf = this.cpfInput.value.replace(/\D/g, '');
        const isValid = cpf.length === 11;
        
        this.searchBtn.disabled = !isValid;
        this.searchBtn.style.opacity = isValid ? '1' : '0.6';
        this.searchBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }

    async searchPrize() {
        const cpf = this.cpfInput.value.replace(/\D/g, '');
        
        if (!this.validateCPF(cpf)) {
            this.showNotification('CPF inválido. Verifique os dados digitados.', 'error');
            return;
        }

        // Show loading
        this.showLoading();
        
        try {
            // Simulate API call
            const userData = await this.consultCPFAPI(cpf);
            
            // Hide loading
            this.hideLoading();
            
            if (userData.hasPrize) {
                this.showPrizeModal(userData);
            } else {
                this.showNoPrizeModal(userData);
            }
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('Erro na consulta. Tente novamente.', 'error');
        }
    }

    async consultCPFAPI(cpf) {
        // Simulate API delay
        await this.delay(3000);
        
        // Simulate different scenarios based on CPF
        const lastDigit = parseInt(cpf.slice(-1));
        const hasPrize = lastDigit % 3 === 0; // 30% chance of having a prize
        
        // Generate fake user data based on CPF
        const userData = this.generateUserData(cpf, hasPrize);
        
        return userData;
    }

    generateUserData(cpf, hasPrize) {
        // Brazilian names database
        const firstNames = [
            'João', 'Maria', 'José', 'Ana', 'Francisco', 'Antônio', 'Carlos', 'Mariana',
            'Paulo', 'Fernanda', 'Pedro', 'Juliana', 'Lucas', 'Camila', 'Rafael', 'Beatriz',
            'Gabriel', 'Larissa', 'Daniel', 'Patrícia', 'Roberto', 'Adriana', 'Fernando', 'Carla'
        ];
        
        const lastNames = [
            'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
            'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
            'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Monteiro', 'Cardoso'
        ];
        
        const cities = [
            'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA',
            'Fortaleza, CE', 'Brasília, DF', 'Curitiba, PR', 'Recife, PE', 'Porto Alegre, RS',
            'Manaus, AM', 'Belém, PA', 'Goiânia, GO', 'Guarulhos, SP', 'Campinas, SP',
            'São Luís, MA', 'São Gonçalo, RJ', 'Maceió, AL', 'Duque de Caxias, RJ'
        ];
        
        // Generate deterministic data based on CPF
        const cpfSum = cpf.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        const firstNameIndex = cpfSum % firstNames.length;
        const lastNameIndex = (cpfSum * 2) % lastNames.length;
        const cityIndex = (cpfSum * 3) % cities.length;
        
        const firstName = firstNames[firstNameIndex];
        const lastName = lastNames[lastNameIndex];
        const fullName = `${firstName} ${lastName}`;
        const location = cities[cityIndex];
        
        let prizeData = null;
        if (hasPrize) {
            // Generate prize value between R$ 500 and R$ 5000
            const prizeValue = 500 + (cpfSum * 47) % 4500;
            const formattedValue = prizeValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            // Generate protocol
            const protocol = `TSN-2025-${String(cpfSum * 123).padStart(6, '0')}`;
            
            prizeData = {
                value: formattedValue,
                protocol: protocol,
                expiry: '31/12/2025'
            };
        }
        
        return {
            name: fullName,
            cpf: this.formatCPF(cpf),
            location: location,
            hasPrize: hasPrize,
            prize: prizeData
        };
    }

    formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    validateCPF(cpf) {
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    showLoading() {
        const messages = [
            'Verificando informações no banco de dados da Telesena',
            'Consultando sistema de prêmios...',
            'Validando dados do cliente...',
            'Processando consulta...'
        ];
        
        let messageIndex = 0;
        const loadingMessage = document.getElementById('loading-message');
        
        this.loadingOverlay.style.display = 'flex';
        
        // Change message every 800ms
        this.loadingInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            loadingMessage.textContent = messages[messageIndex];
        }, 800);
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
    }

    showPrizeModal(userData) {
        // Populate modal with user data
        document.getElementById('user-name').textContent = userData.name;
        document.getElementById('user-cpf').textContent = `CPF: ${userData.cpf}`;
        document.getElementById('user-location').textContent = userData.location;
        document.getElementById('prize-value').textContent = userData.prize.value;
        document.getElementById('prize-protocol').textContent = userData.prize.protocol;
        document.getElementById('prize-expiry').textContent = userData.prize.expiry;
        
        // Show modal
        this.prizeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Track event
        this.trackEvent('prize_found', {
            cpf: userData.cpf,
            prize_value: userData.prize.value
        });
    }

    showNoPrizeModal(userData) {
        // Populate modal with user data
        document.getElementById('no-prize-user-name').textContent = userData.name;
        document.getElementById('no-prize-user-cpf').textContent = `CPF: ${userData.cpf}`;
        document.getElementById('no-prize-user-location').textContent = userData.location;
        
        // Show modal
        this.noPrizeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Track event
        this.trackEvent('no_prize_found', {
            cpf: userData.cpf
        });
    }

    closePrizeModal() {
        this.prizeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeNoPrizeModal() {
        this.noPrizeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    redirectToRedeem() {
        // Simulate redirect to redemption page
        this.showNotification('Redirecionando para página de resgate...', 'success');
        
        // In a real application, this would redirect to the redemption page
        setTimeout(() => {
            window.location.href = '#resgate'; // Placeholder
        }, 2000);
    }

    newSearch() {
        this.closeNoPrizeModal();
        this.cpfInput.value = '';
        this.cpfInput.focus();
        document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        // Set message
        messageEl.textContent = message;
        
        // Set icon based on type
        let icon = 'fas fa-check-circle';
        if (type === 'error') icon = 'fas fa-exclamation-circle';
        if (type === 'warning') icon = 'fas fa-exclamation-triangle';
        
        iconEl.className = `notification-icon ${icon}`;
        
        // Set type class
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    setupMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupScrollEffects() {
        // Header scroll effect
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll for navigation links
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateNumber = (element, target) => {
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current).toLocaleString('pt-BR');
            }, 16);
        };
        
        // Intersection Observer for stats animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateNumber(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking (placeholder)
        console.log('Event tracked:', eventName, data);
        
        // In a real application, this would send data to analytics service
        // Example: gtag('event', eventName, data);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for modal controls
function closePrizeModal() {
    window.telesenaSystem.closePrizeModal();
}

function closeNoPrizeModal() {
    window.telesenaSystem.closeNoPrizeModal();
}

function redirectToRedeem() {
    window.telesenaSystem.redirectToRedeem();
}

function newSearch() {
    window.telesenaSystem.newSearch();
}

// Initialize system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.telesenaSystem = new TelesenaSystem();
});

// Handle modal clicks outside content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'prize-modal') {
            closePrizeModal();
        } else if (e.target.id === 'no-prize-modal') {
            closeNoPrizeModal();
        }
    }
});

// Handle escape key for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const prizeModal = document.getElementById('prize-modal');
        const noPrizeModal = document.getElementById('no-prize-modal');
        
        if (prizeModal.style.display === 'flex') {
            closePrizeModal();
        } else if (noPrizeModal.style.display === 'flex') {
            closeNoPrizeModal();
        }
    }
});

// Prevent form submission on enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const cpfInput = document.getElementById('cpf-input');
        if (document.activeElement === cpfInput) {
            e.preventDefault();
            window.telesenaSystem.searchPrize();
        }
    }
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In a real application, register service worker here
        console.log('Service Worker support detected');
    });
}

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical resources
    const criticalImages = [
        // Add critical image URLs here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In a real application, send error to monitoring service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In a real application, send error to monitoring service
});


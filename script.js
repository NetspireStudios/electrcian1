// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Add null checks and error handling
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Hamburger clicked'); // Debug log
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Force a style recalculation
            hamburger.offsetHeight;
            navMenu.offsetHeight;
        });
    } else {
        console.error('Hamburger or navigation menu not found');
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header Background Change on Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Basic form validation
            const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'service', 'address', 'message', 'urgency'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = contactForm.querySelector(`[name="${field}"]`);
                if (!formObject[field] || formObject[field].trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.classList.add('error');
                } else {
                    input.style.borderColor = '#e5e7eb';
                    input.classList.remove('error');
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailInput = contactForm.querySelector('[name="email"]');
            if (!emailRegex.test(formObject.email)) {
                isValid = false;
                emailInput.style.borderColor = '#ef4444';
                emailInput.classList.add('error');
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const phoneInput = contactForm.querySelector('[name="phone"]');
            if (!phoneRegex.test(formObject.phone.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                phoneInput.style.borderColor = '#ef4444';
                phoneInput.classList.add('error');
            }
            
            if (isValid) {
                // Show success message
                showNotification('Thank you! Your request has been submitted. We\'ll contact you within 24 hours.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // In a real application, you would send the data to your server
                console.log('Form submitted:', formObject);
                
                // Simulate sending email (in real app, this would be server-side)
                // sendEmailNotification(formObject);
                
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Gallery Carousel Functionality
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.gallery-slide');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    let currentSlide = 0;
    const totalSlides = carouselSlides.length;
    
    // Auto-play carousel
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 seconds
    
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update active slide
        carouselSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update active dot
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay(); // Restart auto-play
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay(); // Restart auto-play
        });
    }
    
    // Dot navigation
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            startAutoPlay(); // Restart auto-play
        });
    });
    
    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            stopAutoPlay();
            startAutoPlay();
        }
    }
    
    // Start auto-play when page loads
    if (carouselTrack) {
        startAutoPlay();
    }
    
    // Gallery Image Modal (Enhanced for Carousel)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <div class="modal-backdrop">
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <img src="${img.src}" alt="${img.alt}">
                        <div class="modal-info">
                            <h3>${title}</h3>
                            <p>${description}</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal styles
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            `;
            
            const modalImg = modal.querySelector('img');
            modalImg.style.cssText = `
                width: 100%;
                height: auto;
                max-height: 70vh;
                object-fit: cover;
            `;
            
            const modalInfo = modal.querySelector('.modal-info');
            modalInfo.style.cssText = `
                padding: 1.5rem;
            `;
            
            const modalClose = modal.querySelector('.modal-close');
            modalClose.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            `;
            
            // Pause carousel auto-play when modal is open
            stopAutoPlay();
            
            // Add to DOM
            document.body.appendChild(modal);
            
            // Animate in
            setTimeout(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 50);
            
            // Close functionality
            function closeModal() {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    modal.remove();
                    startAutoPlay(); // Resume auto-play when modal closes
                }, 300);
            }
            
            modalClose.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Close on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.parentNode) {
                    closeModal();
                }
            });
        });
    });
    
    // Counter Animation for Stats
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const finalValue = stat.textContent;
                    const isPercentage = finalValue.includes('%');
                    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                    
                    let currentValue = 0;
                    const increment = numericValue / 50; // 50 steps for animation
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            currentValue = numericValue;
                            clearInterval(timer);
                        }
                        
                        stat.textContent = Math.floor(currentValue) + (isPercentage ? '%' : '+');
                    }, 30);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Scroll-triggered animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
                
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = `(${value}`;
                } else if (value.length <= 6) {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = formattedValue;
        });
    });
    
    // Emergency button click tracking
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            // Track emergency button clicks (for analytics)
            console.log('Emergency contact clicked');
            
            // You could send this to analytics service
            // gtag('event', 'emergency_contact', { 'event_category': 'contact' });
        });
    }
    
    // Service Modal Functionality
    const serviceModal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalServiceTitle');
    const modalContent = document.getElementById('modalServiceContent');
    const modalClose = document.querySelector('.service-modal-close');
    
    // Detailed service information
    const serviceDetails = {
        'Residential Electrical': {
            title: 'Residential Electrical Services',
            description: 'Complete electrical solutions for your home, from basic repairs to full rewiring projects. Our certified electricians ensure your home is safe, efficient, and up to code.',
            features: [
                {
                    title: 'New Home Wiring',
                    description: 'Complete electrical installation for new construction and major renovations.'
                },
                {
                    title: 'Panel Upgrades',
                    description: 'Upgrade your electrical panel to handle modern electrical demands safely.'
                },
                {
                    title: 'Outlet Installation',
                    description: 'Add new outlets and switches throughout your home for convenience.'
                },
                {
                    title: 'Lighting Solutions',
                    description: 'Indoor and outdoor lighting installation, including LED upgrades.'
                }
            ],
            services: [
                'Electrical panel installation and upgrades',
                'GFCI outlet installation in kitchens and bathrooms',
                'Ceiling fan installation and repair',
                'Whole house surge protection',
                'Code compliance inspections',
                'Electrical troubleshooting and repairs',
                'Smart home electrical preparation',
                'Dedicated circuits for appliances'
            ],
            pricing: 'Free estimates • Licensed & insured • 2-year warranty on all work'
        },
        'Commercial Electrical': {
            title: 'Commercial Electrical Services',
            description: 'Professional electrical services for businesses, offices, retail spaces, and industrial facilities. We minimize downtime and ensure your business stays operational.',
            features: [
                {
                    title: 'Office Electrical',
                    description: 'Complete electrical systems for modern office environments.'
                },
                {
                    title: 'Retail Lighting',
                    description: 'Energy-efficient lighting solutions that enhance your business.'
                },
                {
                    title: 'Industrial Wiring',
                    description: 'Heavy-duty electrical systems for manufacturing and industrial use.'
                },
                {
                    title: 'Maintenance Contracts',
                    description: 'Ongoing electrical maintenance to prevent costly downtime.'
                }
            ],
            services: [
                'Commercial panel installation and maintenance',
                'LED lighting retrofits and new installations',
                'Data and communication wiring',
                'Emergency lighting and exit signs',
                'Parking lot and security lighting',
                'Motor controls and industrial equipment wiring',
                'Power distribution systems',
                'Electrical safety inspections'
            ],
            pricing: 'Custom quotes • 24/7 emergency service • Volume discounts available'
        },
        'Emergency Repairs': {
            title: '24/7 Emergency Electrical Repairs',
            description: 'When electrical emergencies strike, we\'re here to help. Our emergency service team is available around the clock to restore power and ensure your safety.',
            features: [
                {
                    title: 'Rapid Response',
                    description: 'Fast response times to minimize disruption and ensure safety.'
                },
                {
                    title: 'Safety First',
                    description: 'Immediate assessment and resolution of electrical hazards.'
                },
                {
                    title: 'Power Restoration',
                    description: 'Quick diagnosis and repair to restore your electrical service.'
                },
                {
                    title: 'Prevention Advice',
                    description: 'Guidance on preventing future electrical emergencies.'
                }
            ],
            services: [
                'Power outage diagnosis and restoration',
                'Electrical fire damage assessment',
                'Circuit breaker and fuse problems',
                'Sparking outlets and switches',
                'Burning smell investigations',
                'Storm damage electrical repairs',
                'Generator hookup and service',
                'Emergency panel replacements'
            ],
            pricing: 'Available 24/7 • Emergency service fees apply • Same-day repairs'
        },
        'EV Charging Stations': {
            title: 'Electric Vehicle Charging Solutions',
            description: 'Professional installation of EV charging stations for homes and businesses. We help you embrace the future of transportation with reliable charging infrastructure.',
            features: [
                {
                    title: 'Home Charging',
                    description: 'Convenient Level 2 charging stations for residential use.'
                },
                {
                    title: 'Commercial Stations',
                    description: 'Multi-port charging solutions for businesses and workplaces.'
                },
                {
                    title: 'Smart Features',
                    description: 'WiFi-enabled chargers with smartphone app control.'
                },
                {
                    title: 'Future-Ready',
                    description: 'Scalable solutions that grow with your charging needs.'
                }
            ],
            services: [
                'Level 2 home charging station installation',
                'Commercial multi-port charging systems',
                'Electrical panel upgrades for EV charging',
                'Smart charger installation and setup',
                'Dedicated 240V circuit installation',
                'Permit acquisition and inspections',
                'Maintenance and repair services',
                'Load management systems'
            ],
            pricing: 'Free site assessment • Rebate assistance • Financing options available'
        },
        'Smart Home Systems': {
            title: 'Smart Home Electrical Systems',
            description: 'Transform your home into a smart, connected living space. We install and configure smart electrical systems that enhance comfort, security, and energy efficiency.',
            features: [
                {
                    title: 'Home Automation',
                    description: 'Integrated systems for lighting, climate, and security control.'
                },
                {
                    title: 'Smart Lighting',
                    description: 'Intelligent lighting systems with scheduling and remote control.'
                },
                {
                    title: 'Energy Management',
                    description: 'Monitor and optimize your home\'s energy consumption.'
                },
                {
                    title: 'Security Integration',
                    description: 'Smart electrical components for enhanced home security.'
                }
            ],
            services: [
                'Smart switch and dimmer installation',
                'Whole-home automation systems',
                'Voice control integration (Alexa, Google)',
                'Smart thermostat wiring and setup',
                'Security system electrical work',
                'Home energy monitoring systems',
                'Smart outdoor lighting and irrigation',
                'Network and WiFi infrastructure'
            ],
            pricing: 'Custom design consultation • Professional installation • Training included'
        },
        'Electrical Inspections': {
            title: 'Professional Electrical Inspections',
            description: 'Comprehensive electrical safety inspections to ensure your property meets current codes and operates safely. Essential for home sales, insurance, and peace of mind.',
            features: [
                {
                    title: 'Safety Assessment',
                    description: 'Thorough evaluation of all electrical systems and components.'
                },
                {
                    title: 'Code Compliance',
                    description: 'Verification that electrical work meets current building codes.'
                },
                {
                    title: 'Detailed Reports',
                    description: 'Comprehensive documentation of findings and recommendations.'
                },
                {
                    title: 'Expert Guidance',
                    description: 'Professional advice on necessary repairs and upgrades.'
                }
            ],
            services: [
                'Pre-purchase home electrical inspections',
                'Insurance company inspections',
                'Post-repair verification inspections',
                'Commercial electrical assessments',
                'Panel and service entrance evaluations',
                'GFCI and AFCI compliance checks',
                'Grounding system inspections',
                'Load calculation and capacity analysis'
            ],
            pricing: 'Fixed-rate inspections • Same-day reports • Re-inspection discounts'
        }
    };
    
    // Add click listeners to service cards
    const serviceCardsModal = document.querySelectorAll('.service-card');
    serviceCardsModal.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const serviceTitle = this.querySelector('h3').textContent;
            const serviceData = serviceDetails[serviceTitle];
            
            if (serviceData) {
                openServiceModal(serviceData);
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px)';
        });
    });
    
    function openServiceModal(serviceData) {
        modalTitle.textContent = serviceData.title;
        
        // Build modal content
        let contentHTML = `
            <p>${serviceData.description}</p>
            
            <h4>Key Features</h4>
            <div class="service-features">
                ${serviceData.features.map(feature => `
                    <div class="service-feature">
                        <h5>${feature.title}</h5>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
            
            <h4>Our Services Include</h4>
            <ul>
                ${serviceData.services.map(service => `<li>${service}</li>`).join('')}
            </ul>
            
            <div class="service-pricing">
                <h5>Pricing & Information</h5>
                <p>${serviceData.pricing}</p>
            </div>
            
            <div class="service-cta">
                <a href="#booking" class="btn btn-primary" onclick="closeServiceModal()">Get Free Quote</a>
                <a href="tel:555-123-4567" class="btn btn-secondary">Call Now</a>
            </div>
        `;
        
        modalContent.innerHTML = contentHTML;
        
        // Show modal
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        modalClose.focus();
    }
    
    function closeServiceModal() {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Scroll modal content back to top for next use
        setTimeout(() => {
            const modalBody = document.querySelector('.service-modal-body');
            if (modalBody) {
                modalBody.scrollTop = 0;
            }
        }, 300);
    }
    
    // Modal close events
    if (modalClose) {
        modalClose.addEventListener('click', closeServiceModal);
    }
    
    // Close on overlay click
    if (serviceModal) {
        serviceModal.addEventListener('click', function(e) {
            if (e.target === serviceModal || e.target.classList.contains('service-modal-overlay')) {
                closeServiceModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            closeServiceModal();
        }
    });
    
    // Prevent body scroll when modal is open
    serviceModal.addEventListener('wheel', function(e) {
        e.stopPropagation();
    });
    
    // Make closeServiceModal globally accessible
    window.closeServiceModal = closeServiceModal;
    
});

// Add CSS for mobile navigation
const mobileNavCSS = `
/* Force hamburger visibility on all screens for testing */
.hamburger {
    display: flex !important;
    flex-direction: column;
    cursor: pointer;
    gap: 4px;
    padding: 10px;
    z-index: 1001;
    background: transparent;
    border: none;
    position: relative;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background-color: var(--text-dark);
    transition: all 0.3s ease;
    display: block;
}

@media (max-width: 768px) {
    .nav-menu {
        position: fixed !important;
        left: -100% !important;
        top: 70px !important;
        flex-direction: column !important;
        background-color: white !important;
        width: 100% !important;
        text-align: center !important;
        transition: left 0.3s ease-in-out !important;
        box-shadow: 0 10px 27px rgba(0, 0, 0, 0.15) !important;
        padding: 2rem 0 !important;
        z-index: 999 !important;
        max-height: calc(100vh - 70px) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        display: flex !important;
    }
    
    .nav-menu.active {
        left: 0 !important;
        transform: translateX(0) !important;
    }
    
    .nav-menu li {
        margin: 0.5rem 0 !important;
        list-style: none !important;
    }
    
    .nav-link {
        padding: 1rem 2rem !important;
        border-radius: 8px !important;
        margin: 0 1rem !important;
        transition: all 0.3s ease !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-decoration: none !important;
        color: var(--text-dark) !important;
    }
    
    .nav-link:hover {
        background-color: #f5f5f5 !important;
    }
    
    .nav-link.active {
        color: var(--text-dark) !important;
        font-weight: 600 !important;
    }
    
    .btn-book-now {
        margin: 1rem !important;
        width: calc(100% - 2rem) !important;
        max-width: 280px !important;
        background-color: var(--text-dark) !important;
        color: var(--text-white) !important;
    }
    
    .hamburger {
        display: flex !important;
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }
    
    .hamburger.active span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }
}

@media (min-width: 769px) {
    .hamburger {
        display: none !important;
    }
    
    .nav-menu {
        position: static !important;
        left: auto !important;
        top: auto !important;
        flex-direction: row !important;
        background-color: transparent !important;
        width: auto !important;
        text-align: left !important;
        transition: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        z-index: auto !important;
        max-height: none !important;
        overflow-y: visible !important;
        display: flex !important;
    }
}

/* Prevent body scroll when mobile menu is open */
body.menu-open {
    overflow: hidden !important;
    position: fixed !important;
    width: 100% !important;
}
`;

// Inject mobile navigation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileNavCSS;
document.head.appendChild(styleSheet); 
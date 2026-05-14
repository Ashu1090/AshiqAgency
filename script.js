/* script.js - Secure & Optimized */
(function() {
    'use strict';
    
    // ============================================
    // 📍 CONFIGURATION - UPDATE THESE VALUES
    // ============================================
    const CONFIG = {
        // WhatsApp Number (10 digits without country code)
        WHATSAPP_NUMBER: '9087897955',
        
        // Google Sheets Web App URL (for form submissions)
        GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
        
        // Demo Website URL
        DEMO_WEBSITE_URL: 'https://royal-cafe.pages.dev/',
        
        // Social Media Links
        INSTAGRAM_URL: 'https://instagram.com/ashiqagency',
        LINKEDIN_URL: 'https://linkedin.com/company/ashiq-agency',
        
        // Email (optional - for contact)
        CONTACT_EMAIL: 'ashiqagency@gmail.com'
    };
    
    // ============================================
    // SECURITY: Prevent XSS and injection attacks
    // ============================================
    function sanitizeInput(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Escape HTML special characters
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navLinksDiv = document.getElementById('navLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinksDiv.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navLinksDiv) navLinksDiv.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinksDiv && navLinksDiv.classList.contains('active')) {
            if (!navLinksDiv.contains(event.target) && !hamburger.contains(event.target)) {
                navLinksDiv.classList.remove('active');
            }
        }
    });
    
    // ============================================
    // WHATSAPP FUNCTION (Secure)
    // ============================================
    function openWhatsApp(customMessage) {
        const message = customMessage || encodeURIComponent("Hi Ashiq Agency, I'm interested in your QR cards and website solutions.");
        const url = `https://wa.me/91${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
        window.open(url, '_blank');
    }
    
    // Attach WhatsApp event listeners
    const whatsappFloat = document.getElementById('whatsappFloat');
    const orderWhatsappHero = document.getElementById('orderWhatsappHero');
    const orderNavBtn = document.getElementById('orderNavBtn');
    const whatsappFooterLink = document.getElementById('whatsappFooterLink');
    const footerPhone = document.getElementById('footerPhone');
    
    if (whatsappFloat) whatsappFloat.addEventListener('click', function() { openWhatsApp(); });
    if (orderWhatsappHero) orderWhatsappHero.addEventListener('click', function() { openWhatsApp(); });
    if (orderNavBtn) orderNavBtn.addEventListener('click', function(e) { e.preventDefault(); openWhatsApp(); });
    if (whatsappFooterLink) whatsappFooterLink.addEventListener('click', function(e) { e.preventDefault(); openWhatsApp(); });
    if (footerPhone) footerPhone.addEventListener('click', function(e) { e.preventDefault(); openWhatsApp(); });
    
    // ============================================
    // DEMO REDIRECTS
    // ============================================
    function openDemo() {
        window.open(CONFIG.DEMO_WEBSITE_URL, '_blank');
    }
    
    const redirectDemoBtn = document.getElementById('redirectDemoBtn');
    const tryLiveDemoBtn = document.getElementById('tryLiveDemoBtn');
    const websiteDemoBtn = document.getElementById('websiteDemoBtn');
    
    if (redirectDemoBtn) redirectDemoBtn.addEventListener('click', openDemo);
    if (tryLiveDemoBtn) tryLiveDemoBtn.addEventListener('click', openDemo);
    if (websiteDemoBtn) websiteDemoBtn.addEventListener('click', openDemo);
    
    // ============================================
    // PRICING BUTTONS SCROLL TO CONTACT
    // ============================================
    const pricingBtns = document.querySelectorAll('.pricing-card-btn');
    pricingBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // ============================================
    // FORM SUBMISSION (Secure with CSRF protection)
    // ============================================
    const form = document.getElementById('leadForm');
    const feedbackDiv = document.getElementById('formFeedback');
    
    // Generate CSRF token (simple implementation)
    let csrfToken = '';
    function generateCSRFToken() {
        csrfToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('csrfToken', csrfToken);
        return csrfToken;
    }
    
    if (form) {
        // Add timestamp field
        const timestampField = document.getElementById('timestamp');
        if (timestampField) {
            timestampField.value = new Date().toISOString();
        }
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values and sanitize
            const name = sanitizeInput(document.getElementById('name').value.trim());
            const businessName = sanitizeInput(document.getElementById('businessName').value.trim());
            const phone = sanitizeInput(document.getElementById('phone').value.trim());
            const plan = sanitizeInput(document.getElementById('planSelect').value);
            const message = sanitizeInput(document.getElementById('message').value.trim());
            
            // Validation
            if (!name || !businessName || !phone || !plan || !message) {
                if (feedbackDiv) {
                    feedbackDiv.innerHTML = '<div class="error-message">⚠️ Please fill all fields</div>';
                }
                return;
            }
            
            // Phone validation (10 digits)
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                if (feedbackDiv) {
                    feedbackDiv.innerHTML = '<div class="error-message">⚠️ Please enter a valid 10-digit phone number</div>';
                }
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";
            
            // Prepare form data
            const formData = {
                name: escapeHtml(name),
                businessName: escapeHtml(businessName),
                phone: phone,
                plan: escapeHtml(plan),
                message: escapeHtml(message),
                timestamp: new Date().toISOString(),
                source: 'website',
                csrf: generateCSRFToken()
            };
            
            try {
                // Send to Google Sheets
                const response = await fetch(CONFIG.GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData)
                });
                
                // Also send WhatsApp notification (optional)
                const waMessage = encodeURIComponent(`New Lead:\nName: ${name}\nBusiness: ${businessName}\nPhone: ${phone}\nPlan: ${plan}\nMessage: ${message}`);
                fetch(`https://wa.me/91${CONFIG.WHATSAPP_NUMBER}?text=${waMessage}`, { mode: 'no-cors' });
                
                if (feedbackDiv) {
                    feedbackDiv.innerHTML = '<div class="success-message">✅ Request sent successfully! We\'ll contact you within 24 hours.</div>';
                }
                form.reset();
                
                // Reset timestamp
                if (timestampField) {
                    timestampField.value = new Date().toISOString();
                }
                
            } catch (err) {
                console.error('Form submission error:', err);
                if (feedbackDiv) {
                    feedbackDiv.innerHTML = '<div class="error-message">⚠️ Network error. Please try again or contact us on WhatsApp.</div>';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                
                // Clear feedback after 5 seconds
                setTimeout(function() {
                    if (feedbackDiv) feedbackDiv.innerHTML = '';
                }, 5000);
            }
        });
    }
    
    // ============================================
    // SOCIAL MEDIA LINKS (Secure with noopener)
    // ============================================
    const instagramLink = document.getElementById('instagramLink');
    if (instagramLink) {
        instagramLink.setAttribute('href', CONFIG.INSTAGRAM_URL);
        instagramLink.setAttribute('target', '_blank');
        instagramLink.setAttribute('rel', 'noopener noreferrer');
    }
    
    // ============================================
    // SMOOTH SCROLLING (Prevent default hijacking)
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // ============================================
    // LAZY LOADING IMAGES (Performance)
    // ============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // CONSOLE LOG PROTECTION (Security)
    // ============================================
    if (typeof window.console !== "undefined") {
        const originalConsoleLog = console.log;
        console.log = function() {
            if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
                return;
            }
            originalConsoleLog.apply(console, arguments);
        };
    }
    
    console.log('Ashiq Agency website loaded securely');
})();
/* script.js - QR Menu Portfolio */

// ================================================
// 📍 GOOGLE SHEETS APPS SCRIPT URL (YOUR WEB APP URL)
// ================================================
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwPYGPE55CCCqX-kD8MnSoX_BXXi1lPPLB-V6s6E05CmP2OE2vtySZZ6H3sVRA2zIwF/exec";

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinksDiv = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinksDiv.classList.toggle('active');
  });
}

document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    navLinksDiv.classList.remove('active');
  });
});

// WhatsApp functions
function openWhatsApp() {
  const phoneSpan = document.getElementById('contactPhone');
  let phone = phoneSpan ? phoneSpan.innerText.trim() : "+91 7092781069";
  let raw = phone.replace(/[^0-9]/g, '');
  if (!raw.startsWith('91')) raw = '91' + raw;
  const msg = encodeURIComponent("Hi, I want a QR card/website from Ashiq Agency");
  window.open(`https://wa.me/${raw}?text=${msg}`, '_blank');
}

// Attach WhatsApp event listeners
const whatsappFloat = document.getElementById('whatsappFloat');
const orderWhatsappHero = document.getElementById('orderWhatsappHero');
const orderNavBtn = document.getElementById('orderNavBtn');
const whatsappFooterLink = document.getElementById('whatsappFooterLink');

if (whatsappFloat) whatsappFloat.addEventListener('click', openWhatsApp);
if (orderWhatsappHero) orderWhatsappHero.addEventListener('click', openWhatsApp);
if (orderNavBtn) orderNavBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openWhatsApp();
});
if (whatsappFooterLink) whatsappFooterLink.addEventListener('click', (e) => {
  e.preventDefault();
  openWhatsApp();
});

// Demo redirect
const redirectDemoBtn = document.getElementById('redirectDemoBtn');
const tryLiveDemoBtn = document.getElementById('tryLiveDemoBtn');

const demoHandler = () => {
  window.open('https://royal-cafe.pages.dev/', '_blank');
};

if (redirectDemoBtn) redirectDemoBtn.addEventListener('click', demoHandler);
if (tryLiveDemoBtn) tryLiveDemoBtn.addEventListener('click', demoHandler);

// Pricing buttons scroll to contact
const pricingBtns = document.querySelectorAll('.pricing-card-btn');
pricingBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ================================================
// FORM SUBMISSION TO GOOGLE SHEETS
// ================================================
async function submitToGoogleSheets(formData) {
  try {
    const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData)
    });
    
    // With no-cors mode, we can't read the response, but the request is sent
    // The data will be received by your Google Apps Script
    return { success: true, message: "✅ Request sent successfully! We'll contact you soon." };
    
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, message: "Network error. Please try again or contact us directly on WhatsApp." };
  }
}

// Form submission handler
const form = document.getElementById('leadForm');
const feedbackDiv = document.getElementById('formFeedback');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const businessName = document.getElementById('businessName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const plan = document.getElementById('planSelect').value;
    const message = document.getElementById('message').value.trim();
    
    if (!name || !businessName || !phone || !plan || !message) {
      feedbackDiv.innerHTML = '<div class="success-message" style="background:#f8d7da; color:#b3413b;">⚠️ Please fill all fields</div>';
      return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    
    const formData = {
      name: name,
      businessName: businessName,
      phone: phone,
      plan: plan,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    const result = await submitToGoogleSheets(formData);
    
    if (result.success) {
      feedbackDiv.innerHTML = `<div class="success-message">🎉 ${result.message}</div>`;
      form.reset();
    } else {
      feedbackDiv.innerHTML = `<div class="success-message" style="background:#fff0e0; color:#c95a0e;">⚠️ ${result.message}</div>`;
    }
    
    submitBtn.disabled = false;
    submitBtn.innerText = "Send Request ✨";
    
    setTimeout(() => {
      feedbackDiv.innerHTML = '';
    }, 5000);
  });
}

// Social links - Instagram, LinkedIn, WhatsApp
const instagramLink = document.getElementById('instagramLink');
const linkedinLink = document.getElementById('linkedinLink');

// Update these URLs with your actual social media profile links
if (instagramLink) instagramLink.setAttribute('href', 'https://instagram.com/ashiqagency');
if (linkedinLink) linkedinLink.setAttribute('href', 'https://linkedin.com/company/ashiq-agency');

// Editable phone number with localStorage
const contactPhone = document.getElementById('contactPhone');
if (contactPhone) {
  contactPhone.setAttribute('contenteditable', 'true');
  contactPhone.addEventListener('blur', function() {
    localStorage.setItem('agencyPhone', this.innerText);
  });
  
  const savedPhone = localStorage.getItem('agencyPhone');
  if (savedPhone) {
    contactPhone.innerText = savedPhone;
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
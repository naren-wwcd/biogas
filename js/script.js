// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
});

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const formInputs = {
        name: form.querySelector('input[placeholder="Full Name"]').value,
        email: form.querySelector('input[placeholder="Email Address"]').value,
        phone: form.querySelector('input[placeholder="Phone Number"]').value,
        company: form.querySelector('input[placeholder="Company Name"]').value,
        message: form.querySelector('textarea[placeholder="Message"]').value
    };

    // Validate form
    if (!formInputs.name || !formInputs.email || !formInputs.phone || !formInputs.message) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formInputs.email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Show success message
    showAlert('Thank you! Your message has been sent successfully.', 'success');
    form.reset();
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 22px;
        background: ${type === 'success' ? 'linear-gradient(135deg,#0088ff,#0057c7)' : 'linear-gradient(135deg,#e74c3c,#c0392b)'};
        color: white;
        border-radius: 10px;
        border: 1px solid ${type === 'success' ? 'rgba(0,212,255,0.3)' : 'rgba(231,76,60,0.5)'};
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        z-index: 10000;
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.product-card, .project-card, .impact-item, .benefit-card, .stat-box').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Add active state to navigation on scroll
window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .nav-link.active {
        color: #00d4ff !important;
        background: rgba(0,212,255,0.08);
        border-radius: 6px;
    }

    .alert {
        max-width: 400px;
    }

    @media (max-width: 480px) {
        .alert {
            left: 10px;
            right: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

console.log('Phenix website initialized successfully');

// ==========================================
// Product Modal Functions
// ==========================================
function openModal(productKey) {
    const overlay = document.getElementById('modal-' + productKey);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close on Escape key
    document.addEventListener('keydown', handleEscKey);
}

function closeModal(productKey) {
    const overlay = document.getElementById('modal-' + productKey);
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        // Close any open modal
        ['biogas', 'owc', 'biocng', 'waste'].forEach(key => {
            const overlay = document.getElementById('modal-' + key);
            if (overlay && overlay.classList.contains('active')) {
                closeModal(key);
            }
        });
    }
}
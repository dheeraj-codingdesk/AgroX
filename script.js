// ===== Navigation Toggle =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== Scroll to Top Button =====
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Form Validation & Submission =====
const subscribeForm = document.getElementById('subscribeForm');
const successMessage = document.getElementById('successMessage');
const closeSuccess = document.getElementById('closeSuccess');

if (subscribeForm) {
    // Phone number validation regex
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    
    // Location coordinates validation regex (latitude, longitude format)
    const locationRegex = /^-?\d+\.?\d*\s*[°]?\s*[NS]?,\s*-?\d+\.?\d*\s*[°]?\s*[EW]?$/i;

    // Get form elements
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const locationInput = document.getElementById('location');
    const consentInput = document.getElementById('consent');
    
    // Get error message elements
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const locationError = document.getElementById('locationError');
    const consentError = document.getElementById('consentError');

    // Validate name
    function validateName(name) {
        if (name.trim().length < 3) {
            return 'Name must be at least 3 characters long';
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return 'Name should only contain letters and spaces';
        }
        return '';
    }

    // Validate phone
    function validatePhone(phone) {
        if (!phoneRegex.test(phone)) {
            return 'Please enter a valid phone number (e.g., +1234567890 or 123-456-7890)';
        }
        return '';
    }

    // Validate location
    function validateLocation(location) {
        if (!locationRegex.test(location.trim())) {
            return 'Please enter valid coordinates (e.g., 28.7041° N, 77.1025° E)';
        }
        return '';
    }

    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            const error = validateName(nameInput.value);
            nameError.textContent = error;
            if (error) {
                nameInput.style.borderColor = '#e74c3c';
            } else {
                nameInput.style.borderColor = '#2ecc71';
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            const error = validatePhone(phoneInput.value);
            phoneError.textContent = error;
            if (error) {
                phoneInput.style.borderColor = '#e74c3c';
            } else {
                phoneInput.style.borderColor = '#2ecc71';
            }
        });
    }

    if (locationInput) {
        locationInput.addEventListener('blur', () => {
            const error = validateLocation(locationInput.value);
            locationError.textContent = error;
            if (error) {
                locationInput.style.borderColor = '#e74c3c';
            } else {
                locationInput.style.borderColor = '#2ecc71';
            }
        });
    }

    // Handle checkbox validation
    if (consentInput) {
        consentInput.addEventListener('change', () => {
            if (consentInput.checked) {
                consentError.textContent = '';
            }
        });
    }

    // Form submission
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const location = locationInput.value.trim();
        const consent = consentInput.checked;

        // Validate all fields
        let isValid = true;
        
        const nameErr = validateName(name);
        if (nameErr) {
            nameError.textContent = nameErr;
            nameInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            nameError.textContent = '';
            nameInput.style.borderColor = '#2ecc71';
        }

        const phoneErr = validatePhone(phone);
        if (phoneErr) {
            phoneError.textContent = phoneErr;
            phoneInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            phoneError.textContent = '';
            phoneInput.style.borderColor = '#2ecc71';
        }

        const locationErr = validateLocation(location);
        if (locationErr) {
            locationError.textContent = locationErr;
            locationInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            locationError.textContent = '';
            locationInput.style.borderColor = '#2ecc71';
        }

        if (!consent) {
            consentError.textContent = 'You must agree to receive alerts to subscribe';
            isValid = false;
        } else {
            consentError.textContent = '';
        }

        // If valid, show success message
        if (isValid) {
            // Log form data to console for demonstration
            console.log('Subscription Data:', {
                name: name,
                phone: phone,
                location: location,
                consent: consent,
                timestamp: new Date().toISOString()
            });

            // Show success popup
            if (successMessage) {
                successMessage.classList.add('show');
                
                // Reset form
                subscribeForm.reset();
                
                // Reset error messages
                nameError.textContent = '';
                phoneError.textContent = '';
                locationError.textContent = '';
                consentError.textContent = '';
                
                // Reset border colors
                if (nameInput) nameInput.style.borderColor = '#e0e0e0';
                if (phoneInput) phoneInput.style.borderColor = '#e0e0e0';
                if (locationInput) locationInput.style.borderColor = '#e0e0e0';
            }
        }
    });
}

// Close success message
if (closeSuccess) {
    closeSuccess.addEventListener('click', () => {
        if (successMessage) {
            successMessage.classList.remove('show');
        }
    });
}

// Close success message when clicking outside
if (successMessage) {
    successMessage.addEventListener('click', (e) => {
        if (e.target === successMessage) {
            successMessage.classList.remove('show');
        }
    });
}

// ===== Smooth Animations on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .data-card, .feature-item, .info-box');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
});

// ===== Add Loading Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Login Form Handling =====
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            return;
        }
        
        if (password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
            return;
        }
        
        // Log login attempt
        console.log('Login attempt:', { email, timestamp: new Date().toISOString() });
        
        // Success - redirect to features or show success message
        alert('Login successful! Welcome to AgroX.');
        loginForm.reset();
    });
}

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');
const contactSuccessMessage = document.getElementById('successMessage');
const closeContactSuccess = document.getElementById('closeSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form inputs
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const consent = document.getElementById('consent');
        
        // Get error elements
        const firstNameError = document.getElementById('firstNameError');
        const lastNameError = document.getElementById('lastNameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');
        const consentError = document.getElementById('consentError');
        
        // Reset errors
        const errors = [firstNameError, lastNameError, emailError, phoneError, subjectError, messageError, consentError];
        errors.forEach(err => {
            if (err) err.textContent = '';
        });
        
        // Validation
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        
        // Validate firstName
        if (!firstName.value.trim()) {
            firstNameError.textContent = 'First name is required';
            isValid = false;
        }
        
        // Validate lastName
        if (!lastName.value.trim()) {
            lastNameError.textContent = 'Last name is required';
            isValid = false;
        }
        
        // Validate email
        if (!emailRegex.test(email.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate phone
        if (!phoneRegex.test(phone.value)) {
            phoneError.textContent = 'Please enter a valid phone number';
            isValid = false;
        }
        
        // Validate subject
        if (!subject.value) {
            subjectError.textContent = 'Please select a subject';
            isValid = false;
        }
        
        // Validate message
        if (message.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            isValid = false;
        }
        
        // Validate consent
        if (!consent.checked) {
            consentError.textContent = 'You must agree to the terms';
            isValid = false;
        }
        
        // If valid, show success
        if (isValid) {
            console.log('Contact Form Data:', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                subject: subject.value,
                message: message.value,
                timestamp: new Date().toISOString()
            });
            
            if (contactSuccessMessage) {
                contactSuccessMessage.classList.add('show');
                contactForm.reset();
            }
        }
    });
}

// Close contact success message
if (closeContactSuccess) {
    closeContactSuccess.addEventListener('click', () => {
        if (contactSuccessMessage) {
            contactSuccessMessage.classList.remove('show');
        }
    });
}

if (contactSuccessMessage) {
    contactSuccessMessage.addEventListener('click', (e) => {
        if (e.target === contactSuccessMessage) {
            contactSuccessMessage.classList.remove('show');
        }
    });
}

// ===== Console Welcome Message =====
console.log('%cWelcome to AgroX!', 'font-size: 20px; font-weight: bold; color: #2ecc71;');
console.log('%cAgroX - Smarter Farming Starts Here', 'font-size: 14px; color: #3498db;');


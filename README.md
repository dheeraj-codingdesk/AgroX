# AgroX - AI-Powered AgriTech Platform

A modern, responsive website for an AI-powered agricultural technology platform that helps farmers with real-time data, crop diagnostics, weather forecasts, and market insights.

## 🌾 Project Overview

AgroX is a multi-page responsive website built with pure HTML, CSS, and JavaScript (no frameworks or libraries). The platform serves as a landing page and marketing website for an AI-powered farming assistant designed to help farmers make smarter agricultural decisions.

## 📁 Project Structure

```
AgroX/
├── index.html          # Home page with hero section
├── features.html       # Features and key capabilities
├── data.html          # Real-time data display
├── subscribe.html     # Subscription form with validation
├── style.css          # Global styles and responsive design
├── script.js          # Interactive features and form validation
└── README.md          # This file
```

## 🎨 Key Features

### Pages

1. **Home Page (index.html)**
   - Hero section with compelling tagline
   - Three feature cards highlighting key benefits
   - Call-to-action buttons
   - Responsive navigation

2. **Features Page (features.html)**
   - Four detailed feature sections:
     - AI-driven weather and soil forecasting
     - Live climate, rainfall, and soil tracking
     - Simple charts and dashboards
     - Crop health diagnostics via image recognition
   - Detailed benefits and use cases

3. **Data Page (data.html)**
   - Real-time data cards for:
     - Crop Health
     - Soil Data
     - Weather Analytics
   - Animated hover effects
   - Sample data visualization

4. **Subscribe Page (subscribe.html)**
   - Complete subscription form
   - Form validation (name, phone, location)
   - Success popup with JavaScript
   - Benefits sidebar

### Design Elements

- **Color Scheme**: Green and sky-blue tones representing agriculture and technology
- **Typography**: Modern, bold typography for headlines
- **Animations**: Smooth transitions, hover effects, and scroll animations
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Fixed Navigation**: Sticky navbar with active page highlighting
- **Smooth Scrolling**: Back-to-top button and smooth page transitions

### JavaScript Features

- **Form Validation**:
  - Name: Minimum 3 characters, letters only
  - Phone: International format validation
  - Location: Coordinate format validation
  - Consent checkbox validation
  
- **Interactive Elements**:
  - Mobile hamburger menu
  - Scroll-to-top button
  - Success popup modal
  - Smooth scroll animations on page load
  - Intersection Observer for scroll-triggered animations

## 🚀 Getting Started

### Prerequisites

No special requirements! Just a modern web browser.

### Running the Website

1. Open `index.html` in your web browser
   - Double-click the file, or
   - Right-click → "Open with" → Choose your browser

2. Navigate through the pages using the navigation bar

3. Test the subscription form on the Subscribe page

### Local Development

For better development experience, you can use a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server installed)
npx http-server

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Target Audience

- **Primary**: Farmers and agricultural professionals
- **Secondary**: Investors and tech enthusiasts
- **Tertiary**: Agricultural researchers and students

## 💡 Key Selling Points

1. **AI-Powered Predictions**: Leverage machine learning for accurate agricultural forecasting
2. **Real-Time Monitoring**: 24/7 tracking of environmental and crop conditions
3. **User-Friendly Interface**: Simple dashboards for farmers of all tech levels
4. **Smart Diagnostics**: Image recognition for crop health analysis

## 🔧 Technical Details

- **No External Dependencies**: Pure HTML, CSS, and JavaScript
- **No Build Process Required**: Open and run directly
- **Fully Responsive**: Mobile-first design approach
- **Modern CSS**: CSS Grid, Flexbox, Custom Properties (CSS Variables)
- **ES6+ JavaScript**: Arrow functions, destructuring, async operations
- **Accessibility**: Semantic HTML, proper form labels, ARIA attributes

## 📝 Form Validation

The subscription form includes:

1. **Name Field**: Validates minimum length and allows only letters and spaces
2. **Phone Field**: Validates international phone formats
3. **Location Field**: Validates coordinate format (latitude, longitude)
4. **Consent Checkbox**: Ensures user agreement for alerts

All validation happens in real-time with user-friendly error messages.

## 🎨 Customization

To customize colors, edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #2ecc71;    /* Green */
    --secondary-color: #3498db;  /* Blue */
    --accent-color: #16a085;     /* Dark teal */
    --dark-color: #27ae60;       /* Dark green */
    /* ... */
}
```

## 📄 License

© 2025 AgroX. All rights reserved.

## 🤝 Contributing

This is a demonstration project built for educational and hackathon purposes.

---

**Built with ❤️ for smarter farming**


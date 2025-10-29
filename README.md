# AgroX - AI-Powered AgriTech Platform

A modern, responsive website for an AI-powered agricultural technology platform that helps farmers with real-time data, crop diagnostics, weather forecasts, and market insights.

# Project Overview: AgroX AI - The Smart Farming Companion

### 1. Project Vision

To empower farmers with accessible, data-driven, and timely agricultural intelligence, transforming traditional farming practices into a more efficient, sustainable, and profitable endeavour through the seamless integration of AI, computer vision, and real-time data analytics.

### 2. Executive Summary

AgriSight AI is a comprehensive, multi-faceted digital platform designed to serve as an all-in-one assistant for the modern farmer. By simply taking a photo of a crop, farmers can instantly receive a detailed analysis covering crop identification, growth stage, and a precise health score. The platform's diagnostic engine can pinpoint specific diseases or nutrient deficiencies.

By integrating external soil and weather data, AgriSight AI moves beyond simple diagnostics to provide a holistic farm management solution. It delivers personalized, forward-looking recommendations for irrigation, fertilization, and pest control. Furthermore, it assists in crucial business decisions by suggesting optimal harvest times and post-harvest strategies (store vs. sell) based on market analytics. The platform closes the agricultural cycle by recommending the most suitable subsequent crop, ensuring long-term soil health and profitability.

To maximize accessibility, the platform features an AI-powered voice assistant, allowing farmers to get expert advice in their local language over a simple phone call. A proactive SMS notification system ensures farmers never miss critical updates, from weather alerts to market opportunities, making smart farming accessible to everyone.

### 3. Core Modules & Key Features

**Module 1: Image-Based Crop Analysis Engine**
* **Crop Identification:** Utilizes a computer vision model to accurately identify the crop species from an image.
* **Growth Stage Monitoring:** Determines the current phenological stage of the crop (e.g., germination, vegetative, flowering, maturity).
* **Plant Health Score:** Provides a quantifiable score (0-100%) indicating the overall health of the plant.
* **Automated Diagnostics:**
    * **Disease & Pest Detection:** Identifies common diseases and pests affecting the plant with high accuracy.
    * **Nutrient & Water Deficiency Analysis:** Detects visual symptoms of deficiencies (e.g., nitrogen, phosphorus, potassium) or water stress.

**Module 2: Integrated Data & Recommendation Hub**
* **Soil Data Integration:** Connects with external APIs to fetch real-time soil moisture levels, pH, nutrient content, and overall soil health metrics.
* **Weather Forecast Integration:** Aggregates short-term and long-term weather data (temperature, precipitation, humidity, wind speed).
* **Personalized Recommendation Engine:** Synthesizes all data points (image analysis, soil, weather) to provide actionable advice on:
    * **Irrigation Management:** Recommends when and how much to water.
    * **Fertilizer Application:** Suggests the right type and quantity of fertilizers needed.
    * **Pest & Disease Treatment:** Proposes specific and sustainable treatment plans.
    * **Time-Based Farming Calendar:** Generates a schedule of recommended actions for the upcoming week or month based on forecasts.

**Module 3: Harvest & Market Intelligence**
* **Optimal Harvest Prediction:** Recommends the best time to harvest based on growth stage analysis and weather forecasts to maximize yield and quality.
* **Post-Harvest Strategy:** Analyzes current market prices, seasonal trends, and storage costs to advise whether to sell the produce immediately or store it for a better price.

**Module 4: Future Crop Planning**
* **Crop Rotation Suggester:** Recommends the next crop to plant based on soil health restoration needs, seasonal viability, weather outlook, and market demand to ensure sustainable and profitable farming cycles.

**Module 5: Accessibility & Communication**
* **AI-Powered Voice Assistant:**
    * A dedicated phone number for farmers to call.
    * Natural Language Processing (NLP) to understand queries in multiple local languages.
    * Provides instant, audible answers and guidance on all platform features.
* **Proactive Notification System:**
    * Sends automated SMS alerts for critical events.
    * **Alert Categories:** Impending rain, heavy rainfall/cyclone warnings, irrigation reminders, optimal fertilization times, and high-value market opportunities.

### 4. Target Audience

* Small to medium-scale farmers seeking to improve efficiency and yield.
* Large agricultural corporations for monitoring and managing multiple farmsteads.
* Agricultural consultants and agronomists.
* Farming cooperatives and government agricultural agencies.

### 5. Value Proposition

* **Holistic Decision-Making:** Provides a 360-degree view of farm health, from a single plant to market dynamics.
* **Increased Accessibility:** Overcomes literacy and technology barriers through a simple interface and a multi-lingual voice assistant.
* **Reduced Risk & Uncertainty:** Proactive alerts and predictive analytics help farmers mitigate risks from adverse weather and disease outbreaks.
* **Enhanced Profitability & Sustainability:** Optimizes resource usage (water, fertilizer), increases crop yield, and improves market returns while promoting sustainable practices like crop rotation.

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



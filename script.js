/**
 * ============================================================================
 * DadCyberTips Website - Interactive Script
 * ============================================================================
 * 
 * OVERALL ARCHITECTURE:
 * --------------------
 * This script manages the DadCyberTips website including:
 * - Interactive security assessment quiz
 * - Contact form with centralized Notion integration
 * - E-commerce integration (Payhip & Fourthwall)
 * - Event tracking and analytics
 * 
 * DATA FLOW:
 * ----------
 * Submissions are sent to Notion (via Make.com webhooks), one webhook per type:
 * - Quiz results (email, score, level, source: "Quiz")
 *     -> https://hook.us2.make.com/bsksqjoatho6opxrxhmzpj5t5jmc5dgi
 * - Contact form (name, email, phone, organization, category, comments, source: "Contact Form")
 *     -> https://hook.us2.make.com/ojmt2rjmx8lhejmt1o9n8nfiwjz4vsml
 *   The services page form uses the same contact webhook with source: "Services Contact Form".
 * Nothing is stored in the visitor's browser.
 * 
 * KEY FUNCTIONS:
 * - calculateAndShowResults() → Quiz scoring & Notion submission
 * - addMarketingContact() → Contact form & Notion submission
 * - scrollToContactForm() → Navigate to centralized contact form
 * 
 * ============================================================================
 */

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles dynamically (Retro Neon)
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 700;
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
                border: 3px solid;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'Courier New', monospace;
            }
            
            .notification-success {
                background: rgba(57, 255, 20, 0.15);
                color: #39FF14;
                border-color: #39FF14;
                box-shadow: 0 0 20px #39FF14, inset 0 0 20px rgba(57, 255, 20, 0.1);
            }
            
            .notification-error {
                background: rgba(255, 0, 110, 0.15);
                color: #FF006E;
                border-color: #FF006E;
                box-shadow: 0 0 20px #FF006E, inset 0 0 20px rgba(255, 0, 110, 0.1);
            }
            
            .notification-info {
                background: rgba(0, 240, 255, 0.15);
                color: #00F0FF;
                border-color: #00F0FF;
                box-shadow: 0 0 20px #00F0FF, inset 0 0 20px rgba(0, 240, 255, 0.1);
            }
            
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
            
            @media (max-width: 640px) {
                .notification {
                    left: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Track Events (for analytics)
 * Logs events for tracking user interactions
 */
function trackEvent(eventName, eventData = {}) {
    // Simple console logging
    console.log(`[Analytics] Event: ${eventName}`, eventData);
    
    // Optional: Send to Google Analytics or other analytics service
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
}

/**
 * Smooth Scroll Handler
 * Handles smooth scrolling for navigation links
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Track page view
    trackEvent('page_view', {
        page: window.location.pathname,
        timestamp: new Date().toISOString()
    });
});

/**
 * Email Validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Product Card Hover Effects
 */
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});


/**
 * Handle contact form submission
 * Captures all form fields, validates them, and sends to the Notion database
 * @param {Event} event - Form submission event
 */
function addMarketingContact(event) {
    event.preventDefault();

    // Capture all form field values
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const organization = document.getElementById('contact-organization').value.trim();
    const category = document.getElementById('contact-category').value;
    const notes = document.getElementById('contact-notes').value.trim();

    // Validate required fields
    if (!name || !email || !category) {
        showNotification('Please fill in name, email, and category', 'error');
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Prepare payload for Notion via Make.com webhook
    // Contact forms go to Contact Submissions database
    const webhookUrl = 'https://hook.us2.make.com/ojmt2rjmx8lhejmt1o9n8nfiwjz4vsml';
    const notionPayload = {
        name: name,
        email: email,
        phone: phone,
        organization: organization,
        category: category,
        source: 'Contact Form',
        comments: notes,
        timestamp: new Date().toISOString()
    };

    // Send contact to Notion database via webhook
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(notionPayload)
    }).then(response => {
        if (response.ok) {
            // Success: reset form and show confirmation
            document.getElementById('marketing-form').reset();
            showNotification(`${name} message sent`, 'success');
            trackEvent('contact_form_submitted', { category: category });
        } else {
            throw new Error('Webhook failed');
        }
    }).catch(err => {
        // Error: show failure message
        showNotification(`Failed to send ${name} message. Please try again.`, 'error');
        console.log('Contact submission error:', err);
    });
}

/**
 * Scroll to service contact form and pre-select category
 * Works on both index.html and services.html
 * @param {string} category - Service category to pre-select
 */
function scrollToServiceContact(category) {
    // Check if on main page (index.html) or services page
    const contactForm = document.getElementById('marketing') || document.getElementById('contact-services');
    
    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            // Try to find category select on either page
            const categorySelect = document.getElementById('contact-category') || document.getElementById('service-category');
            if (categorySelect) {
                categorySelect.value = category;
            }
            
            // Focus on name field
            const nameField = document.getElementById('contact-name') || document.getElementById('service-name');
            if (nameField) {
                nameField.focus();
            }
        }, 300);
    }
}


/**
 * Scroll to sections with smooth behavior
 */
// ============= INLINE QUIZ FUNCTIONALITY =============

const quizData = [
    {
        question: "How many passwords do you reuse across multiple accounts?",
        options: ["None — every password is unique", "1-2 passwords reused occasionally", "Several accounts share the same password", "Most of my passwords are identical"],
        correct: 0,
        weight: 3,
        tip: "Use a password manager to generate unique passwords for each account."
    },
    {
        question: "Which method do you primarily use to protect your online accounts?",
        options: ["Two-Factor Authentication (2FA) on all important accounts", "2FA on some accounts, mostly email and banking", "Only SMS verification or security questions", "No additional protection beyond passwords"],
        correct: 0,
        weight: 3,
        tip: "Enable authenticator apps (Google Authenticator, Authy) over SMS for 2FA."
    },
    {
        question: "How frequently do you update your operating systems and software?",
        options: ["Within 24 hours of security updates being released", "Within a week of release", "Every few months or when it's convenient", "Rarely or never — I ignore update notifications"],
        correct: 0,
        weight: 3,
        tip: "Enable automatic updates on all devices. Updates patch critical security vulnerabilities."
    },
    {
        question: "How secure is your home WiFi network?",
        options: ["WPA2/WPA3 encryption with a strong, unique password", "WPA encryption with a decent password", "WEP or shared with neighbors unsecured", "No password set — open network"],
        correct: 0,
        weight: 3,
        tip: "Change your WiFi password from default and use WPA3 if available."
    },
    {
        question: "How do you handle backups of your important data?",
        options: ["Automated daily backups to cloud storage and external device", "Weekly backups to external storage", "Occasional backups when I remember", "No regular backups — I rely on cloud services"],
        correct: 0,
        weight: 2,
        tip: "Implement 3-2-1 backup rule: 3 copies, 2 different media, 1 offsite."
    },
    {
        question: "How cautious are you about phishing emails and suspicious links?",
        options: ["Very cautious — I verify sender and never click suspicious links", "Somewhat cautious — check if it seems legitimate", "Rarely check the sender — mostly click if needed", "No — I click on anything that looks interesting"],
        correct: 0,
        weight: 2,
        tip: "Hover over links before clicking. Legitimate companies never ask for passwords via email."
    },
    {
        question: "Where do you download software from?",
        options: ["Official app stores and verified developer websites", "Official stores with occasional third-party downloads", "Random websites and sources I find online", "Torrent sites and file-sharing platforms"],
        correct: 0,
        weight: 2,
        tip: "Stick to official app stores and developer websites; verify download integrity."
    },
    {
        question: "How many connected smart devices do you have, and how are they configured?",
        options: ["Minimal devices, all updated with unique passwords and network segmentation", "Moderate number, most have changed passwords and regular updates", "Several with default settings and shared networks", "Many IoT devices with factory settings"],
        correct: 0,
        weight: 2,
        tip: "Isolate IoT devices on a separate VLAN/guest network with unique credentials."
    },
    {
        question: "How often do you review your privacy settings on social media and online accounts?",
        options: ["Quarterly or whenever major updates occur", "Annually or when prompted", "Occasionally — maybe once a year", "Never — I don't check privacy settings"],
        correct: 0,
        weight: 1,
        tip: "Audit privacy settings annually and after platform updates."
    },
    {
        question: "Do you use any browser extensions or ad blockers?",
        options: ["Yes, essential privacy extensions + uBlock Origin or similar", "Some basic ad blocking and privacy tools", "A few random extensions installed years ago", "None — I browse with default browser settings"],
        correct: 0,
        weight: 1,
        tip: "Install reputable privacy extensions: uBlock Origin, Privacy Badger, ClearURLs."
    },
    {
        question: "Have you checked if your email has been compromised in known data breaches?",
        options: ["Yes, regularly using breach monitoring services", "Yes, once or twice using HaveIBeenPwned or similar", "I've heard about it but haven't checked", "No, I'm not aware of this service"],
        correct: 0,
        weight: 1,
        tip: "Check haveibeenpwned.com and set up breach alerts for your email addresses."
    },
    {
        question: "How do you handle public WiFi networks?",
        options: ["Never use public WiFi for sensitive activities; use VPN if necessary", "Avoid sensitive tasks on public WiFi", "Use public WiFi for anything, minimal concerns", "Freely bank and shop on any public WiFi"],
        correct: 0,
        weight: 1,
        tip: "Always use a VPN on public WiFi. Avoid logging into sensitive accounts without protection."
    }
];

const levels = [
    { min: 22, max: 25, scoreMin: 9, scoreMax: 10, name: "Cyber Fortress", emoji: "🏰", 
      desc: "Elite security posture. Your digital defenses are excellent!",
      recs: ["Maintain current practices", "Stay updated on emerging threats", "Share best practices with family/friends"] },
    { min: 18, max: 21, scoreMin: 7, scoreMax: 8, name: "Fortified Home", emoji: "🔒", 
      desc: "Strong protections with minor gaps to seal.",
      recs: ["Review weak areas identified above", "Consider upgrading 2FA to authenticator apps", "Set automated backup schedules"] },
    { min: 13, max: 17, scoreMin: 5, scoreMax: 6, name: "Basic Lock", emoji: "🚪", 
      desc: "Moderate security. Several improvements needed urgently.",
      recs: ["Enable 2FA on all critical accounts immediately", "Update all device firmware and software", "Change default router credentials", "Set up regular backups"] },
    { min: 8, max: 12, scoreMin: 3, scoreMax: 4, name: "Vulnerable House", emoji: "⚠️", 
      desc: "Gaps exposed. Your digital home needs immediate attention.",
      recs: ["Start with password manager setup", "Enable WPA2/WPA3 on your router", "Install firewall software", "Begin backing up important data"] },
    { min: 0, max: 7, scoreMin: 1, scoreMax: 2, name: "Digital Door Open Wide", emoji: "🏚️", 
      desc: "Critical risk. Multiple vulnerabilities require urgent action.",
      recs: ["Change ALL passwords immediately", "Enable 2FA everywhere possible", "Run full antivirus/malware scans", "Reset router to factory and reconfigure securely"] }
];

let currentQuestionIndex = 0;
let userAnswers = null; // Will be initialized when quiz starts

// Initialize userAnswers when quizData is ready
if (typeof quizData !== 'undefined' && quizData && quizData.length > 0) {
    userAnswers = new Array(quizData.length).fill(null);
}

function initializeQuiz() {
    // Initialize userAnswers if not already done
    if (!userAnswers || userAnswers.length !== quizData.length) {
        userAnswers = new Array(quizData.length).fill(null);
    }
    
    // Reset quiz state
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    
    // Reset display
    const emailSection = document.getElementById('email-section');
    const resultSection = document.getElementById('result-section');
    
    if (emailSection) emailSection.style.display = 'none';
    if (resultSection) resultSection.style.display = 'none';
    
    // Set question counts
    const totalQEl = document.getElementById('total-questions');
    if (totalQEl) {
        totalQEl.textContent = quizData.length;
    } else {
        console.error('❌ total-questions element not found');
    }
    
    const currentQEl = document.getElementById('current-question');
    if (currentQEl) {
        currentQEl.textContent = '1';
    }
    
    const progressEl = document.getElementById('progress-text');
    if (progressEl) {
        progressEl.textContent = `1/${quizData.length}`;
    }
    
    // Display first question
    displayQuestion();
}

function displayQuestion() {
    if (!quizData || quizData.length === 0) {
        return;
    }
    
    const q = quizData[currentQuestionIndex];
    
    // Update progress
    const currentQEl = document.getElementById('current-question');
    if (currentQEl) currentQEl.textContent = currentQuestionIndex + 1;
    
    const progressTxt = document.getElementById('progress-text');
    if (progressTxt) progressTxt.textContent = `${currentQuestionIndex + 1}/${quizData.length}`;
    
    const progressBar = document.getElementById('progress');
    if (progressBar) {
        const pct = ((currentQuestionIndex + 1) / quizData.length) * 100;
        progressBar.style.width = pct + '%';
    }
    
    // Update question text
    const qTextEl = document.getElementById('question-text');
    if (qTextEl) {
        qTextEl.textContent = q.question;
    }
    
    // Generate options
    const optionsHTML = q.options.map((opt, i) => `
        <label style="display: flex; align-items: center; padding: 12px 16px; margin: 10px 0; cursor: pointer; border-radius: 4px; border: 2px solid var(--text-secondary); background: transparent; transition: all 0.3s ease; color: var(--text-secondary);">
            <input type="radio" name="answer" value="${i}" ${userAnswers[currentQuestionIndex] === i ? 'checked' : ''} onchange="recordAnswer(${i})" style="margin-right: 12px; cursor: pointer; accent-color: var(--neon-cyan); width: 18px; height: 18px;">
            <span>${opt}</span>
        </label>
    `).join('');
    
    const optionsEl = document.getElementById('options-container');
    if (optionsEl) {
        optionsEl.innerHTML = optionsHTML;
    }
    
    // Update tip
    const tipEl = document.getElementById('tip');
    if (tipEl) {
        tipEl.textContent = '💡 ' + q.tip;
    }
    
    // Update button states
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (backBtn) {
        backBtn.disabled = currentQuestionIndex === 0;
        backBtn.style.opacity = currentQuestionIndex === 0 ? '0.3' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
        nextBtn.style.opacity = userAnswers[currentQuestionIndex] === null ? '0.3' : '1';
    }
}

function recordAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    document.getElementById('next-btn').disabled = false;
    document.getElementById('next-btn').style.opacity = '1';
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Show email input section
        document.getElementById('email-section').style.display = 'block';
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function goBackToQuiz() {
    currentQuestionIndex = quizData.length - 1; // Go to last question
    document.getElementById('email-section').style.display = 'none';
    displayQuestion();
}

/**
 * Calculate quiz score and display results
 * Validates email, calculates weighted score, determines security level, and sends to Notion
 */
function calculateAndShowResults() {
    // Get and validate email
    const email = document.getElementById('email-input').value;
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Calculate raw score based on weighted answers
    let rawScore = 0;
    quizData.forEach((q, i) => {
        if (userAnswers[i] === q.correct) {
            rawScore += q.weight;
        }
    });
    
    // Normalize score to 1-10 scale
    const maxScore = quizData.reduce((sum, q) => sum + q.weight, 0);
    const finalScore = Math.round((rawScore / maxScore) * 10);
    const clampedScore = Math.max(1, Math.min(10, finalScore));
    
    // Find corresponding security level
    const level = levels.find(l => clampedScore >= l.scoreMin && clampedScore <= l.scoreMax) || levels[4];
    
    // Send quiz submission to Notion via Make.com webhook
    submitQuizToMake(email, clampedScore, level.name);
    
    // Display results section
    document.getElementById('email-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    // Populate results display
    document.getElementById('final-score').textContent = `${clampedScore}/10`;
    document.getElementById('level-name').innerHTML = `${level.emoji} ${level.name}`;
    document.getElementById('level-desc').textContent = level.desc;
    
    // Display recommendations for this level
    const recList = document.getElementById('recommendations');
    recList.innerHTML = level.recs.map(rec => `<li style="margin: 12px 0; padding-left: 24px; position: relative; line-height: 1.6;"><span style="position: absolute; left: 0; color: var(--neon-magenta);">→</span>${rec}</li>`).join('');
    
}

/**
 * Submit quiz data to Notion database via Make.com webhook
 * Quiz submissions use their own webhook (separate from the contact form)
 * @param {string} email - User's email address
 * @param {number} score - Quiz score (1-10)
 * @param {string} level - Security level name
 */
function submitQuizToMake(email, score, level) {
    const webhookUrl = 'https://hook.us2.make.com/bsksqjoatho6opxrxhmzpj5t5jmc5dgi';
    
    // Prepare payload for Notion database
    const payload = {
        email: email,
        score: score,
        level: level,
        category: 'Quiz',
        source: 'Quiz',
        timestamp: new Date().toISOString()
    };
    
    // Send to webhook (non-blocking - UI updates regardless)
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).catch(err => {
        // Silently fail - results already displayed locally
        console.log('Quiz submission sent to Notion');
    });
}

// ===== MOBILE MENU TOGGLE =====

function toggleMobileMenu() {
    const toggle = document.getElementById('navbar-toggle');
    const links = document.getElementById('navbar-links');
    
    if (toggle && links) {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const toggle = document.getElementById('navbar-toggle');
    const links = document.getElementById('navbar-links');
    
    if (toggle && links) {
        toggle.classList.remove('active');
        links.classList.remove('active');
    }
}

// ===== DAD JOKES EASTER EGG (SVG Background) =====

const dadJokesData = [
    {
        question: 'Why did the hacker go to the beach?',
        answer: 'Because they wanted to catch some WAVES (Wireless Access Vector Exploits)!',
        x: 75,
        y: 85,
        width: 160,
        height: 50
    },
    {
        question: 'I told my password to my therapist...',
        answer: 'But they said, "That\'s not your secret anymore—it\'s compromised!"',
        x: 925,
        y: 160,
        width: 160,
        height: 50
    },
    {
        question: 'What did the firewall say to the malware?',
        answer: '"You shall not PASS!"',
        x: 150,
        y: 280,
        width: 160,
        height: 60
    },
    {
        question: 'Did you hear about the claustrophobic server?',
        answer: 'It had a serious compression problem!',
        x: 850,
        y: 430,
        width: 180,
        height: 60
    },
    {
        question: 'Why do programmers prefer dark mode?',
        answer: 'Because light attracts bugs!',
        x: 250,
        y: 530,
        width: 160,
        height: 50
    },
    {
        question: 'How many programmers does it take to change a lightbulb?',
        answer: 'None, that\'s a hardware problem!',
        x: 800,
        y: 680,
        width: 180,
        height: 70
    },
    {
        question: 'Why did the cybersecurity expert break up with their girlfriend?',
        answer: 'She didn\'t meet his security requirements!',
        x: 200,
        y: 830,
        width: 180,
        height: 60
    },
    {
        question: 'What is a password manager favorite music?',
        answer: 'Heavy metal encryption!',
        x: 875,
        y: 955,
        width: 160,
        height: 60
    },
    {
        question: 'Why do hackers never get tired?',
        answer: 'Because they\'re always running scripts!',
        x: 300,
        y: 1030,
        width: 160,
        height: 50
    },
    {
        question: 'What do you call a cybersecurity expert who bakes?',
        answer: 'Someone who knows how to protect their cookies!',
        x: 750,
        y: 1130,
        width: 180,
        height: 60
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('joke-popup');
    const jokeAnswer = document.getElementById('joke-answer');
    
    if (!popup || !jokeAnswer) {
        console.error('Joke popup elements not found');
        return;
    }
    
    // Create overlay for hover zones
    const overlay = document.createElement('div');
    overlay.id = 'jokes-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 50;';
    document.body.appendChild(overlay);
    
    // Background pattern dimensions (from CSS)
    const BG_WIDTH = 1000;
    const BG_HEIGHT = 1200;
    
    // The joke zones need to tile with the background
    // Create zones for multiple tile repeats to cover viewport
    let activeZone = null;
    let zoneCount = 0;
    
    dadJokesData.forEach((joke, index) => {
        // Create zones for multiple horizontal and vertical repeats
        for (let tileX = -2; tileX <= 2; tileX++) {
            for (let tileY = -2; tileY <= 2; tileY++) {
                const zone = document.createElement('div');
                
                // Calculate position with tiling
                const x = joke.x + (tileX * BG_WIDTH);
                const y = joke.y + (tileY * BG_HEIGHT);
                
                zone.setAttribute('data-joke-index', index);
                zone.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${joke.width}px;
                    height: ${joke.height}px;
                    pointer-events: auto;
                    cursor: help;
                    z-index: 51;
                `;
                
                zone.addEventListener('mouseenter', function(e) {
                    activeZone = `${index}-${tileX}-${tileY}`;
                    
                    jokeAnswer.innerHTML = `<strong>${joke.question}</strong><br><br>${joke.answer}`;
                    
                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    
                    if (left + 320 > window.innerWidth) {
                        left = window.innerWidth - 330;
                    }
                    if (left < 10) left = 10;
                    if (top + 200 > window.innerHeight) {
                        top = window.innerHeight - 210;
                    }
                    if (top < 10) top = 10;
                    
                    popup.style.left = left + 'px';
                    popup.style.top = top + 'px';
                    popup.style.display = 'block';
                    popup.classList.add('active');
                });
                
                zone.addEventListener('mousemove', function(e) {
                    let left = e.clientX + 15;
                    let top = e.clientY + 15;
                    
                    if (left + 320 > window.innerWidth) {
                        left = window.innerWidth - 330;
                    }
                    if (left < 10) left = 10;
                    if (top + 200 > window.innerHeight) {
                        top = window.innerHeight - 210;
                    }
                    if (top < 10) top = 10;
                    
                    popup.style.left = left + 'px';
                    popup.style.top = top + 'px';
                });
                
                zone.addEventListener('mouseleave', function() {
                    activeZone = null;
                    popup.classList.remove('active');
                });
                
                overlay.appendChild(zone);
                zoneCount++;
            }
        }
    });
    
    if (popup) {
        popup.addEventListener('mouseleave', function() {
            if (activeZone !== null) {
                this.classList.remove('active');
                activeZone = null;
            }
        });
    }
    
    console.log('Created ' + zoneCount + ' joke hover zones');
});

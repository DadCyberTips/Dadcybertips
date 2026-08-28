// DadCyberTips Website - Interactive Script

// Store Integration Configuration
// Update these with your actual Payhip and Fourthwall links
const STORE_LINKS = {
    // Digital Books (Payhip)
    'Raising Privacy-Smart Kids': 'https://payhip.com/dadcybertips/raising-privacy-smart-kids',
    'Password Security Master Guide': 'https://payhip.com/dadcybertips/password-guide',
    'Home Network Security': 'https://payhip.com/dadcybertips/home-network',
    'Social Media Safety Bundle': 'https://payhip.com/dadcybertips/social-media-bundle',
    'Scam Recognition Handbook': 'https://payhip.com/dadcybertips/scam-handbook',
    'Identity Theft Prevention': 'https://payhip.com/dadcybertips/identity-theft',
    
    // Courses (Payhip)
    'Cybersecurity Masterclass': 'https://payhip.com/dadcybertips/masterclass',
    
    // Merchandise (Fourthwall)
    'Classic T-Shirt': 'https://fourthwall.com/dadcybertips/t-shirt',
    'Dad Hat': 'https://fourthwall.com/dadcybertips/dad-hat',
    'Security Sticker Pack': 'https://fourthwall.com/dadcybertips/sticker-pack',
    'Security Mindset Mug': 'https://fourthwall.com/dadcybertips/mug',
    'Password Manager Journal': 'https://fourthwall.com/dadcybertips/journal',
    'Family Safety Bundle': 'https://fourthwall.com/dadcybertips/bundle',
};

// Free Resource Downloads
const FREE_RESOURCES = {
    'password-checklist': {
        title: 'Password Security Checklist',
        url: '#' // Replace with actual PDF URL
    },
    'family-safety-plan': {
        title: 'Family Safety Plan Template',
        url: '#' // Replace with actual PDF URL
    },
    'phishing-guide': {
        title: 'Phishing Detection Guide',
        url: '#' // Replace with actual PDF URL
    },
    'quick-tips': {
        title: 'Quick Security Tips',
        url: '#' // Replace with actual PDF URL
    },
    'parental-guide': {
        title: 'Parental Internet Safety Guide',
        url: '#' // Replace with actual PDF URL
    },
    'social-media-checklist': {
        title: 'Social Media Safety Checklist',
        url: '#' // Replace with actual PDF URL
    },
};

/**
 * Handle Product Purchase
 * Redirects to appropriate store (Payhip or Fourthwall)
 */
function handlePurchase(productName) {
    const storeLink = STORE_LINKS[productName];
    
    if (!storeLink || storeLink === '#') {
        showNotification('This product link is not configured yet. Please check back soon!', 'info');
        return;
    }
    
    // Track purchase attempt (optional - for analytics)
    trackEvent('purchase_click', {
        product: productName,
        timestamp: new Date().toISOString()
    });
    
    // Open store link
    window.open(storeLink, '_blank');
}

/**
 * Handle Free Resource Download
 */
function downloadResource(resourceKey) {
    const resource = FREE_RESOURCES[resourceKey];
    
    if (!resource || resource.url === '#') {
        showNotification('This resource is being prepared. Check back soon!', 'info');
        return;
    }
    
    // Track download attempt
    trackEvent('download_click', {
        resource: resource.title,
        timestamp: new Date().toISOString()
    });
    
    // Trigger download
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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
 * Email Signup (Optional)
 * For newsletter or mailing list
 */
function handleEmailSignup(email) {
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    trackEvent('email_signup', {
        email: email.replace(/@.+/, '@***'),
        timestamp: new Date().toISOString()
    });
    
    showNotification('Thanks for signing up! Check your email.', 'success');
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Setup Newsletter Form (if exists)
 */
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput) {
                handleEmailSignup(emailInput.value);
                emailInput.value = '';
            }
        });
    }
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
 * Mobile Menu Toggle (if needed)
 */
function toggleMobileMenu() {
    const navbar = document.querySelector('.navbar-links');
    if (navbar) {
        navbar.classList.toggle('active');
    }
}

/**
 * Initialize on page load
 */
window.addEventListener('load', function() {
    console.log('DadCyberTips website initialized');
    setupNewsletterForm();
    
    // You can add more initialization here
    // - Load user preferences
    // - Set up additional event listeners
    // - Initialize third-party libraries
});

/**
 * Quiz Functionality
 */
const quizQuestions = [
    {
        question: "Do you use the same password for multiple accounts?",
        answers: ["Yes, always", "Sometimes", "Never - unique passwords for each"],
        scores: [0, 50, 100]
    },
    {
        question: "How often do you update your home WiFi password?",
        answers: ["Never changed the default", "Once a year or less", "Every 3-6 months"],
        scores: [10, 40, 100]
    },
    {
        question: "Do you use two-factor authentication (2FA)?",
        answers: ["What's that?", "On some accounts", "On all important accounts"],
        scores: [0, 60, 100]
    },
    {
        question: "How do you handle phishing emails?",
        answers: ["Click links to verify", "Usually ignore them", "Report and delete immediately"],
        scores: [0, 40, 100]
    },
    {
        question: "Do you monitor your children's online activity?",
        answers: ["Not really", "Sometimes check", "Active parental controls + regular checks"],
        scores: [20, 60, 100]
    }
];

let quizScore = 0;

function startQuiz() {
    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    renderQuestions();
}

function renderQuestions() {
    const container = document.getElementById('question-container');
    container.innerHTML = '';
    
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.style.cssText = 'margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px solid var(--neon-purple);';
        
        let html = `<h4 style="color: var(--neon-pink); margin-bottom: 1rem; font-size: 14px; text-transform: uppercase;">${index + 1}. ${q.question}</h4>`;
        
        q.answers.forEach((answer, ansIndex) => {
            html += `
                <div style="margin-bottom: 0.75rem;">
                    <input type="radio" name="q${index}" value="${ansIndex}" id="q${index}_${ansIndex}" required>
                    <label for="q${index}_${ansIndex}" style="color: var(--neon-cyan); font-size: 13px; cursor: pointer; margin-left: 0.5rem;">${answer}</label>
                </div>
            `;
        });
        
        questionDiv.innerHTML = html;
        container.appendChild(questionDiv);
    });
}

function handleQuizSubmit(event) {
    event.preventDefault();
    
    quizScore = 0;
    quizQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected) {
            quizScore += q.scores[parseInt(selected.value)];
        }
    });
    
    quizScore = Math.round(quizScore / quizQuestions.length);
    
    document.getElementById('quiz-questions').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    displayResults();
}

function displayResults() {
    let scoreText = '';
    let recommendation = '';
    
    if (quizScore >= 85) {
        scoreText = `🛡️ SECURITY EXPERT (${quizScore}%) - You're doing an EXCELLENT job protecting your family!`;
        recommendation = 'Keep up the amazing work! Stay updated with our latest security tips and share your knowledge with others. Consider getting our Advanced Protection Bundle for even more security insights.';
    } else if (quizScore >= 70) {
        scoreText = `🟢 SECURITY CONSCIOUS (${quizScore}%) - You're on the right track!`;
        recommendation = 'You\'re doing well, but there\'s room for improvement. Focus on implementing 2FA on all accounts and regular security updates. Our Password Security Guide & Home Network Security books will help you level up.';
    } else if (quizScore >= 50) {
        scoreText = `🟡 NEEDS ATTENTION (${quizScore}%) - Time to strengthen your defenses!`;
        recommendation = 'Your family might be at risk. Start with the basics: update your passwords, enable 2FA, and set up parental controls. Get our "Raising Privacy-Smart Kids" and "Password Security Master Guide" to transform your security.';
    } else {
        scoreText = `🔴 HIGH RISK (${quizScore}%) - Urgent action needed!`;
        recommendation = 'Your family is vulnerable to cyber threats. Start immediately with password changes, WiFi security, and parental controls. We recommend getting our complete Cybersecurity Masterclass course for comprehensive protection.';
    }
    
    document.getElementById('score-text').textContent = scoreText;
    document.getElementById('recommendation').textContent = recommendation;
}

function resetQuiz() {
    quizScore = 0;
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-intro').style.display = 'block';
    document.getElementById('quizForm').reset();
}

/**
 * Mailing List Functionality
 */
function submitMailingList() {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    
    if (!email || !isValidEmail(email) || !name) {
        showNotification('Please enter a valid name and email address', 'error');
        return;
    }
    
    // Prepare mailing list data
    const mailingListData = {
        name: name,
        email: email,
        quizScore: quizScore,
        timestamp: new Date().toISOString()
    };
    
    // Track the mailing list signup
    trackEvent('mailing_list_signup', {
        email: email.replace(/@.+/, '@***'),
        score: quizScore,
        timestamp: new Date().toISOString()
    });
    
    // Option 1: Send to your email service (Mailchimp, ConvertKit, etc.)
    // Example for Mailchimp (requires backend integration):
    // sendToMailchimp(mailingListData);
    
    // Option 2: Store locally in browser (for development)
    let subscribers = JSON.parse(localStorage.getItem('dadcybertips_subscribers') || '[]');
    subscribers.push(mailingListData);
    localStorage.setItem('dadcybertips_subscribers', JSON.stringify(subscribers));
    
    // Show success message
    showNotification(`Welcome to DadCyberTips, ${name}! Check your email for personalized recommendations.`, 'success');
    
    // Reset form
    document.getElementById('email').value = '';
    document.getElementById('name').value = '';
}

/**
 * Send to Mailchimp (requires backend API)
 * Uncomment and configure when you set up your mail service
 */
/*
async function sendToMailchimp(data) {
    try {
        const response = await fetch('YOUR_BACKEND_ENDPOINT/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Subscription failed');
        return await response.json();
    } catch (error) {
        console.error('Mailing list error:', error);
        showNotification('There was an error. Please try again.', 'error');
    }
}
*/
    updateStoreLink: function(productName, newLink) {
        STORE_LINKS[productName] = newLink;
        console.log(`Updated store link for ${productName}`);
    },
    updateResourceLink: function(resourceKey, newLink) {
        FREE_RESOURCES[resourceKey].url = newLink;
        console.log(`Updated resource link for ${resourceKey}`);
    },
    getStoreLinks: function() {
        return STORE_LINKS;
    },
    getResources: function() {
        return FREE_RESOURCES;
    }
};

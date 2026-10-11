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


const CONTACT_WEBHOOK_URL = 'https://hook.us2.make.com/ojmt2rjmx8lhejmt1o9n8nfiwjz4vsml';

/**
 * Send a contact message to Notion (through the Make.com webhook).
 * Used by both the home page form and the services page form.
 * Tries twice (2 seconds apart) before giving up.
 * @param {Object} payload - name, email, phone, organization, category, source, comments, timestamp
 * @returns {Promise<boolean>} true if the message was sent, false if it could not be
 */
function sendContactToMake(payload) {
    function attempt(n) {
        return fetch(CONTACT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        }).then(response => {
            if (!response.ok) throw new Error('Webhook responded with status ' + response.status);
            return true;
        }).catch(err => {
            if (n < 2) {
                return new Promise(resolve => setTimeout(resolve, 2000)).then(() => attempt(n + 1));
            }
            console.error('Contact submission failed after 2 attempts:', err);
            return false;
        });
    }
    return attempt(1);
}

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

    // Block double-clicks while the message is on its way
    const button = event.target.querySelector('[type="submit"]');
    if (button) {
        if (button.disabled) return;
        button.disabled = true;
    }

    sendContactToMake(notionPayload).then(sent => {
        if (button) button.disabled = false;
        if (sent) {
            document.getElementById('marketing-form').reset();
            showNotification(`Thanks, ${name.split(' ')[0]}! Your message was sent.`, 'success');
            trackEvent('contact_form_submitted', { category: category });
        } else {
            showNotification('Sorry, your message could not be sent. Please try again in a minute.', 'error');
        }
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
        question: "How many of your passwords do you use on more than one website or app?",
        options: ["None — every account has its own password", "1 or 2 of them", "Several of them", "Almost all of them"],
        weight: 3,
        tip: "A password manager app can remember a different password for every account, so you only have to remember one."
    },
    {
        question: "When a website offers a second step to log in (like a code sent to your phone), do you turn it on?",
        options: ["Yes — on all my important accounts", "Yes — but only on a few, like email or banking", "No — I only use security questions, like \"your first pet's name\"", "No — my password is my only protection"],
        weight: 3,
        tip: "This is called 2-step login. After your password, the site asks for a code from your phone. Turn it on for your email and bank first."
    },
    {
        question: "How often do you update your computer, your phone, and the apps on them?",
        options: ["As soon as an update is ready (or I have automatic updates turned on)", "Within a week or so", "Every few months, when it's convenient", "Rarely or never — I ignore the update messages"],
        weight: 3,
        tip: "Turn on automatic updates. Updates fix the weak spots that criminals look for."
    },
    {
        question: "How is the password on your home WiFi set up?",
        options: ["I made my own password that is long and hard to guess", "I still use the password that came with my WiFi box (the router)", "My password is simple, and I give it to lots of people", "My WiFi has no password at all"],
        weight: 3,
        tip: "Change the password that came with your router to your own long one. The old one is usually printed on a sticker on the router."
    },
    {
        question: "Do you keep a second copy of everything important (tax papers, insurance cards, family photos)?",
        options: ["Yes — copies are saved automatically to the cloud and to a drive at home", "Yes — I copy them to a drive or the cloud about once a week", "Only once in a while, when I remember", "No — I don't keep any extra copies"],
        weight: 2,
        tip: "Keep at least two copies, and keep one in a different place, like online storage. Then a broken or locked device won't wipe out everything."
    },
    {
        question: "How careful are you with emails and texts that have links or ask for your information?",
        options: ["Very careful — I check who sent it and never click links I don't trust", "Somewhat careful — I click if it looks real", "Not very careful — I usually click if it seems important", "Not careful — I click on whatever looks interesting"],
        weight: 2,
        tip: "Scam messages pretend to be your bank, a store, or a friend. If a message feels rushed or odd, don't click. Go to the company's real website or call them instead."
    },
    {
        question: "Where do you get new apps and programs?",
        options: ["Only from official app stores or the company's own website", "Mostly from official stores, but sometimes from other websites", "From whatever website I find online", "From free-movie, free-game, or file-sharing sites"],
        weight: 2,
        tip: "Stick to the Apple App Store, Google Play, or the company's own website. Free copies of paid games and movies often hide viruses."
    },
    {
        question: "Do you have smart gadgets at home (cameras, TVs, doorbells, speakers)? If so, did you change their passwords and keep them updated?",
        options: ["Yes — I changed every password and keep them updated", "I changed most of the passwords and update them sometimes", "I use the passwords they came with", "I have several and never changed any settings"],
        weight: 2,
        tip: "Smart gadgets often come with an easy password that everyone knows. Change it when you set one up. Many routers also have a \"guest WiFi\" that keeps gadgets away from your computers."
    },
    {
        question: "How often do you check who can see your posts and personal info on social media?",
        options: ["Every few months", "About once a year", "Only when the app reminds me", "Never — I've never looked"],
        weight: 1,
        tip: "Look at the privacy settings in each app once or twice a year. Share posts with friends only, and turn off location sharing."
    },
    {
        question: "Do you use anything to block ads and trackers when you browse the internet?",
        options: ["Yes — an ad blocker plus a privacy add-on I trust", "Yes — a basic ad blocker", "I added some add-ons years ago and forgot about them", "No — I use my browser just as it came"],
        weight: 1,
        tip: "A trusted ad blocker (like uBlock Origin) stops many scam ads and trackers. Remove any add-ons you don't use or don't remember adding."
    },
    {
        question: "Have you ever checked if your email address was part of a data leak (when a company gets hacked)?",
        options: ["Yes — and I get an alert if it happens again", "Yes — I checked once or twice", "I've heard of this but never checked", "No — I didn't know I could check"],
        weight: 1,
        tip: "Go to haveibeenpwned.com, type in your email, and see if it was leaked. If it was, change that password right away."
    },
    {
        question: "What do you do on free public WiFi (like at a coffee shop or airport)?",
        options: ["I never do banking or shopping on it — I use my phone's data instead", "I try to avoid banking and shopping on it", "I use it for most things and don't worry about it", "I bank and shop on any WiFi I can find"],
        weight: 1,
        tip: "Other people can snoop on public WiFi. For banking and shopping, switch to your phone's data. A VPN app (a tool that hides what you're doing) also helps."
    }
];

// Share of a question's points earned by each answer position (best answer first)
const ANSWER_CREDIT = [1, 2 / 3, 1 / 3, 0];

const levels = [
    { scoreMin: 9, scoreMax: 10, name: "Cyber Fortress", emoji: "🏰",
      desc: "Great job! Your family's digital defenses are excellent.",
      recs: ["Keep up your good habits", "Stay alert for new scams", "Teach a friend or family member what you know"] },
    { scoreMin: 7, scoreMax: 8, name: "Fortified Home", emoji: "🔒",
      desc: "Strong protection with just a few small gaps to fix.",
      recs: ["Look back at the questions where you could improve", "Turn on 2-step login (a code sent to your phone) for your important accounts", "Set your backups to save automatically"] },
    { scoreMin: 5, scoreMax: 6, name: "Basic Lock", emoji: "🚪",
      desc: "You have some protection, but a few things need attention soon.",
      recs: ["Turn on 2-step login (a code sent to your phone) for your email and bank", "Turn on automatic updates on your phones and computers", "Change the password that came with your WiFi box (the router)", "Start saving copies of your important files"] },
    { scoreMin: 3, scoreMax: 4, name: "Vulnerable House", emoji: "⚠️",
      desc: "There are gaps that criminals could use. Your digital home needs attention now.",
      recs: ["Start with a password manager app so every account has its own password", "Make sure your WiFi has a strong password that you created", "Turn on your computer's built-in firewall (a guard for your internet connection)", "Start saving copies of your important files"] },
    { scoreMin: 1, scoreMax: 2, name: "Digital Door Open Wide", emoji: "🏚️",
      desc: "Your digital home has a lot of open doors. The good news: you can close them one step at a time.",
      recs: ["Change the passwords on your most important accounts first (email and bank)", "Turn on 2-step login (a code sent to your phone) wherever it's offered", "Run a virus scan with the protection already built into your device", "Set a strong WiFi password that you made yourself"] }
];

let currentQuestionIndex = 0;
let lastQuizSubmission = null; // stops double-clicks from saving the same result twice
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
    const email = document.getElementById('email-input').value.trim();
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Calculate raw score based on weighted answers, with partial credit.
    // Answers are listed from best to worst: the best answer earns the full
    // points for that question, the next two earn two-thirds and one-third, the last earns none.
    let rawScore = 0;
    quizData.forEach((q, i) => {
        const picked = userAnswers[i];
        if (picked !== null && picked !== undefined) {
            rawScore += q.weight * ANSWER_CREDIT[picked];
        }
    });
    
    // Normalize score to 1-10 scale
    const maxScore = quizData.reduce((sum, q) => sum + q.weight, 0);
    const finalScore = Math.round((rawScore / maxScore) * 10);
    const clampedScore = Math.max(1, Math.min(10, finalScore));
    
    // Find corresponding security level
    const level = levels.find(l => clampedScore >= l.scoreMin && clampedScore <= l.scoreMax) || levels[4];
    
    // Send quiz submission to Notion via Make.com webhook (only once per email + score)
    const submissionKey = email.toLowerCase() + '|' + clampedScore;
    if (submissionKey !== lastQuizSubmission) {
        lastQuizSubmission = submissionKey;
        submitQuizToMake(email, clampedScore, level.name);
    }
    
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
    
    // Send to webhook (non-blocking - the results screen shows regardless).
    // If the first try fails, wait 2 seconds and try once more.
    function send(attempt) {
        return fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        }).then(response => {
            if (!response.ok) throw new Error('Webhook responded with status ' + response.status);
        }).catch(err => {
            if (attempt < 2) {
                return new Promise(resolve => setTimeout(resolve, 2000)).then(() => send(attempt + 1));
            }
            console.error('Quiz submission failed after 2 attempts:', err);
        });
    }
    send(1);
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

/**
 * Hero headline attention effect
 * Every few seconds the "Protect your family online" banner flashes out and comes back in
 * with a different animation (never the same one twice in a row).
 * Change the delay with data-interval (seconds) on #hero-alert in index.html.
 * Skipped for visitors who have turned on "reduce motion".
 */
function initHeroAlert() {
    const el = document.getElementById('hero-alert');
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const effects = ['fx-flicker', 'fx-zoom', 'fx-slide-left', 'fx-slide-right', 'fx-drop', 'fx-glitch', 'fx-flip'];
    const seconds = Math.max(4, parseFloat(el.dataset.interval) || 9);
    let last = -1;

    function play() {
        if (document.hidden) return;
        let pick;
        do { pick = Math.floor(Math.random() * effects.length); } while (pick === last);
        last = pick;
        el.classList.remove(...effects);
        void el.offsetWidth; // restart the animation
        el.classList.add(effects[pick]);
    }

    el.addEventListener('animationend', function (e) {
        if (e.target === el && e.animationName.indexOf('heroFx') === 0) el.classList.remove(...effects);
    });

    setTimeout(play, 1200);
    setInterval(play, seconds * 1000);
}

document.addEventListener('DOMContentLoaded', initHeroAlert);

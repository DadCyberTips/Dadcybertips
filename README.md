https://dadcybertips.github.io/Dadcybertips/

# DadCyberTips Website

A modern, responsive e-commerce website for DadCyberTips by Gavin Marlowe. Built with HTML, CSS, and vanilla JavaScript—ready to deploy on GitHub Pages.

## 🚀 Features

- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Product Showcase**: Display digital books, courses, and merchandise
- **Free Resources**: Offer downloadable guides and checklists
- **Store Integration**: Seamless links to Payhip (digital products) and Fourthwall (merchandise)
- **Modern UI**: Clean, professional design with smooth interactions
- **Analytics Ready**: Built-in event tracking for user interactions
- **SEO Optimized**: Meta tags and semantic HTML for search engines
- **No Dependencies**: Pure HTML/CSS/JavaScript—no build tools needed

## 📁 File Structure

```
dadcybertips-website/
├── index.html          # Main HTML page
├── styles.css          # All styling and responsive design
├── script.js           # Interactive features and store integration
├── README.md           # This file
└── .gitignore          # Git ignore file (optional)
```

## ⚙️ Setup Instructions

### 1. **Clone or Fork the Repository**

```bash
git clone https://github.com/yourusername/dadcybertips-website.git
cd dadcybertips-website
```

### 2. **Configure Store Links**

Edit `script.js` and update the store links:

```javascript
const STORE_LINKS = {
    'Raising Privacy-Smart Kids': 'https://payhip.com/dadcybertips/your-product-link',
    'Password Security Master Guide': 'https://payhip.com/dadcybertips/your-product-link',
    // ... and so on
};
```

#### For Payhip Products:
- Go to your Payhip dashboard
- Copy your product links
- Paste them in the corresponding sections

#### For Fourthwall Merchandise:
- Go to your Fourthwall store
- Copy your product links
- Add them to the merchandise section

### 3. **Configure Free Resources**

Update the free resource download links in `script.js`:

```javascript
const FREE_RESOURCES = {
    'password-checklist': {
        title: 'Password Security Checklist',
        url: 'https://example.com/downloads/checklist.pdf' // Add your PDF URL
    },
    // ... add your other resources
};
```

## 🌐 Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it: `dadcybertips-website` (or your preferred name)
3. Make it **public**
4. Click "Create repository"

### Step 2: Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: DadCyberTips website"

# Add remote
git remote add origin https://github.com/yourusername/dadcybertips-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source," select **Deploy from a branch**
4. Select the `main` branch
5. Select the root folder `/`
6. Click **Save**

Your site will be live at: `https://yourusername.github.io/dadcybertips-website/`

## 🎨 Customization

### Change Colors

Edit the color variables at the top of `styles.css`:

```css
:root {
    --color-primary: #185FA5;           /* Main blue */
    --color-primary-light: #378ADD;     /* Light blue */
    --color-primary-dark: #0C447C;      /* Dark blue */
    --color-success: #639922;
    --color-danger: #E24B4A;
    --color-warning: #BA7517;
}
```

### Update Branding

- **Logo/Name**: Edit in `index.html` navbar section
- **Meta Description**: Update the `<meta>` tags in `<head>`
- **Social Links**: Update footer social media links

### Add New Products

In `index.html`, duplicate a product card and update:

```html
<div class="product-card">
    <div class="product-icon">📚</div>
    <h3 class="product-name">Your Product Name</h3>
    <p class="product-desc">Your product description</p>
    <div class="product-price">$19.99</div>
    <button class="btn btn-primary" onclick="handlePurchase('Your Product Name')">Buy Now</button>
</div>
```

Then add the store link to `script.js`:

```javascript
const STORE_LINKS = {
    'Your Product Name': 'https://payhip.com/your-product-url',
};
```

## 📊 Analytics Setup (Optional)

### Google Analytics

Add this to the `<head>` section of `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your actual measurement ID.

## 🔧 Advanced Customization

### Add Email Signup Form

Add this to `index.html` in any section:

```html
<form class="newsletter-form" style="max-width: 400px; margin: 2rem auto;">
    <input type="email" placeholder="Enter your email" required>
    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Subscribe</button>
</form>
```

The form is automatically handled by the JavaScript.

### Custom Fonts

Edit `styles.css` and add Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
    font-family: 'Poppins', sans-serif;
}
```

## 📱 Mobile Optimization

The site is fully responsive with breakpoints at:
- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 1200px and above

Test on real devices or use Chrome DevTools (F12 → Toggle device toolbar).

## 🚀 Performance Tips

1. **Optimize Images**: Use compressed, web-friendly formats
2. **Lazy Load**: Add `loading="lazy"` to images
3. **Cache**: GitHub Pages automatically caches static files
4. **Minify CSS/JS**: Optional—use [CSS Minifier](https://cssminifier.com/) for production

## 🐛 Troubleshooting

### Site Not Showing?
- Check that GitHub Pages is enabled in Settings → Pages
- Wait 5-10 minutes for initial deployment
- Check the repository name in your GitHub URL

### Links Not Working?
- Verify Payhip/Fourthwall links in `script.js`
- Test links in a new tab to ensure they're correct

### Styling Issues?
- Clear browser cache (Ctrl+Shift+Del)
- Check that `styles.css` is in the root folder
- Verify CSS file name in `index.html`

## 📈 Next Steps

1. **Add Analytics**: Set up Google Analytics for traffic tracking
2. **Email Marketing**: Connect to Mailchimp or ConvertKit for newsletters
3. **Social Integration**: Add social media feeds or share buttons
4. **Blog Section**: Add a blog to share cybersecurity tips
5. **Custom Domain**: Point a custom domain to your GitHub Pages site

## 🤝 Contributing

Have ideas for improvements? 
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This website template is provided as-is for DadCyberTips. Feel free to modify and customize.

## 📞 Support

For questions or issues:
- Check the [GitHub Issues](https://github.com/yourusername/dadcybertips-website/issues)
- Visit [DadCyberTips](https://linktr.ee/dadcybertips)

---

**Happy coding! Stay safe online. 🛡️**

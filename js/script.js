// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
    // Convert hex to RGB
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    // Get RGB values for both colors
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    // Interpolate between the colors
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    // Convert back to hex
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Function to calculate scroll percentage
function getScrollPercentage() {
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    return (scrollPosition / documentHeight) * 100;
}

// Function to scroll to specific percentage of page
function scrollToPercentage(percentage, duration = 1000) {
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const targetPosition = (documentHeight * percentage) / 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Initialize nav links
function initNavLinks() {
    // Map nav IDs to scroll percentages
    const navPercentages = {
        'home': 0,
        'about': 11.6,
        'experience': 55.8,  // Adjust these percentages
        'projects': 94.7     // to match your desired scroll positions
    };

    const navButtons = document.querySelectorAll('.nav-button');
    console.log('Found nav buttons:', navButtons.length); // Debug log

    navButtons.forEach(link => {
        console.log('Setting up listener for:', link.id); // Debug log
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Button clicked:', this.id); // Debug log
            const percentage = navPercentages[this.id];
            console.log('Scroll percentage:', percentage); // Debug log
            if (percentage !== undefined) {
                scrollToPercentage(percentage);
            }
        });
    });
}

function updateActiveNav() {
    const scrollPercentage = getScrollPercentage();
    const navLinks = document.querySelectorAll('.nav-button');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Add active class based on scroll position
        if ((scrollPercentage >= 11 && scrollPercentage < 50 && link.id === 'experience') ||
            (scrollPercentage >= 50 && link.id === 'projects')) {
            link.classList.add('active');
        }
    });
}

// Function to handle reveal animations based on scroll percentage
function handleScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const mainSection = document.querySelector('.main-section');
    const header = document.querySelector('.header');
    const contactLinkedin = document.querySelector('.fa-linkedin');
    const contactGithub = document.querySelector('.fa-github');
    const scrollPercentage = getScrollPercentage();
    
    // Update scroll percentage indicator
    document.getElementById('scrollPercentage').textContent = scrollPercentage.toFixed(1);
    
    // Calculate color interpolation factor
    let colorFactor;
    
    if (scrollPercentage <= 11) {
        // From 0-11%: #4A4A48 to #566246
        colorFactor = scrollPercentage / 11;
        const newColor = interpolateColor('#4A4A48', '#566246', colorFactor);
        mainSection.style.backgroundColor = newColor;
        
    } else if (scrollPercentage <= 50) {
        // Between 11-50%: Stay at #566246
        mainSection.style.backgroundColor = '#566246';
        contactLinkedin.style.backgroundColor = '#d8dad3';
        contactGithub.style.backgroundColor = '#d8dad3';
        
    } else if (scrollPercentage <= 55) {
        // From 50-63%: #566246 to #000000
        colorFactor = (scrollPercentage - 50) / (55 - 50); // Normalize factor for the range 50-63%
        const newColor = interpolateColor('#566246', '#000000', colorFactor);
        const contactNavNewColor = interpolateColor('#d8dad3', '#FFFFFF', colorFactor);
        mainSection.style.backgroundColor = newColor;
        contactLinkedin.style.backgroundColor = contactNavNewColor;
        contactGithub.style.backgroundColor = contactNavNewColor;

    } else if (scrollPercentage <= 90) {
        // After 63%: #000000 back to #F1F2EB
        colorFactor = (scrollPercentage - 55) / (94 - 55); // Normalize factor for the range 63-100%
        const newColor = interpolateColor('#000000', '#F1F2EB', colorFactor);
        const contactNavNewColor = interpolateColor('#F1F2EB', '#A4C2A5', colorFactor);
        mainSection.style.backgroundColor = newColor;
        contactLinkedin.style.backgroundColor = contactNavNewColor;
        contactGithub.style.backgroundColor = contactNavNewColor;
        
    }

    // Handle reveal animations
    if (scrollPercentage >= 11) {
        reveals.forEach(element => {
            element.classList.add('active');
        });
    } else {
        reveals.forEach(element => {
            element.classList.remove('active');
        });
    }

    updateActiveNav();
}

// Initialize nav buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavButtons();
    handleScroll(); // Your existing initialization
});

// Make sure DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavLinks);
} else {
    initNavLinks();
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

// window.addEventListener('scroll', () => {
//     const header = document.querySelector('.header');
//     const scrollPosition = window.scrollY;
    
//     if (scrollPosition > 100) {
//         // When scrolled, add semi-transparent background
//         header.style.backgroundColor = 'rgba(74, 74, 72, 0)';
//         header.style.backdropFilter = 'blur(5px)';
//     } else {
//         // At top, keep transparent
//         header.style.backgroundColor = 'rgba(74, 74, 72, 0)';
//         header.style.backdropFilter = 'none';
//     }
// });

// Initial check on page load
document.addEventListener('DOMContentLoaded', handleScroll)

// scrollToPercentage(0, 1500);
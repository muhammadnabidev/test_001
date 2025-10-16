// Advanced Cursor Controller
class AdvancedCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        this.trailElements = [];
        this.initEvents();
        this.createTrailEffect();
        this.updateCursor();
    }

    initEvents() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateCursor();
            this.updateTrail();
        });

        // Hover states
        document.querySelectorAll('a, .btn, .project-card, .skill-item, input, textarea, button').forEach(el => {
            el.addEventListener('mouseenter', () => this.setHoverState(el));
            el.addEventListener('mouseleave', () => this.resetHoverState());
        });

        // Click effect
        document.addEventListener('click', (e) => this.createClickEffect(e));
        
        // Scroll effect
        window.addEventListener('scroll', () => {
            this.cursor.style.opacity = window.scrollY > 100 ? '0.7' : '1';
        });
    }

    setHoverState(element) {
        this.cursor.classList.remove('hover', 'btn-hover', 'link-hover', 'card-hover', 'text-hover', 'progress-hover', 'form-hover');
        
        if (element.tagName === 'A' || element.classList.contains('nav-link')) {
            this.cursor.classList.add('link-hover');
        } else if (element.classList.contains('btn') || element.tagName === 'BUTTON') {
            this.cursor.classList.add('btn-hover');
        } else if (element.classList.contains('project-card')) {
            this.cursor.classList.add('card-hover');
        } else if (element.classList.contains('skill-progress') || element.querySelector('.skill-progress')) {
            this.cursor.classList.add('progress-hover');
        } else if (['INPUT', 'TEXTAREA'].includes(element.tagName)) {
            this.cursor.classList.add('form-hover');
        } else {
            this.cursor.classList.add('hover');
        }
    }

    resetHoverState() {
        this.cursor.classList.remove(
            'hover', 'btn-hover', 'link-hover', 
            'card-hover', 'text-hover', 'progress-hover', 'form-hover'
        );
    }

    updateCursor() {
        if (!this.lastMousePosition) {
            this.lastMousePosition = { x: this.mouseX, y: this.mouseY };
            return;
        }

        // Smooth movement
        const ease = 0.1;
        this.cursor.style.left = this.mouseX + 'px';
        this.cursor.style.top = this.mouseY + 'px';

        // Velocity-based size
        const velocity = Math.sqrt(
            Math.pow(this.mouseX - this.lastMousePosition.x, 2) + 
            Math.pow(this.mouseY - this.lastMousePosition.y, 2)
        );
        
        const size = Math.max(15, Math.min(30, velocity * 0.1 + 20));
        this.cursor.style.width = size + 'px';
        this.cursor.style.height = size + 'px';

        this.lastMousePosition = { x: this.mouseX, y: this.mouseY };
    }

    createTrailEffect() {
        // Particle trail
        setInterval(() => {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #00ffff, transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99998;
                left: ${this.mouseX}px;
                top: ${this.mouseY}px;
                animation: trailFade 1s ease-out forwards;
            `;
            document.body.appendChild(trail);
            
            setTimeout(() => trail.remove(), 1000);
        }, 100);
    }

    updateTrail() {
        // Update trail positions
        document.querySelectorAll('.trail-particle')?.forEach(particle => {
            particle.style.left = this.mouseX + 'px';
            particle.style.top = this.mouseY + 'px';
        });
    }

    createClickEffect(e) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #ff00ff, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            left: ${e.clientX - 5}px;
            top: ${e.clientY - 5}px;
            animation: clickRipple 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
}

// CSS for trail and click effects
const style = document.createElement('style');
style.textContent = `
    @keyframes trailFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    @keyframes clickRipple {
        0% { 
            transform: scale(0);
            opacity: 1;
        }
        100% { 
            transform: scale(8);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize advanced cursor
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedCursor();
});

// Portfolio bilan integratsiya
class PortfolioCursor extends AdvancedCursor {
    constructor(portfolio) {
        super();
        this.portfolio = portfolio;
        this.initPortfolioInteractions();
    }

    initPortfolioInteractions() {
        // Hero section special effects
        const heroElements = document.querySelectorAll('#home *');
        heroElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.filter = 'hue-rotate(90deg)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.filter = 'none';
            });
        });

        // Project cards uchun maxsus
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.cursor.style.left = (rect.left + x) + 'px';
                this.cursor.style.top = (rect.top + y) + 'px';
                this.cursor.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetHoverState();
            });
        });

        // Typing effect bilan sinxron
        const typingText = document.getElementById('typing-text');
        if (typingText) {
            const observer = new MutationObserver(() => {
                this.cursor.classList.add('text-hover');
                setTimeout(() => this.resetHoverState(), 1000);
            });
            observer.observe(typingText, { childList: true, subtree: true });
        }
    }
}

// Portfolio class ni yangilash
class AdvancedPortfolio {
    constructor() {
        this.init();
        this.cursor = new PortfolioCursor(this);
    }
    
    // Qolgan metodlar...
}
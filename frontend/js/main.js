// Main Application Logic
class GameVault {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api';
        this.init();
    }
    
    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupAnimations();
        this.loadFeaturedGames();
        this.setupCounters();
    }
    
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });
    }
    
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
        
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                document.querySelector('.nav-links').classList.toggle('active');
            });
        }
    }
    
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.game-card, .category-card, .section-title').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Add CSS for animate-in
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
        
        // 3D Tilt effect for cards
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
    
    async loadFeaturedGames() {
        const featuredContainer = document.getElementById('featuredGames');
        const trendingContainer = document.getElementById('trendingCarousel');
        
        try {
            // Simulated data - replace with actual API call
            const games = await this.fetchGames();
            
            if (featuredContainer) {
                featuredContainer.innerHTML = games.slice(0, 6).map(game => this.createGameCard(game)).join('');
            }
            
            if (trendingContainer) {
                trendingContainer.innerHTML = games.slice(0, 5).map(game => this.createTrendingCard(game)).join('');
            }
            
        } catch (error) {
            console.error('Failed to load games:', error);
            this.showNotification('Failed to load games', 'error');
        }
    }
    
    async fetchGames() {
        // Replace with actual API endpoint
        // const response = await fetch(`${this.apiUrl}/games`);
        // return await response.json();
        
        // Dummy data
        return [
            {
                id: 1,
                title: "Cyber Odyssey 2077",
                thumbnail: "https://via.placeholder.com/400x225/1a1a2e/00d4ff?text=Cyber+Odyssey",
                category: "RPG",
                rating: 4.5,
                downloads: 50200,
                author: "NeoStudio",
                authorAvatar: "https://via.placeholder.com/40",
                badge: "Featured"
            },
            {
                id: 2,
                title: "Stellar Conquest",
                thumbnail: "https://via.placeholder.com/400x225/16213e/ff006e?text=Stellar+Conquest",
                category: "Strategy",
                rating: 4.8,
                downloads: 32100,
                author: "StarForge",
                authorAvatar: "https://via.placeholder.com/40"
            },
            {
                id: 3,
                title: "Shadow Ninja",
                thumbnail: "https://via.placeholder.com/400x225/0f3460/8338ec?text=Shadow+Ninja",
                category: "Action",
                rating: 4.2,
                downloads: 28900,
                author: "DarkArts",
                authorAvatar: "https://via.placeholder.com/40",
                badge: "New"
            },
            {
                id: 4,
                title: "Puzzle Mind",
                thumbnail: "https://via.placeholder.com/400x225/533483/06ffa5?text=Puzzle+Mind",
                category: "Puzzle",
                rating: 4.6,
                downloads: 15600,
                author: "BrainWorks",
                authorAvatar: "https://via.placeholder.com/40"
            },
            {
                id: 5,
                title: "Racing Thunder",
                thumbnail: "https://via.placeholder.com/400x225/e94560/ffbe0b?text=Racing+Thunder",
                category: "Racing",
                rating: 4.3,
                downloads: 42300,
                author: "SpeedDev",
                authorAvatar: "https://via.placeholder.com/40"
            },
            {
                id: 6,
                title: "Dungeon Quest",
                thumbnail: "https://via.placeholder.com/400x225/1a1a2e/00d4ff?text=Dungeon+Quest",
                category: "Adventure",
                rating: 4.7,
                downloads: 67800,
                author: "QuestMakers",
                authorAvatar: "https://via.placeholder.com/40",
                badge: "Hot"
            }
        ];
    }
    
    createGameCard(game) {
        return `
            <article class="game-card" onclick="window.location.href='game-detail.html?id=${game.id}'">
                <div class="game-thumbnail">
                    <img src="${game.thumbnail}" alt="${game.title}" loading="lazy">
                    ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                    <div class="game-rating">
                        <span>★</span>
                        <span>${game.rating}</span>
                    </div>
                    <div class="game-overlay">
                        <button class="btn btn-primary">View Details</button>
                    </div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-meta">
                        <div class="game-author">
                            <img src="${game.authorAvatar}" alt="${game.author}">
                            <span>${game.author}</span>
                        </div>
                        <div class="game-stats">
                            <span>⬇ ${this.formatNumber(game.downloads)}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
    
    createTrendingCard(game) {
        return `
            <div class="trending-card" onclick="window.location.href='game-detail.html?id=${game.id}'">
                <img src="${game.thumbnail}" alt="${game.title}">
                <div class="trending-info">
                    <h4>${game.title}</h4>
                    <span class="trending-category">${game.category}</span>
                </div>
            </div>
        `;
    }
    
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            update();
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer') || document.body;
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.gameVault = new GameVault();
});
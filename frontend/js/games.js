class GamesListing {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 10;
        this.games = [];
        this.init();
    }
    
    init() {
        this.loadGames();
        this.setupSearch();
        this.setupFilters();
        this.setupPagination();
    }
    
    async loadGames() {
        const grid = document.getElementById('gamesGrid');
        
        // Show loading state
        grid.innerHTML = '<div class="loading-games">Loading games...</div>';
        
        try {
            // Replace with actual API
            // const response = await fetch(`http://localhost:8080/api/games?page=${this.currentPage}&limit=12`);
            // const data = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Dummy data
            this.games = Array(12).fill(null).map((_, i) => ({
                id: i + 1,
                title: `Game Title ${i + 1}`,
                thumbnail: `https://via.placeholder.com/400x225/${['1a1a2e', '16213e', '0f3460', '533483'][i % 4]}/00d4ff?text=Game+${i + 1}`,
                category: ['Action', 'RPG', 'Strategy', 'Puzzle'][i % 4],
                rating: (3 + Math.random() * 2).toFixed(1),
                downloads: Math.floor(Math.random() * 100000),
                author: `Developer ${i + 1}`,
                authorAvatar: 'https://via.placeholder.com/40'
            }));
            
            this.renderGames();
            
        } catch (error) {
            console.error('Failed to load games:', error);
        }
    }
    
    renderGames() {
        const grid = document.getElementById('gamesGrid');
        grid.innerHTML = this.games.map(game => window.gameVault.createGameCard(game)).join('');
        
        // Re-initialize animations
        document.querySelectorAll('.game-card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        let debounceTimer;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.filterGames(e.target.value);
            }, 300);
        });
    }
    
    setupFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        categoryFilter.addEventListener('change', () => this.loadGames());
        sortFilter.addEventListener('change', () => this.loadGames());
    }
    
    filterGames(query) {
        const filtered = this.games.filter(game => 
            game.title.toLowerCase().includes(query.toLowerCase()) ||
            game.category.toLowerCase().includes(query.toLowerCase())
        );
        
        const grid = document.getElementById('gamesGrid');
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="no-results">No games found</div>';
        } else {
            grid.innerHTML = filtered.map(game => window.gameVault.createGameCard(game)).join('');
        }
    }
    
    setupPagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageNumbers = document.getElementById('pageNumbers');
        
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadGames();
                this.updatePagination();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadGames();
                this.updatePagination();
            }
        });
        
        this.updatePagination();
    }
    
    updatePagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageNumbers = document.getElementById('pageNumbers');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
        
        let html = '';
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === 1 || i === this.totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `<button class="page-number ${i === this.currentPage ? 'active' : ''}" onclick="gamesListing.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span>...</span>';
            }
        }
        pageNumbers.innerHTML = html;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.loadGames();
        this.updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize
let gamesListing;
document.addEventListener('DOMContentLoaded', () => {
    gamesListing = new GamesListing();
});
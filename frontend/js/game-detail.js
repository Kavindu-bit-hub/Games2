class GameDetail {
    constructor() {
        this.gameId = new URLSearchParams(window.location.search).get('id');
        this.init();
    }
    
    init() {
        this.loadGameDetails();
        this.setupGallery();
        this.setupReviews();
        this.setup3DPreview();
    }
    
    loadGameDetails() {
        // Load game data based on ID
        console.log('Loading game:', this.gameId);
    }
    
    setupGallery() {
        const mainImage = document.querySelector('.screenshot-main img');
        const thumbnails = document.querySelectorAll('.screenshot-thumbnails img');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImage.src = thumb.src.replace('200x112', '800x450');
            });
        });
    }
    
    setupReviews() {
        const stars = document.querySelectorAll('.star-rating-input .star');
        let selectedRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i < selectedRating);
                });
            });
            
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    s.style.color = i <= index ? 'var(--warning)' : '';
                });
            });
        });
        
        document.querySelector('.star-rating-input').addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                s.style.color = i < selectedRating ? 'var(--warning)' : '';
            });
        });
        
        document.getElementById('submitReview').addEventListener('click', () => {
            const text = document.getElementById('reviewInput').value;
            if (!selectedRating || !text.trim()) {
                window.gameVault.showNotification('Please provide rating and review text', 'error');
                return;
            }
            
            // Submit review
            window.gameVault.showNotification('Review submitted successfully!', 'success');
            document.getElementById('reviewInput').value = '';
            stars.forEach(s => s.classList.remove('active'));
            selectedRating = 0;
        });
    }
    
    setup3DPreview() {
        const container = document.getElementById('gamePreview3d');
        if (!container) return;
        
        // Simple 3D tilt effect
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            container.style.transform = `
                perspective(1000px)
                rotateY(${x * 20}deg)
                rotateX(${-y * 20}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new GameDetail();
});
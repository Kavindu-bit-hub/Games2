class UploadManager {
    constructor() {
        this.form = document.getElementById('uploadForm');
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('gameFile');
        this.tags = [];
        this.init();
    }
    
    init() {
        this.setupDragDrop();
        this.setupTags();
        this.setupThumbnail();
        this.setupForm();
    }
    
    setupDragDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => {
                this.dropZone.classList.add('dragover');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => {
                this.dropZone.classList.remove('dragover');
            });
        });
        
        this.dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length) this.handleFile(files[0]);
        });
        
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) this.handleFile(e.target.files[0]);
        });
    }
    
    handleFile(file) {
        const maxSize = 500 * 1024 * 1024; // 500MB
        
        if (file.size > maxSize) {
            this.showNotification('File too large. Max 500MB allowed.', 'error');
            return;
        }
        
        const allowedTypes = ['.zip', '.rar', '.exe', '.dmg', '.apk'];
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(ext)) {
            this.showNotification('Invalid file type. Only ZIP, RAR, EXE, DMG, APK allowed.', 'error');
            return;
        }
        
        this.selectedFile = file;
        this.showFileInfo(file);
        this.simulateUpload();
    }
    
    showFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.hidden = false;
        fileInfo.querySelector('.file-name').textContent = file.name;
        fileInfo.querySelector('.file-size').textContent = this.formatFileSize(file.size);
        
        document.getElementById('removeFile').addEventListener('click', () => {
            this.selectedFile = null;
            fileInfo.hidden = true;
            this.fileInput.value = '';
        });
    }
    
    simulateUpload() {
        const progressContainer = document.getElementById('uploadProgress');
        const progressCircle = document.getElementById('progressCircle');
        const progressText = document.getElementById('progressText');
        
        progressContainer.hidden = false;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.hidden = true;
                }, 500);
            }
            
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (progress / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            progressText.textContent = Math.floor(progress) + '%';
        }, 200);
    }
    
    setupTags() {
        const input = document.getElementById('tagInput');
        const list = document.getElementById('tagsList');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = input.value.trim();
                if (tag && !this.tags.includes(tag) && this.tags.length < 10) {
                    this.tags.push(tag);
                    this.renderTags();
                    input.value = '';
                }
            }
        });
    }
    
    renderTags() {
        const list = document.getElementById('tagsList');
        list.innerHTML = this.tags.map(tag => `
            <span class="tag">
                ${tag}
                <span class="remove" onclick="uploadManager.removeTag('${tag}')">×</span>
            </span>
        `).join('');
    }
    
    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
        this.renderTags();
    }
    
    setupThumbnail() {
        const upload = document.getElementById('thumbnailUpload');
        const input = document.getElementById('thumbnailFile');
        const preview = document.getElementById('thumbnailPreview');
        
        upload.addEventListener('click', () => input.click());
        
        input.addEventListener('change', (e) => {
            if (e.target.files.length) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    preview.innerHTML = `<img src="${event.target.result}" alt="Thumbnail">`;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
    
    setupForm() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.selectedFile) {
                this.showNotification('Please select a game file', 'error');
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const loader = submitBtn.querySelector('.btn-loader');
            const text = submitBtn.querySelector('span');
            
            submitBtn.disabled = true;
            loader.hidden = false;
            text.textContent = 'Uploading...';
            
            try {
                const formData = new FormData(this.form);
                formData.append('gameFile', this.selectedFile);
                formData.append('tags', JSON.stringify(this.tags));
                
                // Replace with actual API endpoint
                // const response = await fetch('http://localhost:8080/api/games/upload', {
                //     method: 'POST',
                //     body: formData,
                //     headers: {
                //         'Authorization': `Bearer ${localStorage.getItem('token')}`
                //     }
                // });
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.showNotification('Game uploaded successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'games.html';
                }, 1500);
                
            } catch (error) {
                this.showNotification('Upload failed. Please try again.', 'error');
                submitBtn.disabled = false;
                loader.hidden = true;
                text.textContent = 'Publish Game';
            }
        });
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    showNotification(message, type) {
        window.gameVault?.showNotification(message, type);
    }
}

// Initialize
let uploadManager;
document.addEventListener('DOMContentLoaded', () => {
    uploadManager = new UploadManager();
});
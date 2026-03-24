// Three.js Interactive Background
class GameVaultBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.particles = [];
        this.geometries = [];
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Camera position
        this.camera.position.z = 30;
        
        // Create floating geometries
        this.createFloatingShapes();
        this.createParticles();
        this.createConnections();
        
        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Start animation
        this.animate();
    }
    
    createFloatingShapes() {
        const geometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.BoxGeometry(1.2, 1.2, 1.2)
        ];
        
        const colors = [0x00d4ff, 0xff006e, 0x8338ec, 0x06ffa5, 0xffbe0b];
        
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.2,
                shininess: 100,
                transparent: true,
                opacity: 0.8,
                wireframe: Math.random() > 0.5
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 50;
            mesh.position.y = (Math.random() - 0.5) * 50;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // Store initial data for animation
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.5 + 0.5,
                floatOffset: Math.random() * Math.PI * 2,
                originalY: mesh.position.y
            };
            
            this.scene.add(mesh);
            this.geometries.push(mesh);
        }
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 100);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff006e, 1, 100);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);
    }
    
    createParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const colorPalette = [
            new THREE.Color(0x00d4ff),
            new THREE.Color(0xff006e),
            new THREE.Color(0x8338ec)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles = particles;
    }
    
    createConnections() {
        // Create lines connecting nearby shapes
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.1
        });
        
        this.connections = new THREE.Group();
        this.scene.add(this.connections);
    }
    
    updateConnections() {
        // Remove old connections
        while(this.connections.children.length > 0) {
            this.connections.remove(this.connections.children[0]);
        }
        
        // Draw new connections
        const maxDistance = 15;
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.15
        });
        
        for (let i = 0; i < this.geometries.length; i++) {
            for (let j = i + 1; j < this.geometries.length; j++) {
                const distance = this.geometries[i].position.distanceTo(this.geometries[j].position);
                
                if (distance < maxDistance) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        this.geometries[i].position,
                        this.geometries[j].position
                    ]);
                    const line = new THREE.Line(geometry, lineMaterial);
                    this.connections.add(line);
                }
            }
        }
    }
    
    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Animate geometries
        this.geometries.forEach((mesh, i) => {
            // Rotation
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            
            // Floating motion
            mesh.position.y = mesh.userData.originalY + 
                Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 2;
            
            // Mouse interaction (parallax)
            const parallaxFactor = 0.5 + (i % 3) * 0.3;
            mesh.position.x += (this.mouse.x * parallaxFactor - mesh.position.x * 0.01) * 0.01;
        });
        
        // Animate particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            this.particles.rotation.x = Math.sin(time * 0.1) * 0.1;
        }
        
        // Update connections every 10 frames for performance
        if (Math.floor(time * 60) % 10 === 0) {
            this.updateConnections();
        }
        
        // Camera parallax
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameVaultBackground();
});
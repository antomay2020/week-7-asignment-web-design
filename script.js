WEEK 7 ASIGNMENT WEEB
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS3 & JavaScript Animation Showcase</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            color: white;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .container {
            max-width: 1200px;
            width: 100%;
            SCRtext-align: center;
            z-index: 10;
        }

        h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        p {
            font-size: 1.2rem;
            max-width: 800px;
            margin: 0 auto 30px;
            line-height: 1.6;
        }

        .controls {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin: 30px 0;
        }

        button {
            padding: 12px 25px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        button:active {
            transform: translateY(1px);
        }

        .canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.7;
        }

        .stats {
            background: rgba(0, 0, 0, 0.2);
            padding: 15px 25px;
            border-radius: 10px;
            margin-top: 20px;
            backdrop-filter: blur(5px);
        }

        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
            backdrop-filter: blur(5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transform: perspective(1000px) rotateX(5deg);
            transition: transform 0.5s ease;
        }

        .feature:hover {
            transform: perspective(1000px) rotateX(0deg);
        }

        @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            p { font-size: 1rem; }
            .controls { flex-direction: column; align-items: center; }
            button { width: 80%; margin-bottom: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Interactive Animation Showcase</h1>
        <p>Experience the power of CSS3 animations combined with JavaScript interactivity. Click anywhere or use the controls below to manipulate the particle system.</p>
        
        <div class="controls">
            <button id="moreParticles">More Particles</button>
            <button id="changeColor">Change Colors</button>
            <button id="toggleSpin">Toggle Spin</button>
            <button id="explosion">Explosion Effect</button>
            <button id="reset">Reset All</button>
        </div>
        
        <div class="feature">
            <h2>Real-time Interaction</h2>
            <p>Move your mouse to influence particle movement. Click to create ripple effects.</p>
        </div>
        
        <div class="stats">
            <p>Particle Count: <span id="particleCount">0</span> | FPS: <span id="fps">0</span></p>
        </div>
    </div>

    <div class="canvas" id="canvas"></div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const canvas = document.getElementById('canvas');
            let particles = [];
            let particleId = 0;
            let spinning = true;
            let colorScheme = 0;
            let mouseX = 0;
            let mouseY = 0;
            let fps = 0;
            let lastTime = performance.now();
            let frameCount = 0;
            
            // Color schemes
            const colorSchemes = [
                ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE'],
                ['#1DE9B6', '#1DC4E9', '#A389D4', '#899FD4', '#FEA47F'],
                ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'],
                ['#4CAF50', '#FFEB3B', '#FF9800', '#FF5722', '#795548']
            ];
            
            // Create initial particles
            for (let i = 0; i < 50; i++) {
                createParticle();
            }
            
            // Mouse tracking
            document.addEventListener('mousemove', function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            // Click effect - ripple
            document.addEventListener('click', function(e) {
                createRipple(e.clientX, e.clientY);
                for (let i = 0; i < 20; i++) {
                    createParticle(e.clientX, e.clientY);
                }
            });
            
            // Button event handlers
            document.getElementById('moreParticles').addEventListener('click', function() {
                for (let i = 0; i < 30; i++) {
                    createParticle();
                }
            });
            
            document.getElementById('changeColor').addEventListener('click', function() {
                colorScheme = (colorScheme + 1) % colorSchemes.length;
                particles.forEach(p => {
                    p.color = getRandomColor();
                    p.el.style.backgroundColor = p.color;
                });
            });
            
            document.getElementById('toggleSpin').addEventListener('click', function() {
                spinning = !spinning;
                particles.forEach(p => {
                    p.spinning = spinning;
                });
            });
            
            document.getElementById('explosion').addEventListener('click', function() {
                // Create explosion from center
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                
                for (let i = 0; i < 100; i++) {
                    createParticle(centerX, centerY, true);
                }
            });
            
            document.getElementById('reset').addEventListener('click', function() {
                // Remove all particles
                particles.forEach(p => {
                    p.el.remove();
                });
                particles = [];
                
                // Create new ones
                for (let i = 0; i < 50; i++) {
                    createParticle();
                }
                
                // Reset color scheme
                colorScheme = 0;
                spinning = true;
            });
            
            // Create a single particle
            function createParticle(x, y, explosive = false) {
                const size = Math.random() * 20 + 5;
                
                if (x === undefined || y === undefined) {
                    x = Math.random() * window.innerWidth;
                    y = Math.random() * window.innerHeight;
                }
                
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                
                const color = getRandomColor();
                particle.style.backgroundColor = color;
                
                // Add initial animation
                particle.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                
                canvas.appendChild(particle);
                
                // Store particle data
                particles.push({
                    id: particleId++,
                    el: particle,
                    x: x,
                    y: y,
                    size: size,
                    color: color,
                    speedX: (Math.random() - 0.5) * (explosive ? 10 : 2),
                    speedY: (Math.random() - 0.5) * (explosive ? 10 : 2),
                    angle: 0,
                    spinSpeed: (Math.random() - 0.5) * 0.05,
                    spinning: spinning,
                    life: 1, // For fade effect
                    update: function() {
                        // Apply speeds
                        this.x += this.speedX;
                        this.y += this.speedY;
                        
                        // Apply mouse influence
                        const dx = this.x - mouseX;
                        const dy = this.y - mouseY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 150) {
                            this.speedX += dx / distance * 0.2;
                            this.speedY += dy / distance * 0.2;
                        }
                        
                        // Apply gravity and damping
                        this.speedY += 0.05;
                        this.speedX *= 0.99;
                        this.speedY *= 0.99;
                        
                        // Handle spinning
                        if (this.spinning) {
                            this.angle += this.spinSpeed;
                        }
                        
                        // Handle boundaries
                        if (this.x < -this.size || this.x > window.innerWidth + this.size ||
                            this.y < -this.size || this.y > window.innerHeight + this.size) {
                            // Reset to a random position
                            this.x = Math.random() * window.innerWidth;
                            this.y = Math.random() * window.innerHeight;
                            this.speedX = (Math.random() - 0.5) * 2;
                            this.speedY = (Math.random() - 0.5) * 2;
                        }
                        
                        // Update element
                        this.el.style.transform = `translate(${this.x - this.size/2}px, ${this.y - this.size/2}px) rotate(${this.angle}rad)`;
                    }
                });
                
                updateParticleCount();
            }
            
            // Create ripple effect
            function createRipple(x, y) {
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.width = '0px';
                ripple.style.height = '0px';
                ripple.style.border = '2px solid rgba(255, 255, 255, 0.5)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'translate(-50%, -50%)';
                ripple.style.transition = 'all 0.8s ease-out';
                
                document.body.appendChild(ripple);
                
                // Animate the ripple
                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                    ripple.style.opacity = '0';
                }, 10);
                
                // Remove after animation
                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            }
            
            // Get random color from current scheme
            function getRandomColor() {
                const scheme = colorSchemes[colorScheme];
                return scheme[Math.floor(Math.random() * scheme.length)];
            }
            
            // Update particle count display
            function updateParticleCount() {
                document.getElementById('particleCount').textContent = particles.length;
            }
            
            // Animation loop
            function animate() {
                // Calculate FPS
                frameCount++;
                const currentTime = performance.now();
                if (currentTime - lastTime >= 1000) {
                    fps = frameCount;
                    frameCount = 0;
                    lastTime = currentTime;
                    document.getElementById('fps').textContent = fps;
                }
                
                // Update all particles
                particles.forEach(particle => {
                    particle.update();
                });
                
                requestAnimationFrame(animate);
            }
            
            // Start animation
            animate();
            
            // Handle window resize
            window.addEventListener('resize', function() {
                particles.forEach(p => {
                    if (p.x > window.innerWidth) p.x = window.innerWidth;
                    if (p.y > window.innerHeight) p.y = window.innerHeight;
                });
            });
        });
    </script>
</body>
</html>

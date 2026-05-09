import React, { useEffect, useRef } from 'react';

const FiberOpticBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const lines = [];
        const lineCount = 15;
        const colors = ['#0ea5e9', '#22d3ee', '#2dd4bf', '#3b82f6'];

        class Line {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = -100;
                this.y = Math.random() * height;
                this.length = Math.random() * (width * 0.8) + 200;
                this.speed = Math.random() * 0.5 + 0.2;
                this.amplitude = Math.random() * 50 + 20;
                this.frequency = Math.random() * 0.005 + 0.002;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.3 + 0.1;
                this.thickness = Math.random() * 1.5 + 0.5;
                this.particles = [];
                for (let i = 0; i < 3; i++) {
                    this.particles.push({
                        pos: Math.random(),
                        speed: Math.random() * 0.002 + 0.001
                    });
                }
            }

            draw() {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.lineWidth = this.thickness;
                ctx.lineCap = 'round';

                let prevX = this.x;
                let prevY = this.y;

                for (let i = 0; i < this.length; i += 5) {
                    const currentX = this.x + i;
                    const currentY = this.y + Math.sin(currentX * this.frequency) * this.amplitude;

                    if (i === 0) ctx.moveTo(currentX, currentY);
                    else ctx.lineTo(currentX, currentY);
                }
                ctx.stroke();

                // Draw traveling particles
                this.particles.forEach(p => {
                    const px = this.x + p.pos * this.length;
                    const py = this.y + Math.sin(px * this.frequency) * this.amplitude;

                    ctx.globalAlpha = this.opacity + 0.4;
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fill();

                    // Glow for particle
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = this.color;

                    p.pos += p.speed;
                    if (p.pos > 1) p.pos = 0;
                });

                this.x += this.speed;
                if (this.x > width) this.reset();
            }
        }

        for (let i = 0; i < lineCount; i++) {
            lines.push(new Line());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.shadowBlur = 0; // Reset shadow for lines
            lines.forEach(line => line.draw());
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            lines.forEach(l => l.reset());
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.7,
                maskImage: 'radial-gradient(circle at 70% 50%, black, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at 70% 50%, black, transparent 70%)'
            }}
        />
    );
};

export default FiberOpticBackground;

import React, { useEffect, useRef } from 'react';

export const BackgroundWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: { x: number; y: number; life: number }[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let lastMouse = { x: -1, y: -1 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      if (lastMouse.x !== -1 && lastMouse.y !== -1) {
        const dx = x - lastMouse.x;
        const dy = y - lastMouse.y;
        const dist = Math.hypot(dx, dy);
        // Interpolate points so the wave doesn't look like dotted circles if you move fast
        const steps = Math.max(1, Math.floor(dist / 20)); 
        for (let i = 0; i < steps; i++) {
          points.push({
            x: lastMouse.x + dx * (i / steps),
            y: lastMouse.y + dy * (i / steps),
            life: 1.0,
          });
        }
      }
      points.push({ x, y, life: 1.0 });
      lastMouse.x = x;
      lastMouse.y = y;
    };
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.life -= 0.02; // Faster cooling

        if (p.life <= 0) {
          points.splice(i, 1);
          i--;
          continue;
        }

        // Taper the radius heavily so it looks like a dissolving tail
        const radius = 80 * Math.pow(p.life, 1.2); 
        if (radius <= 0.1) continue;

        // Calculate infrared heat color based on temperature (life)
        let r, g, b;
        if (p.life > 0.5) {
          // Hot: Yellow -> Red (life from 0.5 to 1.0)
          const ratio = (p.life - 0.5) * 2; // 0.0 to 1.0
          r = 255;
          g = Math.floor(255 - (ratio * 200)); // 255 down to 55
          b = 50;
        } else {
          // Cooling: Green -> Yellow (life from 0.0 to 0.5)
          const ratio = p.life * 2; // 0.0 to 1.0
          r = Math.floor(50 + (ratio * 205)); // 50 up to 255
          g = 255;
          b = 50;
        }

        // Lower alpha to fix "too bright" issue
        const alpha = 0.25 * p.life;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.globalCompositeOperation = 'source-over'; // No 'lighter' to avoid blown out whites
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

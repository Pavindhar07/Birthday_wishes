import React, { useEffect, useRef } from 'react';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  flicker: boolean;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: { x: number; y: number }[];
  exploded: boolean;
}

interface FireworksCanvasProps {
  isActive: boolean;
  durationSeconds?: number;
}

const PALETTES = [
  ['#ffd700', '#ffea79', '#ff9900', '#fff8dc'], // Royal Gold & Champagne
  ['#ff4d6d', '#c9184a', '#ff758f', '#ffb3c1'], // Rose Pink & Crimson
  ['#d4af37', '#8b1538', '#f5ecd9', '#ffffff'], // Velvet Burgundy & Pearl
  ['#00f5d4', '#7b2cbf', '#9d4edd', '#e0aaff'], // Violet Starlight
  ['#ffb703', '#fb8500', '#ff006e', '#8338ec'], // Vibrant Fiesta
  ['#ffffff', '#fdf0d5', '#e9d8a6', '#ee9b00'], // Golden Willow
];

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  isActive,
  durationSeconds = 6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const rockets: Rocket[] = [];
    const particles: FireworkParticle[] = [];

    const startTime = Date.now();
    const endTime = startTime + durationSeconds * 1000;
    let lastLaunchTime = 0;

    const createExplosion = (x: number, y: number, colorPalette: string[]) => {
      // Explode 45 - 80 sparkles
      const particleCount = 55 + Math.floor(Math.random() * 30);
      const mainColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          color,
          size: Math.random() * 2.5 + 1.2,
          flicker: Math.random() > 0.4,
          trail: [],
        });
      }

      // Add a central flash star burst
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * 7.5,
          vy: Math.sin(angle) * 7.5,
          alpha: 1,
          decay: 0.035,
          color: '#ffffff',
          size: 2,
          flicker: false,
          trail: [],
        });
      }
    };

    const launchRocket = (startX?: number, targetY?: number) => {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      // Keep rockets strictly on the sides and upper sky, leaving the center cake area completely clear
      const isLeft = Math.random() < 0.5;
      const defaultX = isLeft
        ? width * 0.04 + Math.random() * width * 0.20
        : width * 0.76 + Math.random() * width * 0.20;

      const x = startX ?? defaultX;
      // High sky burst above the card
      const tY = targetY ?? height * 0.08 + Math.random() * height * 0.20;
      const vy = -(Math.sqrt(2 * 0.16 * (height - tY)) + Math.random() * 1.5);
      const vx = isLeft ? Math.random() * 0.8 : -Math.random() * 0.8;

      rockets.push({
        x,
        y: height,
        targetY: tY,
        vx,
        vy,
        color: palette[0],
        trail: [],
        exploded: false,
      });
    };

    // Immediate initial cluster of fireworks on the left and right flanks
    launchRocket(width * 0.10, height * 0.14);
    launchRocket(width * 0.90, height * 0.14);
    launchRocket(width * 0.18, height * 0.20);
    launchRocket(width * 0.82, height * 0.20);

    const render = () => {
      // Semi-transparent clear creates dreamy light trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';

      const now = Date.now();

      // Launch periodic rockets while active
      if (now < endTime) {
        if (now - lastLaunchTime > 420) {
          launchRocket();
          if (Math.random() > 0.4) {
            setTimeout(() => launchRocket(), 120);
          }
          lastLaunchTime = now;
        }
      }

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 5) r.trail.shift();

        // Draw rocket trail
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        for (let t = r.trail.length - 1; t >= 0; t--) {
          ctx.lineTo(r.trail[t].x, r.trail[t].y);
        }
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Move rocket
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.08; // Gravity on rocket

        // Check if rocket reached apex
        if (r.vy >= -0.5 || r.y <= r.targetY) {
          const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
          createExplosion(r.x, r.y, palette);
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.shift();

        // Draw particle trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        for (let t = p.trail.length - 1; t >= 0; t--) {
          ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = p.size;
        ctx.stroke();

        // Draw head spark
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = p.flicker && Math.random() > 0.5 ? '#ffffff' : p.color;
        ctx.fill();

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Air resistance
        p.vy *= 0.96;
        p.vy += 0.07; // Gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height) {
          particles.splice(i, 1);
        }
      }

      // Continue animating if rockets or particles remain, or still in active window
      if (now < endTime || rockets.length > 0 || particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, durationSeconds]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

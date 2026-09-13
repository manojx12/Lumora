import { useEffect, useRef } from 'react';
import { LIQUID } from '../../lib/constants';
import { computeCoverRect } from '../../lib/cover';

interface LiquidRevealProps {
  /** Always-visible base image, and the page's LCP element. */
  beforeSrc: string;
  /** Painted along the cursor trail. */
  afterSrc: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Before/after photo with a liquid cursor reveal.
 *
 * The base image is a plain `<img>` so it can be discovered and prioritised by
 * the browser. The second image is stamped onto a canvas along the pointer
 * trail with a soft radial brush, and the whole trail decays every frame —
 * quickly once the pointer stops moving.
 */
export function LiquidReveal({ beforeSrc, afterSrc, className = '' }: LiquidRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, LIQUID.maxDpr);
    const radius = LIQUID.brushRadius * dpr;
    const diameter = Math.ceil(radius * 2);
    const half = diameter / 2;

    // Offscreen copy of the reveal image at canvas resolution, pre-fitted with
    // cover geometry so each stamp is a straight sub-rectangle blit.
    const cover = document.createElement('canvas');
    const coverCtx = cover.getContext('2d');
    // Soft round brush; the stamp is masked to the image through `source-in`.
    const brush = document.createElement('canvas');
    brush.width = diameter;
    brush.height = diameter;
    const brushCtx = brush.getContext('2d');
    if (!coverCtx || !brushCtx) return;

    let width = 0;
    let height = 0;
    let imageLoaded = false;
    let points: Point[] = [];
    let last: Point | null = null;
    let idle = 0;
    let frame = 0;

    const image = new Image();
    image.crossOrigin = 'anonymous';

    const drawCover = () => {
      if (!imageLoaded || !width || !height) return;
      coverCtx.clearRect(0, 0, width, height);
      const { dx, dy, dw, dh } = computeCoverRect(
        image.naturalWidth,
        image.naturalHeight,
        width,
        height,
      );
      coverCtx.drawImage(image, dx, dy, dw, dh);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width * dpr));
      const nextHeight = Math.max(1, Math.round(rect.height * dpr));
      if (nextWidth === width && nextHeight === height) return;

      width = nextWidth;
      height = nextHeight;
      canvas.width = width;
      canvas.height = height;
      cover.width = width;
      cover.height = height;
      points = [];
      last = null;
      drawCover();
    };

    image.onload = () => {
      imageLoaded = true;
      drawCover();
    };
    image.src = afterSrc;

    const handlePointerMove = (event: PointerEvent) => {
      if (!width || !height) return;
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) * dpr;
      const y = (event.clientY - rect.top) * dpr;

      // Ignore movement well outside the canvas, and break the trail so the
      // pointer does not draw a straight line back in on re-entry.
      if (x < -radius || y < -radius || x > width + radius || y > height + radius) {
        last = null;
        return;
      }

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const distance = Math.hypot(dx, dy);
        const step = Math.max(radius * LIQUID.stepRatio, 1);
        const count = Math.min(Math.ceil(distance / step), LIQUID.maxInterpolatedPoints);
        for (let i = 1; i <= count; i += 1) {
          points.push({ x: last.x + dx * (i / count), y: last.y + dy * (i / count) });
        }
      } else {
        points.push({ x, y });
      }

      last = { x, y };
    };

    const stamp = (x: number, y: number) => {
      brushCtx.globalCompositeOperation = 'source-over';
      brushCtx.clearRect(0, 0, diameter, diameter);

      const gradient = brushCtx.createRadialGradient(half, half, 0, half, half, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.55, 'rgba(255,255,255,0.82)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      brushCtx.fillStyle = gradient;
      brushCtx.fillRect(0, 0, diameter, diameter);

      brushCtx.globalCompositeOperation = 'source-in';
      brushCtx.drawImage(cover, x - half, y - half, diameter, diameter, 0, 0, diameter, diameter);

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(brush, x - half, y - half);
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!width || !height) return;

      const drawing = points.length > 0;
      if (drawing) {
        idle = 0;
      } else {
        idle += 1;
        if (idle > LIQUID.fadeFrames) return;
      }

      // Fade the existing trail; the longer the pointer rests, the faster.
      const fade = drawing
        ? LIQUID.decay
        : Math.min(LIQUID.decay + idle * LIQUID.idleFadeRamp, LIQUID.idleFadeCap);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, width, height);

      if (drawing) {
        for (const point of points) stamp(point.x, point.y);
        points = [];
      } else if (idle === LIQUID.fadeFrames) {
        // Hard clear so no faint residue lingers once the trail is spent.
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, width, height);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [afterSrc]);

  return (
    <div ref={containerRef} aria-hidden="true" className={className}>
      <img
        src={beforeSrc}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      <canvas
        ref={canvasRef}
        data-testid="liquid-canvas"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";

interface Stroke {
  pts: [number, number][];
  len: number;
  startCum: number;
  endCum: number;
}

interface StrokeData {
  w: number;
  h: number;
  totalLen: number;
  strokes: Stroke[];
}

interface LineDrawingFigureProps {
  strokeDataUrl: string;
  fallbackImg: string;
  alt: string;
  isDrawing: boolean;
  isDrawn: boolean;
  className?: string;
  duration?: number;
}

export default function LineDrawingFigure({
  strokeDataUrl,
  fallbackImg,
  alt,
  isDrawing,
  isDrawn,
  className = "",
  duration = 2000,
}: LineDrawingFigureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeDataRef = useRef<StrokeData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Pre-fetch stroke data
  useEffect(() => {
    let active = true;
    fetch(strokeDataUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${strokeDataUrl}`);
        return res.json();
      })
      .then((data: StrokeData) => {
        if (!active) return;
        strokeDataRef.current = data;
        setDataLoaded(true);
      })
      .catch((err) => {
        console.warn("Falling back to static line art:", err);
      });

    return () => {
      active = false;
    };
  }, [strokeDataUrl]);

  // Main drawing animation loop
  useEffect(() => {
    if (!dataLoaded || !strokeDataRef.current) return;

    // Reset when not drawing yet
    if (!isDrawing) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      startTimeRef.current = null;
      setAnimProgress(0);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    // If already fully drawn
    if (isDrawn) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setAnimProgress(1);
      drawToCanvas(1);
      return;
    }

    // Animation running from 0 to 1
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawT = Math.min(1, elapsed / duration);
      // Smooth sinusoidal ease-in-out: starts gently, maintains steady organic drawing speed, gently settles
      const easeT = -(Math.cos(Math.PI * rawT) - 1) / 2;

      drawToCanvas(easeT, timestamp);
      setAnimProgress(easeT);

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDrawing, isDrawn, dataLoaded, duration]);

  // Canvas drawing routine
  const drawToCanvas = (progress: number, timestamp?: number) => {
    const canvas = canvasRef.current;
    const data = strokeDataRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (progress <= 0) return;

    const targetDist = progress * data.totalLen;

    // Warm Antique Royal Gold Palette
    ctx.strokeStyle = "rgba(206, 178, 122, 0.82)";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(212, 175, 55, 0.25)";
    ctx.shadowBlur = 2.5;

    let tipX: number | null = null;
    let tipY: number | null = null;

    for (let i = 0; i < data.strokes.length; i++) {
      const s = data.strokes[i];
      if (targetDist < s.startCum) {
        break; // Stroke hasn't started yet
      }

      const pts = s.pts;
      if (pts.length < 2) continue;

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);

      if (targetDist >= s.endCum) {
        // Full stroke drawn
        for (let j = 1; j < pts.length; j++) {
          ctx.lineTo(pts[j][0], pts[j][1]);
        }
        ctx.stroke();
        tipX = pts[pts.length - 1][0];
        tipY = pts[pts.length - 1][1];
      } else {
        // Partial stroke in progress
        const partialDist = targetDist - s.startCum;
        let accum = 0;
        let lastPt = pts[0];

        for (let j = 1; j < pts.length; j++) {
          const dx = pts[j][0] - pts[j - 1][0];
          const dy = pts[j][1] - pts[j - 1][1];
          const segLen = Math.hypot(dx, dy);

          if (accum + segLen >= partialDist) {
            const frac = segLen > 0 ? (partialDist - accum) / segLen : 0;
            const interX = pts[j - 1][0] + dx * frac;
            const interY = pts[j - 1][1] + dy * frac;
            ctx.lineTo(interX, interY);
            tipX = interX;
            tipY = interY;
            break;
          } else {
            ctx.lineTo(pts[j][0], pts[j][1]);
            accum += segLen;
            lastPt = pts[j];
          }
        }
        ctx.stroke();
        break; // We're at the active drawing front
      }
    }

    // Draw active drawing pen spark / golden pencil tip
    if (tipX !== null && tipY !== null && progress < 0.99) {
      // Radiant golden aura around pen tip
      const glowGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 16);
      glowGrad.addColorStop(0, "rgba(255, 245, 190, 0.95)");
      glowGrad.addColorStop(0.35, "rgba(235, 195, 100, 0.5)");
      glowGrad.addColorStop(1, "rgba(212, 175, 55, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Sharp bright core
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Delicate trailing micro sparkles
      if (timestamp) {
        const tSec = timestamp * 0.005;
        const spark1X = tipX + Math.sin(tSec) * 7;
        const spark1Y = tipY + Math.cos(tSec) * 7;
        ctx.fillStyle = "rgba(255, 235, 150, 0.7)";
        ctx.beginPath();
        ctx.arc(spark1X, spark1Y, 1.3, 0, Math.PI * 2);
        ctx.fill();

        const spark2X = tipX - Math.cos(tSec * 1.3) * 10;
        const spark2Y = tipY - Math.sin(tSec * 1.3) * 10;
        ctx.fillStyle = "rgba(255, 215, 100, 0.5)";
        ctx.beginPath();
        ctx.arc(spark2X, spark2Y, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  return (
    <div className={`line-drawing-wrapper ${className}`}>
      {/* Dynamic Hand-Drawing HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={848}
        height={1264}
        className={`line-drawing-canvas ${animProgress > 0 ? "active" : ""}`}
        aria-hidden="true"
      />

      {/* Pristine high-fidelity outline image that smoothly cross-fades in once drawing completes */}
      <img
        src={fallbackImg}
        alt={alt}
        className={`line-drawing-final ${isDrawn ? "visible" : ""}`}
        loading="eager"
      />
    </div>
  );
}

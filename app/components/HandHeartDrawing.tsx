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

interface HandHeartDrawingProps {
  isDrawing: boolean;
  isDrawn: boolean;
  duration?: number;
  onExplore?: () => void;
}

export default function HandHeartDrawing({
  isDrawing,
  isDrawn,
  duration = 3200,
  onExplore,
}: HandHeartDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeDataRef = useRef<StrokeData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Pre-fetch hand heart stroke data
  useEffect(() => {
    let active = true;
    fetch("/strokes/hand_heart_strokes.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load hand_heart_strokes.json");
        return res.json();
      })
      .then((data: StrokeData) => {
        if (!active) return;
        strokeDataRef.current = data;
        setDataLoaded(true);
      })
      .catch((err) => {
        console.warn("Error loading hand heart strokes:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Drawing animation loop
  useEffect(() => {
    if (!dataLoaded || !strokeDataRef.current) return;

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

    if (isDrawn) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setAnimProgress(1);
      drawToCanvas(1);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawT = Math.min(1, elapsed / duration);
      // Smooth sinusoidal ease-in-out
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

    // Glowing warm gold line style (matching groom and bride preloader)
    ctx.strokeStyle = "rgba(225, 182, 105, 0.92)";
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(255, 215, 0, 0.4)";
    ctx.shadowBlur = 4;

    let tipX: number | null = null;
    let tipY: number | null = null;

    for (let i = 0; i < data.strokes.length; i++) {
      const s = data.strokes[i];
      if (targetDist < s.startCum) {
        break;
      }

      const pts = s.pts;
      if (pts.length < 2) continue;

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);

      if (targetDist >= s.endCum) {
        for (let j = 1; j < pts.length; j++) {
          ctx.lineTo(pts[j][0], pts[j][1]);
        }
        ctx.stroke();
        tipX = pts[pts.length - 1][0];
        tipY = pts[pts.length - 1][1];
      } else {
        const partialDist = targetDist - s.startCum;
        let accum = 0;

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
          }
        }
        ctx.stroke();
        break;
      }
    }

    // Glowing golden pencil spark
    if (tipX !== null && tipY !== null && progress < 0.99) {
      const glowGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18);
      glowGrad.addColorStop(0, "rgba(255, 245, 190, 0.95)");
      glowGrad.addColorStop(0.35, "rgba(235, 195, 100, 0.55)");
      glowGrad.addColorStop(1, "rgba(212, 175, 55, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Sharp white sparkle center
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2.6, 0, Math.PI * 2);
      ctx.fill();

      if (timestamp) {
        const tSec = timestamp * 0.005;
        const spark1X = tipX + Math.sin(tSec) * 8;
        const spark1Y = tipY + Math.cos(tSec) * 8;
        ctx.fillStyle = "rgba(255, 235, 150, 0.75)";
        ctx.beginPath();
        ctx.arc(spark1X, spark1Y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  return (
    <div
      className="hand-heart-container"
      onClick={onExplore}
      role="button"
      tabIndex={0}
      aria-label="Wedding Date: November 26, 2026. Click to explore wedding invitation."
    >
      {/* Dynamic Hand-Drawing HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={1024}
        height={770}
        className={`hand-heart-canvas ${animProgress > 0 ? "active" : ""}`}
        aria-hidden="true"
      />

      {/* The Date Nestled Inside the Hand Heart Opening */}
      <div
        className={`date-inside-heart ${
          animProgress > 0.4 || isDrawn ? "visible" : ""
        }`}
      >
        <div className="heart-date-number-row">
          <span className="heart-date-number">26</span>
        </div>
        <span className="heart-date-day">THURSDAY</span>
        <span className="heart-date-month">NOVEMBER 2026</span>
      </div>
    </div>
  );
}

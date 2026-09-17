"use client";

import React, { useEffect, useState, useRef, useId } from "react";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import LineDrawingFigure from "./LineDrawingFigure";

interface PreloaderProps {
  onComplete?: () => void;
  isOpen?: boolean;
}

export default function GoldenPoruwaPreloader({ onComplete, isOpen = true }: PreloaderProps) {
  // Animation Phase States
  // 1: Bud appears
  // 2: Lotus blooms & line drawing starts
  // 3: Traditional gold patterns grow outward
  // 4: Line drawing finishes, typography appears: THE WEDDING OF THUSHARA & WADUSHA
  // 5: Ready / Unveiled
  const [phase, setPhase] = useState<number>(isOpen ? 1 : 0);
  const [unveiled, setUnveiled] = useState<boolean>(!isOpen);
  const [progress, setProgress] = useState<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique IDs for SVG gradients to avoid collision
  const uid = useId();
  const petalGradId = `petalGrad-${uid}`;
  const innerPetalGradId = `innerPetalGrad-${uid}`;
  const strokeGradId = `strokeGrad-${uid}`;
  const mandalaGradId = `mandalaGrad-${uid}`;
  const stamenGradId = `stamenGrad-${uid}`;

  // Sequential Timeline Orchestration
  useEffect(() => {
    if (!isOpen) {
      setUnveiled(true);
      return;
    }

    setUnveiled(false);
    setPhase(1); // Step 1: Tiny golden lotus appears

    const t2 = setTimeout(() => {
      setPhase(2); // Step 2: Lotus blooms & relaxed line-by-line drawing begins
    }, 400);

    const t3 = setTimeout(() => {
      setPhase(3); // Step 3: Traditional gold patterns grow outward
    }, 1500);

    const t4 = setTimeout(() => {
      setPhase(4); // Step 4: Line drawing gracefully completes, typography appears
    }, 4800);

    const t5 = setTimeout(() => {
      setPhase(5); // Step 5: Ready to open
    }, 5900);

    // Smooth auto-progress bar over 11.5 seconds total
    const startTime = Date.now();
    const duration = 11500;
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      }
    }, 50);

    // Auto-unveil at 11.8s if user hasn't clicked Enter
    const autoUnveil = setTimeout(() => {
      handleOpen();
    }, 11800);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(autoUnveil);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setUnveiled(true);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1200);
  };

  const handleSkip = () => {
    handleOpen();
  };

  if (!isOpen) {
    return null;
  }

  const isBlooming = phase >= 2;
  const showMandala = phase >= 3;
  const showText = phase >= 4;
  const isReady = phase >= 5;

  return (
    <aside
      className={`poruwa-preloader-root ${unveiled ? "unveiled" : ""}`}
      aria-label="Golden Poruwa Reveal Preloader"
      aria-live="polite"
      role="dialog"
      aria-modal="true"
    >
      {/* Ambient Lighting & Atmosphere */}
      <div className="poruwa-ambient-glow" />

      {/* Floating Gold Dust Particles */}
      <div className="poruwa-particles" aria-hidden="true">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="poruwa-particle"
            style={{
              top: `${12 + ((i * 17) % 76)}%`,
              left: `${8 + ((i * 23) % 84)}%`,
              animationDelay: `${(i * 0.45).toFixed(2)}s`,
              animationDuration: `${5.5 + (i % 4)}s`,
              transform: `scale(${0.6 + (i % 5) * 0.15})`,
            }}
          />
        ))}
      </div>

      {/* Skip Button */}
      <button
        type="button"
        className="poruwa-skip-btn"
        onClick={handleSkip}
        aria-label="Skip introduction animation"
      >
        Skip Reveal
      </button>

      {/* Groom Clean Golden Outline Line-Drawing — Left Flank */}
      <div className="poruwa-figure groom" aria-hidden="true">
        <div className="figure-draw-container">
          <LineDrawingFigure
            strokeDataUrl="/strokes/groom_strokes.json"
            fallbackImg="/images/groom_clean_outline.png"
            alt="Groom Thushara"
            isDrawing={phase >= 2}
            isDrawn={phase >= 4}
            duration={4200}
            className="figure-line-art"
          />
        </div>
      </div>

      {/* Bride Clean Golden Outline Line-Drawing — Right Flank */}
      <div className="poruwa-figure bride" aria-hidden="true">
        <div className="figure-draw-container">
          <LineDrawingFigure
            strokeDataUrl="/strokes/bride_strokes.json"
            fallbackImg="/images/bride_clean_outline.png"
            alt="Bride Wadusha"
            isDrawing={phase >= 2}
            isDrawn={phase >= 4}
            duration={4200}
            className="figure-line-art"
          />
        </div>
      </div>

      {/* Preloader Main Content Stage */}
      <div className="poruwa-stage">
        {/* ==================================================================
            Step 1, 2, 3: Lotus & Traditional Sri Lankan Mandala
            ================================================================== */}
        <div className="poruwa-lotus-wrapper">
          {/* Step 3: Traditional LK Gold Patterns (Liya Wela / Radial Mandala) */}
          <svg
            className={`poruwa-mandala-svg ${showMandala ? "active" : ""}`}
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={mandalaGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff2af" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#f7d377" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#966b14" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Concentric Traditional Lankan Beaded Circles */}
            <circle cx="200" cy="200" r="185" stroke={`url(#${mandalaGradId})`} strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
            <circle cx="200" cy="200" r="165" stroke={`url(#${mandalaGradId})`} strokeWidth="1.5" opacity="0.75" />
            <circle cx="200" cy="200" r="145" stroke={`url(#${mandalaGradId})`} strokeWidth="0.8" strokeDasharray="6 6" opacity="0.7" />
            <circle cx="200" cy="200" r="120" stroke={`url(#${mandalaGradId})`} strokeWidth="1.2" opacity="0.85" />

            {/* 12 Symmetrical Traditional Sri Lankan Liya Wela Flourishes */}
            {[...Array(12)].map((_, idx) => {
              const angle = idx * 30;
              return (
                <g key={idx} transform={`rotate(${angle} 200 200)`}>
                  {/* Ornate Poruwa Crest Arch */}
                  <path
                    d="M200,35 C207,65 225,95 212,120 C207,110 193,110 188,120 C175,95 193,65 200,35 Z"
                    fill={`url(#${mandalaGradId})`}
                    fillOpacity="0.22"
                    stroke={`url(#${mandalaGradId})`}
                    strokeWidth="1.2"
                  />
                  {/* Liya Wela vine curl left */}
                  <path
                    d="M198,80 C180,85 170,95 168,110 C166,122 178,130 185,125 C190,121 188,112 182,112 C178,112 175,116 177,119"
                    stroke={`url(#${mandalaGradId})`}
                    strokeWidth="1"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Liya Wela vine curl right */}
                  <path
                    d="M202,80 C220,85 230,95 232,110 C234,122 222,130 215,125 C210,121 212,112 218,112 C222,112 225,116 223,119"
                    stroke={`url(#${mandalaGradId})`}
                    strokeWidth="1"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Outer Lotus Bead Tip */}
                  <circle cx="200" cy="22" r="3" fill="#ffeaa8" />
                  <circle cx="200" cy="35" r="1.5" fill="#d4af37" />
                </g>
              );
            })}
          </svg>

          {/* Golden Lotus SVG (Steps 1 & 2) */}
          <svg
            className="poruwa-lotus-svg"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={petalGradId} x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="25%" stopColor="#fbe090" />
                <stop offset="65%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#8d6215" />
              </linearGradient>

              <linearGradient id={innerPetalGradId} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#ffe794" />
                <stop offset="75%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#9e6f1a" />
              </linearGradient>

              <linearGradient id={strokeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffd978" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#875d11" stopOpacity="0.6" />
              </linearGradient>

              <radialGradient id={stamenGradId} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#ffe994" />
                <stop offset="75%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#7a4f0d" />
              </radialGradient>
            </defs>

            {/* Lotus Group with blooming state class */}
            <g className={isBlooming ? "lotus-blooming" : ""}>
              {/* Outer Layer Petals (Unfold wide on bloom) */}
              <path
                className="petal petal-outer petal-left-3"
                d="M100,115 C75,108 55,80 62,55 C74,58 92,85 100,115 Z"
                fill={`url(#${petalGradId})`}
                stroke={`url(#${strokeGradId})`}
                strokeWidth="1.2"
              />
              <path
                className="petal petal-outer petal-right-3"
                d="M100,115 C125,108 145,80 138,55 C126,58 108,85 100,115 Z"
                fill={`url(#${petalGradId})`}
                stroke={`url(#${strokeGradId})`}
                strokeWidth="1.2"
              />

              {/* Mid Layer Petals */}
              <path
                className="petal petal-mid petal-left-2"
                d="M100,115 C82,102 68,75 76,46 C87,55 96,85 100,115 Z"
                fill={`url(#${petalGradId})`}
                stroke={`url(#${strokeGradId})`}
                strokeWidth="1.2"
              />
              <path
                className="petal petal-mid petal-right-2"
                d="M100,115 C118,102 132,75 124,46 C113,55 104,85 100,115 Z"
                fill={`url(#${petalGradId})`}
                stroke={`url(#${strokeGradId})`}
                strokeWidth="1.2"
              />

              {/* Inner Upright Petals */}
              <path
                className="petal petal-inner petal-left-1"
                d="M100,115 C90,95 82,65 90,38 C97,52 100,82 100,115 Z"
                fill={`url(#${innerPetalGradId})`}
                stroke={`url(#${strokeGradId})`}
                strokeWidth="1.2"
              />
              <path
                className="petal petal-inner petal-right-1"
                d="M100,115 C110,95 118,65 110,38 C103,52 100,82 100,115 Z"
                fill={`url(#${innerPetalGradId})`}
                stroke={`url(#${strokeGradId})`}
                strokeWidth="1.2"
              />

              {/* Center Tower Petal */}
              <path
                className="petal petal-inner petal-center"
                d="M100,115 C93,90 94,52 100,28 C106,52 107,90 100,115 Z"
                fill={`url(#${innerPetalGradId})`}
                stroke={`url(#${strokeGradId})`}
                strokeWidth="1.4"
              />

              {/* Lotus Core & Golden Stamen Corona */}
              <g className="lotus-stamen">
                <circle cx="100" cy="115" r="14" fill={`url(#${stamenGradId})`} />
                <circle cx="100" cy="115" r="7" fill="#fff" opacity="0.8" />
                {/* Traditional radiating seed rays */}
                {[...Array(8)].map((_, i) => {
                  const rayAngle = i * 45;
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="103"
                      x2="100"
                      y2="97"
                      stroke="#ffeaa8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      transform={`rotate(${rayAngle} 100 115)`}
                    />
                  );
                })}
              </g>
            </g>

            {/* Step 1: Tiny Golden Lotus Bud (Initial State) */}
            <g className={`lotus-bud-glow ${phase === 1 ? "visible" : ""}`}>
              <circle cx="100" cy="115" r="9" fill={`url(#${stamenGradId})`} />
              <path
                d="M100,98 C92,106 95,120 100,123 C105,120 108,106 100,98 Z"
                fill={`url(#${petalGradId})`}
                stroke="#fff"
                strokeWidth="0.8"
              />
            </g>
          </svg>
        </div>

        {/* ==================================================================
            Step 4: Text Appears (THE WEDDING OF THUSHARA & WADUSHA)
            ================================================================== */}
        <div className="poruwa-text-box">
          <p className={`poruwa-eyebrow ${showText ? "visible" : ""}`}>
            THE WEDDING OF
          </p>
          <h1 className={`poruwa-names ${showText ? "visible" : ""}`}>
            THUSHARA<span className="ampersand">&</span>WADUSHA
          </h1>
          <p className={`poruwa-blessing ${showText ? "visible" : ""}`}>
            A moment of love awaits...
          </p>
        </div>

        {/* ==================================================================
            Step 6: Screen Elegantly Opens Into The Invitation
            ================================================================== */}
        <div className={`poruwa-action-group ${isReady ? "visible" : ""}`}>
          <button
            type="button"
            className="poruwa-enter-btn"
            onClick={handleOpen}
            aria-label="Enter wedding invitation"
          >
            
            <span>Opening Invitation</span>
            
          </button>

          {/* Auto progress bar */}
          <div className="poruwa-progress-container" title="Auto-revealing invitation">
            <div className="poruwa-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

// Replay Button export for seamless testing/reviewing on the main page
export function PoruwaReplayTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="poruwa-replay-btn"
      onClick={onClick}
      title="Replay Golden Poruwa Reveal"
      aria-label="Replay intro animation"
    >
      <RotateCcw size={14} />
      <span>Replay Reveal</span>
    </button>
  );
}

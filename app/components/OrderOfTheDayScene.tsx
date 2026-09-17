"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Sparkles, RotateCcw, MapPin, Bell, ChevronDown } from "lucide-react";

// Web Audio API helper for gentle temple bell / singing bowl chime cue
function playTempleBellChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => { });
    }

    const now = ctx.currentTime;

    // Harmonic bell partials (528 Hz Solfeggio fundamental + warm overtones)
    const partials = [
      { freq: 528, gain: 0.08, decay: 2.6 },
      { freq: 1056, gain: 0.035, decay: 2.0 },
      { freq: 1584, gain: 0.018, decay: 1.4 },
      { freq: 2112, gain: 0.009, decay: 1.0 },
    ];

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch {
    // Graceful fallback if audio is restricted by user interaction policy
  }
}

export default function OrderOfTheDayScene() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Animation sequence states
  const hasStartedRef = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sunRisen, setSunRisen] = useState(false);
  const [lineProgress, setLineProgress] = useState(0); // 0 to 100%
  const [time9amRevealed, setTime9amRevealed] = useState(false);
  const [lotusBloomed, setLotusBloomed] = useState(false);
  const [poruwaCardRevealed, setPoruwaCardRevealed] = useState(false);
  const [time10amRevealed, setTime10amRevealed] = useState(false);
  const [celebrationCardRevealed, setCelebrationCardRevealed] = useState(false);
  const [time4pmRevealed, setTime4pmRevealed] = useState(false);
  const [flourishRevealed, setFlourishRevealed] = useState(false);
  const [activeStation, setActiveStation] = useState<string>("9am");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const lineAnimFrameRef = useRef<number | null>(null);

  const clearAllTimeouts = () => {
    animationTimeoutsRef.current.forEach((t) => clearTimeout(t));
    animationTimeoutsRef.current = [];
    if (lineAnimFrameRef.current) {
      cancelAnimationFrame(lineAnimFrameRef.current);
      lineAnimFrameRef.current = null;
    }
  };

  // Helper to smoothly animate line progress between start% and end% over durationMs
  const animateLineSegment = (
    fromPercent: number,
    toPercent: number,
    durationMs: number,
    onComplete?: () => void
  ) => {
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // smooth easeInOutQuad
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setLineProgress(fromPercent + (toPercent - fromPercent) * eased);

      if (progress < 1) {
        lineAnimFrameRef.current = requestAnimationFrame(frame);
      } else {
        setLineProgress(toPercent);
        if (onComplete) onComplete();
      }
    };

    lineAnimFrameRef.current = requestAnimationFrame(frame);
  };

  // The 5-stage animation sequence
  const startDayUnfoldsSequence = useCallback(() => {
    clearAllTimeouts();

    // Reset states
    setSunRisen(false);
    setLineProgress(0);
    setTime9amRevealed(false);
    setLotusBloomed(false);
    setPoruwaCardRevealed(false);
    setTime10amRevealed(false);
    setCelebrationCardRevealed(false);
    setTime4pmRevealed(false);
    setFlourishRevealed(false);
    setActiveStation("9am");

    // Stage 1: (300ms) A tiny golden sun rises at the top
    const t1 = setTimeout(() => {
      setSunRisen(true);

      // Stage 2: (1000ms) A thin gold line begins drawing downward from Sun to 9:00 AM (0% to 22%)
      const t2 = setTimeout(() => {
        animateLineSegment(0, 22, 900, () => {
          // Stage 3: (1900ms) First time appears: 09:00 AM
          setTime9amRevealed(true);
          setActiveStation("9am");

          const t3a = setTimeout(() => {
            // Small lotus / Poruwa ornament opens beside it
            setLotusBloomed(true);
            setPoruwaCardRevealed(true);

            // Play gentle traditional temple bell chime
            if (soundEnabled) {
              playTempleBellChime();
            }

            // Stage 4: (3400ms) The line continues drawing downward to 10:00 AM (22% to 68%)
            const t4 = setTimeout(() => {
              animateLineSegment(22, 68, 1200, () => {
                // 10:00 AM appears & grand Wedding Celebration section unfolds
                setTime10amRevealed(true);
                setCelebrationCardRevealed(true);
                setActiveStation("10am");

                // Stage 5: (5000ms) Finally the line reaches 04:00 PM (68% to 100%)
                const t5 = setTimeout(() => {
                  animateLineSegment(68, 100, 1000, () => {
                    setTime4pmRevealed(true);
                    setFlourishRevealed(true);
                    setActiveStation("4pm");
                  });
                }, 1000);
                animationTimeoutsRef.current.push(t5);
              });
            }, 1400);
            animationTimeoutsRef.current.push(t4);
          }, 350);
          animationTimeoutsRef.current.push(t3a);
        });
      }, 700);
      animationTimeoutsRef.current.push(t2);
    }, 300);
    animationTimeoutsRef.current.push(t1);
  }, [soundEnabled]);

  // Scroll into view trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          setHasStarted(true);
          startDayUnfoldsSequence();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [startDayUnfoldsSequence]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  const handleReplay = (e: React.MouseEvent) => {
    e.preventDefault();
    startDayUnfoldsSequence();
  };

  const handleStationClick = (stationId: string) => {
    setActiveStation(stationId);
    if (stationId === "9am" && soundEnabled) {
      playTempleBellChime();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="sundial-scene-container"
      id="order-of-the-day"
      aria-label="Order of the Day - The Day Unfolds"
    >
      {/* Subtle Celestial Twinkling Starlight Dust */}
      <div className="sundial-celestial-dust" aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className="sundial-dust-particle"
            style={{
              top: `${(i * 37) % 94 + 3}%`,
              left: `${(i * 59) % 96 + 2}%`,
              animationDelay: `${(i * 0.38).toFixed(2)}s`,
              animationDuration: `${3.5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* Order of the Day Content */}
      <div className="scroll-panel-wrapper">
        {/* Header Block: Traditional Scroll Heading */}
        <header className="sundial-header">

          <h2 className="sundial-title">THE DAY UNFOLDS</h2>
          <p className="sundial-subtitle">
            Thursday, 26 November 2026
          </p>
        </header>

        {/* ================================================================
            The Vertical Golden Timeline
            ================================================================ */}
        <div className="vertical-timeline-stage">
          {/* Timeline Spine & Station Items */}
          <div className="timeline-spine-arena">
            {/* SVG Central Vertical Spine Line (drawn directly through column 2 from Sun to 4 PM) */}
            <svg
              className="timeline-line-svg-container"
              viewBox="0 0 16 680"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="verticalGoldGlow"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#C655FD" />
                  <stop offset="70%" stopColor="#9A26D7" />
                  <stop offset="100%" stopColor="#760EAB" />
                </linearGradient>
                <linearGradient
                  id="verticalGoldCore"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#F3D8FF" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Translucent Base Guide Track */}
              <line
                x1="8"
                y1="0"
                x2="8"
                y2="680"
                className="spine-base-track"
              />

              {/* Animated Progress Path (Line drawing downward) */}
              <line
                x1="8"
                y1="0"
                x2="8"
                y2="680"
                className="spine-glow-track"
                strokeDasharray="680"
                strokeDashoffset={680 * (1 - lineProgress / 100)}
              />
              <line
                x1="8"
                y1="0"
                x2="8"
                y2="680"
                className="spine-core-track"
                strokeDasharray="680"
                strokeDashoffset={680 * (1 - lineProgress / 100)}
              />
            </svg>

            {/* Step 1: Rising Tiny Golden Sun Row (Directly atop the vertical line) */}
            <div className="timeline-station-row sun-row">
              <div className="station-time-col sun-label-col">
                <span className={`sun-dawn-badge ${sunRisen ? "revealed" : ""}`}>
                  Auspicious Dawn
                </span>
              </div>
              <div className="station-node-col">
                <div className={`timeline-sun-wrap ${sunRisen ? "risen" : ""}`}>
                  <svg
                    viewBox="0 0 44 44"
                    className="sun-svg-icon"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="sunCoreGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor="#F3D8FF" />
                        <stop offset="90%" stopColor="#C655FD" />
                        <stop offset="100%" stopColor="#760EAB" />
                      </radialGradient>
                    </defs>

                    {/* Rotating Corona Rays */}
                    <g className="sun-corona-spin">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line
                          key={i}
                          x1="22"
                          y1="4"
                          x2="22"
                          y2="22"
                          transform={`rotate(${i * 30} 22 22)`}
                          stroke="#C655FD"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      ))}
                    </g>

                    {/* Pulsing Sun Core */}
                    <circle
                      cx="22"
                      cy="22"
                      r="9"
                      fill="url(#sunCoreGradient)"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      className="sun-core-glow"
                    />
                  </svg>
                </div>
              </div>
              <div className="station-content-col" />
            </div>

            {/* ==========================================================
                Station 1: 09:00 AM — PORUWE CHARITHRA
                ========================================================== */}
            <div className="timeline-station-row" id="station-9am">
              {/* Left Column: 09:00 AM */}
              <div
                className={`station-time-col ${time9amRevealed ? "revealed" : ""
                  }`}
              >
                <span className="station-time-text">09:00 AM</span>
                <span className="station-time-badge">Auspicious Hour</span>
              </div>

              {/* Center Column: Node Dot */}
              <div className="station-node-col">
                <button
                  type="button"
                  className={`timeline-node-dot ${lineProgress >= 22 ? "reached" : ""
                    }`}
                  onClick={() => handleStationClick("9am")}
                  aria-label="09:00 AM Poruwe Charithra"
                >
                  {activeStation === "9am" && <span className="node-pulse-halo" />}
                  <span className="node-inner-star">✦</span>
                </button>
              </div>

              {/* Right Column: Blooming Lotus + PORUWE CHARITHRA Card */}
              <div
                className={`station-content-col ${poruwaCardRevealed ? "revealed" : ""
                  }`}
              >
                {/* Blooming Lotus Ornament beside 9:00 AM */}
                <div className="lotus-ornament-wrap">
                  <svg
                    viewBox="0 0 60 60"
                    className={`blooming-lotus-svg ${lotusBloomed ? "bloomed" : ""
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        id="lotusGoldGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="35%" stopColor="#F3D8FF" />
                        <stop offset="70%" stopColor="#C655FD" />
                        <stop offset="100%" stopColor="#760EAB" />
                      </linearGradient>
                    </defs>
                    {/* 8 Blooming Lotus Petals */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <path
                        key={i}
                        d="M 30,30 C 24,14 36,14 30,30 Z"
                        className="lotus-petal"
                        transform={`rotate(${i * 45} 30 30)`}
                      />
                    ))}
                    <circle cx="30" cy="30" r="4.5" fill="#ffffff" />
                    <circle cx="30" cy="30" r="2.5" fill="#760EAB" />
                  </svg>

                  {/* Sound Cue Trigger Button / Badge */}
                  <button
                    type="button"
                    className="temple-bell-badge"
                    onClick={playTempleBellChime}
                    title="Play traditional temple bell chime"
                  >
                    <Bell size={11} />
                    <span>Sacred Bell Chime</span>
                  </button>
                </div>

                <article
                  className={`day-event-card ${activeStation === "9am" ? "highlighted" : ""
                    }`}
                  onClick={() => handleStationClick("9am")}
                >
                  <div className="card-header-line">
                    <h3 className="card-title-text">PORUWE CHARITHRA</h3>
                  </div>
                </article>
              </div>
            </div>

            {/* ==========================================================
                Station 2: 10:00 AM — WEDDING CELEBRATION (10:00 AM — 4:00 PM)
                ========================================================== */}
            <div className="timeline-station-row" id="station-10am">
              {/* Left Column: 10:00 AM */}
              <div
                className={`station-time-col ${time10amRevealed ? "revealed" : ""
                  }`}
              >
                <span className="station-time-text">10:00 AM</span>
                <span className="station-time-badge">Celebration Begins</span>
              </div>

              {/* Center Column: Node Dot */}
              <div className="station-node-col">
                <button
                  type="button"
                  className={`timeline-node-dot ${lineProgress >= 68 ? "reached" : ""
                    }`}
                  onClick={() => handleStationClick("10am")}
                  aria-label="10:00 AM Wedding Celebration"
                >
                  {activeStation === "10am" && <span className="node-pulse-halo" />}
                  <span className="node-inner-star">✦</span>
                </button>
              </div>

              {/* Right Column: Grand WEDDING CELEBRATION Card */}
              <div
                className={`station-content-col ${celebrationCardRevealed ? "revealed" : ""
                  }`}
              >
                <article
                  className={`day-event-card grand-celebration ${activeStation === "10am" ? "highlighted" : ""
                    }`}
                  onClick={() => handleStationClick("10am")}
                >
                  <div className="card-header-line">
                    <h3 className="card-title-text">WEDDING CELEBRATION</h3>
                  </div>
                </article>
              </div>
            </div>

            {/* ==========================================================
                Station 3: 04:00 PM — AUSPICIOUS FAREWELL & FLOURISH
                ========================================================== */}
            <div className="timeline-station-row" id="station-4pm">
              {/* Left Column: 04:00 PM */}
              <div
                className={`station-time-col ${time4pmRevealed ? "revealed" : ""
                  }`}
              >
                <span className="station-time-text">04:00 PM</span>
                <span className="station-time-badge">Auspicious Send-off</span>
              </div>

              {/* Center Column: Node Dot */}
              <div className="station-node-col">
                <button
                  type="button"
                  className={`timeline-node-dot ${lineProgress >= 98 ? "reached" : ""
                    }`}
                  onClick={() => handleStationClick("4pm")}
                  aria-label="04:00 PM Auspicious Farewell"
                >
                  {activeStation === "4pm" && <span className="node-pulse-halo" />}
                  <span className="node-inner-star">✦</span>
                </button>
              </div>

              {/* Right Column: Terminal Blessing Note */}
              <div
                className={`station-content-col ${time4pmRevealed ? "revealed" : ""
                  }`}
              >
                <article
                  className={`day-event-card ${activeStation === "4pm" ? "highlighted" : ""
                    }`}
                  onClick={() => handleStationClick("4pm")}
                >
                  <div className="card-header-line">
                    <h3 className="card-title-text">AUSPICIOUS FAREWELL</h3>
                  </div>
                </article>
              </div>
            </div>
          </div>





          {/* Interactive Controls: Replay Only */}
          <div className="timeline-controls-row">
            <button
              type="button"
              className="timeline-replay-btn"
              onClick={handleReplay}
              aria-label="Replay The Day Unfolds animation"
            >
              <RotateCcw size={13} />
              <span>Replay The Day Unfolds</span>
            </button>
          </div>

          {/* Scroll Down Indicator to Live Countdown */}
          <div className="timeline-scroll-cue-wrap">
            <button
              type="button"
              className="scroll-down-cue-btn"
              onClick={() => {
                const el = document.getElementById("countdown-section") || document.getElementById("home");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label="Scroll down to live countdown"
              title="Scroll down"
            >
              <span className="scroll-down-cue-text">SCROLL DOWN</span>
              <ChevronDown size={20} className="scroll-down-cue-arrow" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

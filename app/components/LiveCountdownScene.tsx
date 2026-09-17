"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

const WEDDING_TARGET = new Date("2026-11-26T00:00:00+05:30").getTime();

export default function LiveCountdownScene() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, WEDDING_TARGET - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollToNext = () => {
    const el = document.getElementById("destination-scene");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <section
      className="live-countdown-scene"
      id="countdown-section"
      aria-label="Live Wedding Countdown"
    >
      {/* Background Starry Dust */}
      <div className="countdown-celestial-bg" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="countdown-star"
            style={{
              top: `${(i * 31) % 92 + 4}%`,
              left: `${(i * 53) % 94 + 3}%`,
              animationDelay: `${(i * 0.4).toFixed(2)}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="countdown-content-wrapper">
        <header className="countdown-header">

          <h2 className="countdown-title">COUNTING DOWN TO FOREVER</h2>
          <p className="countdown-subtitle">
            Thursday, 26 November 2026
          </p>
        </header>

        {/* 4 Majestic Live Cards */}
        <div className="countdown-grid">
          {units.map(({ label, value }) => (
            <div className="countdown-card" key={label}>
              <div className="countdown-card-inner">
                <span
                  className="countdown-number"
                  suppressHydrationWarning
                >
                  {mounted ? String(value).padStart(2, "0") : "--"}
                </span>
                <span className="countdown-label">{label}</span>
              </div>
              <div className="countdown-card-glow" />
            </div>
          ))}
        </div>



        {/* Scroll Down Indicator to Hero Cover */}
        <div className="countdown-scroll-cue-wrap">
          <button
            type="button"
            className="scroll-down-cue-btn"
            onClick={handleScrollToNext}
            aria-label="Scroll down to wedding invitation"
            title="Scroll down"
          >
            <span className="scroll-down-cue-text">SCROLL DOWN</span>
            <ChevronDown size={20} className="scroll-down-cue-arrow" />
          </button>
        </div>
      </div>
    </section >
  );
}

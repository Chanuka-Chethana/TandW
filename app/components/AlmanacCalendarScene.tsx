"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sparkles, Heart, CalendarPlus, ChevronDown, Check, ExternalLink, X } from "lucide-react";
import HandHeartDrawing from "./HandHeartDrawing";
import { saveDateUniversally, PlatformType } from "../utils/calendar";

interface AlmanacCalendarSceneProps {
  isActive?: boolean;
  onExplore?: () => void;
}

const MONTH_NAMES = [
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
  "JANUARY",
  "FEBRUARY",
  "OCTOBER",
  "NOVEMBER",
];

const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

// Search path dates leading to 26
const SEARCH_STEPS = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

export default function AlmanacCalendarScene({
  isActive = true,
  onExplore,
}: AlmanacCalendarSceneProps) {
  // Animation sub-phases:
  // 1: Inscription intro ("THE DAY HAS BEEN CHOSEN")
  // 2: Calendar appears & rapid month / date shuffle
  // 3: Month locks in on NOVEMBER 2026
  // 4: Golden circle starts searching through dates (17 -> 26)
  // 5: Golden pulse shockwave on 26!
  // 6: Everything else fades away & hand heart starts drawing
  // 7: Hand heart fully drawn with date glowing inside
  const [phase, setPhase] = useState<number>(0);
  const [displayedMonth, setDisplayedMonth] = useState<string>("SEPTEMBER");
  const [activeSearchDate, setActiveSearchDate] = useState<number | null>(null);
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [toastInfo, setToastInfo] = useState<{ platform: PlatformType; googleUrl: string } | null>(null);
  const searchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSaveDate = () => {
    const result = saveDateUniversally();
    setToastInfo(result);
    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setToastInfo((current) => (current === result ? null : current));
    }, 6000);
  };

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setActiveSearchDate(null);
      setPulseActive(false);
      return;
    }

    // Step 1: Inscription appears (at 300ms)
    const t1 = setTimeout(() => setPhase(1), 300);

    // Step 2: Calendar appears & rapid month shuffle (at 1000ms)
    const t2 = setTimeout(() => {
      setPhase(2);

      let shuffleIndex = 0;
      const shuffleInterval = setInterval(() => {
        shuffleIndex = (shuffleIndex + 1) % MONTH_NAMES.length;
        setDisplayedMonth(MONTH_NAMES[shuffleIndex]);
      }, 110);

      // Step 3: Lock in on NOVEMBER 2026 after 1.5s of shuffle (at 2500ms)
      setTimeout(() => {
        clearInterval(shuffleInterval);
        setDisplayedMonth("NOVEMBER");
        setPhase(3);

        // Step 4: Golden circle starts searching through dates (at 3100ms)
        setTimeout(() => {
          setPhase(4);
          let stepIdx = 0;
          setActiveSearchDate(SEARCH_STEPS[0]);

          searchIntervalRef.current = setInterval(() => {
            stepIdx++;
            if (stepIdx < SEARCH_STEPS.length) {
              setActiveSearchDate(SEARCH_STEPS[stepIdx]);
            } else {
              if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);

              // Step 5: Golden pulse on 26! (at ~4500ms)
              setPhase(5);
              setPulseActive(true);

              // Step 6: Surrounding calendar fades away & hand heart starts drawing (at 5200ms)
              setTimeout(() => {
                setPhase(6);

                // Step 7: Drawing completes and final locked glow settles (at 8400ms)
                setTimeout(() => {
                  setPhase(7);
                }, 3200);
              }, 700);
            }
          }, 140);
        }, 600);
      }, 1500);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
    };
  }, [isActive]);

  const handleScrollDown = () => {
    if (onExplore) {
      onExplore();
    } else {
      const target = document.getElementById("order-of-the-day");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
      }
    }
  };

  // November 2026 dates: 1 to 30, starting on Sunday (SU)
  // Generating a clean 35-cell grid (5 rows x 7 cols)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <section className="almanac-scene-container" id="almanac-scene">
      {/* Ambient Sri Lankan traditional starry aura & celestial dust (no background circle) */}
      <div className="almanac-celestial-bg" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="almanac-star"
            style={{
              top: `${8 + ((i * 19) % 84)}%`,
              left: `${4 + ((i * 23) % 92)}%`,
              animationDelay: `${(i * 0.35).toFixed(2)}s`,
              transform: `scale(${0.5 + (i % 4) * 0.2})`,
            }}
          />
        ))}
      </div>

      <div className="almanac-stage">
        {/* Top Eyebrow: | THE DAY HAS BEEN CHOSEN (Hidden once final date reveals) */}
        <div
          className={`almanac-header-badge ${phase >= 1 && phase < 6 ? "visible" : "hidden-end"
            }`}
        >

          <span className="almanac-eyebrow-text">THE DAY HAS BEEN CHOSEN</span>
        </div>

        {/* The Almanac Calendar Card */}
        <div
          className={`almanac-calendar-card ${phase >= 2 ? "visible" : ""} ${phase >= 6 ? "fade-grid" : ""
            } ${phase >= 7 ? "minimal-mode" : ""}`}
        >
          {/* Outer Traditional Almanac Corner Flourishes */}
          <div className="almanac-card-corner top-left" />
          <div className="almanac-card-corner top-right" />
          <div className="almanac-card-corner bottom-left" />
          <div className="almanac-card-corner bottom-right" />

          {/* Month Header Banner */}
          <div className="almanac-month-header">
            <h2 className="almanac-month-title">
              <span className="month-name">{displayedMonth}</span>
              <span className="year-name">2026</span>
            </h2>
            <div className="almanac-litha-glyph" title="Sri Lankan Auspicious Nekatha">
              <Sparkles size={16} />
            </div>
          </div>

          {/* Weekday Labels (SU MO TU WE TH FR SA) */}
          <div className="almanac-weekdays-row">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="weekday-label">
                {wd}
              </span>
            ))}
          </div>

          {/* Calendar Dates Grid (1 to 30) */}
          <div className="almanac-dates-grid">
            {daysInMonth.map((dayNum) => {
              const isSearchTarget = activeSearchDate === dayNum;
              const isChosenDate = dayNum === 26;
              const isPassed =
                activeSearchDate !== null &&
                SEARCH_STEPS.includes(dayNum) &&
                dayNum < (activeSearchDate ?? 0);

              return (
                <div
                  key={dayNum}
                  className={`date-cell ${isChosenDate ? "chosen-cell" : ""} ${isSearchTarget ? "search-active" : ""
                    } ${isPassed ? "search-passed" : ""}`}
                  id={`date-cell-${dayNum}`}
                >
                  <span className="date-number">{dayNum}</span>

                  {/* Golden Searching Ring */}
                  {isSearchTarget && (
                    <div
                      className={`golden-search-ring ${isChosenDate && pulseActive ? "pulse-shockwave" : ""
                        }`}
                    >
                      <div className="ring-sparkle spark-1" />
                      <div className="ring-sparkle spark-2" />
                    </div>
                  )}

                  {/* Golden Pulse Aura when 26 is locked */}
                  {isChosenDate && pulseActive && (
                    <div className="chosen-shockwave-burst" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 7: Hand Heart with Date Inside */}
        <div className={`almanac-final-reveal ${phase >= 6 ? "visible" : ""}`}>
          {/* Floating Romantic Golden Hearts Cluster */}
          <div className="final-hearts-cluster" aria-hidden="true">
            <span className="floating-heart heart-1">♥</span>
            <span className="floating-heart heart-2">♥</span>
            <span className="floating-heart heart-3">♥</span>
            <span className="floating-heart heart-4">♥</span>
            <span className="floating-heart heart-5">♥</span>
            <span className="floating-heart heart-6">♥</span>
            <span className="floating-heart heart-7">♥</span>
          </div>

          <HandHeartDrawing
            isDrawing={phase >= 6}
            isDrawn={phase >= 7}
            duration={3200}
            onExplore={handleScrollDown}
          />

          {/* Dedicated Universal 1-Click Save the Date Button & Scroll Down Cue */}
          <div className={`almanac-actions-container ${phase >= 7 ? "visible" : ""}`}>
            <button
              type="button"
              className="universal-save-date-btn"
              onClick={handleSaveDate}
              id="save-date-universal-btn"
              aria-label="Save wedding date to your calendar in 1 click"
            >
              <span className="btn-glow-shimmer" />

              <span className="btn-text">SAVE THE DATE</span>
            </button>

            {/* Scroll Down Indicator to The Day Unfolds */}
            <button
              type="button"
              className="scroll-down-cue-btn"
              onClick={handleScrollDown}
              aria-label="Scroll down to The Day Unfolds timeline"
              title="Scroll down"
            >
              <span className="scroll-down-cue-text">SCROLL DOWN</span>
              <ChevronDown size={20} className="scroll-down-cue-arrow" />
            </button>
          </div>
        </div>
      </div>

      {/* Universal 1-Click Save Confirmation Toast */}
      {toastInfo && (
        <div className="universal-save-toast" role="status" aria-live="polite">
          <div className="toast-icon-wrap">
            <Check size={18} strokeWidth={2.8} />
          </div>
          <div className="toast-content-wrap">
            <p className="toast-main-msg">Wedding Date Saved to Your Calendar!</p>
            <p className="toast-detail-msg">
              Thursday, 26 November 2026 · 9:00 AM – 4:00 PM · Hotel Green Court, Homagama
            </p>
          </div>
          {toastInfo.platform === "windows" && (
            <a
              href={toastInfo.googleUrl}
              target="_blank"
              rel="noreferrer"
              className="toast-web-link"
              title="Add to Google Calendar in browser"
            >
              <span>Google Cal</span>
              <ExternalLink size={12} />
            </a>
          )}
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToastInfo(null)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </section>
  );
}

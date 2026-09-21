"use client";

import React from "react";
import { Sparkles, ChevronDown } from "lucide-react";

export default function FamilyBlessingsScene() {
  const handleScrollToRsvp = () => {
    const el = document.getElementById("will-you-join-us");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="family-blessings-scene"
      id="family-blessings-scene"
      aria-label="With the Blessings of Our Families"
    >
      {/* Ambient Radial Glow & Celestial Star Dust */}
      <div className="family-ambient-glow" aria-hidden="true" />
      <div className="family-stars-layer" aria-hidden="true">
        <span className="family-star star-1" />
        <span className="family-star star-2" />
        <span className="family-star star-3" />
        <span className="family-star star-4" />
        <span className="family-star star-5" />
        <span className="family-star star-6" />
      </div>

      <div className="family-blessings-container">
        {/* ================================================================
            Top Inscription Header
            ================================================================ */}
        <header className="family-header">
          {/* Traditional Auspicious Lotus Icon */}
          <div className="family-lotus-emblem" aria-hidden="true">
            <svg viewBox="0 0 60 40" width="52" height="34" fill="none">
              <defs>
                <linearGradient id="goldLotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#F5D0FE" />
                  <stop offset="80%" stopColor="#E879F9" />
                  <stop offset="100%" stopColor="#C655FD" />
                </linearGradient>
              </defs>
              {/* Central Petal */}
              <path
                d="M30,4 C27,14 26,24 30,34 C34,24 33,14 30,4 Z"
                fill="url(#goldLotusGrad)"
                opacity="0.95"
              />
              {/* Inner Petals */}
              <path
                d="M30,12 C23,17 19,25 24,33 C27,27 28,21 30,12 Z"
                fill="url(#goldLotusGrad)"
                opacity="0.8"
              />
              <path
                d="M30,12 C37,17 41,25 36,33 C33,27 32,21 30,12 Z"
                fill="url(#goldLotusGrad)"
                opacity="0.8"
              />
              {/* Outer Flared Petals */}
              <path
                d="M26,20 C17,22 10,29 18,34 C22,30 24,26 26,20 Z"
                fill="url(#goldLotusGrad)"
                opacity="0.65"
              />
              <path
                d="M34,20 C43,22 50,29 42,34 C38,30 36,26 34,20 Z"
                fill="url(#goldLotusGrad)"
                opacity="0.65"
              />
              {/* Base Stamen */}
              <circle cx="30" cy="34" r="3" fill="#FFFFFF" />
            </svg>
          </div>

          <p className="family-small-gold-eyebrow">

            <span>WITH THE BLESSINGS OF OUR FAMILIES</span>

          </p>
        </header>

        {/* ================================================================
            Two Mirrored Family Branches (Desktop: Left = Groom, Right = Bride)
            ================================================================ */}
        <div className="family-branches-grid">
          {/* Left Branch: Groom */}
          <div className="family-branch groom-branch">
            <span className="branch-role-tag">GROOM</span>
            <h3 className="branch-relation-label">LOVING SON OF</h3>
            <div className="branch-names-block">
              <div className="parent-primary-name">MR. L.P. PUSHPA KUMARA</div>
              <div className="parent-tribute-line">
                <span className="tribute-amp">&</span>
                <span className="parent-primary-name">MRS. PUSHPA KUMARA</span>
              </div>
            </div>
          </div>

          {/* Center Vertical Divider on Mobile, Subtle Balance on Desktop */}
          <div className="family-branch-connector" aria-hidden="true">
            <span className="branch-center-heart">♥</span>
          </div>

          {/* Right Branch: Bride */}
          <div className="family-branch bride-branch">
            <span className="branch-role-tag">BRIDE</span>
            <h3 className="branch-relation-label">LOVING DAUGHTER OF</h3>
            <div className="branch-names-block">
              <div className="parent-primary-name">MR. U.K. PREMALAL</div>
              <div className="parent-ampersand-bridge">&amp;</div>
              <div className="parent-primary-name">MRS. N.A.K. SUDHARMA PRIYANGANI</div>
            </div>
          </div>
        </div>

        {/* ================================================================
            Golden Ornamental Converging Lines
            The gold lines from both sides gracefully converge toward center
            ================================================================ */}
        <div className="family-converging-canvas" aria-hidden="true">
          <svg
            viewBox="0 0 1000 160"
            className="converging-svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="convergeLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E879F9" stopOpacity="0.1" />
                <stop offset="40%" stopColor="#F5D0FE" stopOpacity="0.6" />
                <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#E879F9" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="convergeRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E879F9" stopOpacity="0.1" />
                <stop offset="40%" stopColor="#F5D0FE" stopOpacity="0.6" />
                <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#E879F9" stopOpacity="1" />
              </linearGradient>
              <filter id="goldConvergeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Left Branch Converging Curve */}
            <path
              d="M 180 10 C 260 55, 380 115, 492 125"
              fill="none"
              stroke="url(#convergeLeftGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              filter="url(#goldConvergeGlow)"
              className="converge-path-left"
            />
            {/* Delicate parallel echo line */}
            <path
              d="M 220 18 C 300 62, 390 108, 485 118"
              fill="none"
              stroke="rgba(245, 208, 254, 0.35)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Right Branch Converging Curve */}
            <path
              d="M 820 10 C 740 55, 620 115, 508 125"
              fill="none"
              stroke="url(#convergeRightGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              filter="url(#goldConvergeGlow)"
              className="converge-path-right"
            />
            {/* Delicate parallel echo line */}
            <path
              d="M 780 18 C 700 62, 610 108, 515 118"
              fill="none"
              stroke="rgba(245, 208, 254, 0.35)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Central Convergence Golden Base Cradle */}
            <path
              d="M 460 125 Q 500 138, 540 125"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Radiant Convergence Point ✦ */}
            <g transform="translate(500, 75)" className="center-radiance-crest">
              <circle cx="0" cy="0" r="16" fill="rgba(198, 85, 253, 0.25)" />
              <circle cx="0" cy="0" r="7" fill="rgba(255, 255, 255, 0.4)" />
              {/* Star of Union ✦ */}
              <path
                d="M 0,-18 L 3,-6 L 15,0 L 3,6 L 0,18 L -3,6 L -15,0 L -3,-6 Z"
                fill="#FFFFFF"
                filter="url(#goldConvergeGlow)"
              />
              <circle cx="0" cy="0" r="2.5" fill="#E879F9" />
            </g>
          </svg>
        </div>

        {/* ================================================================
            The Convergence: Couple's Names & Meaningful Blessing Inscription
            ================================================================ */}
        <div className="family-union-block">
          <h2 className="family-couple-names">
            THUSHARA<span className="family-union-amp">&amp;</span>WADUSHA
          </h2>
          <p className="family-union-tagline">Two families, one beautiful beginning.</p>
        </div>

        {/* ================================================================
            Thin Gold Ornamental Divider & Formal Invitation Call to RSVP
            ================================================================ */}
        <div className="family-invitation-divider-wrap">
          <div className="family-gold-divider" aria-hidden="true">
            <span className="divider-glow-line" />
            <span className="divider-center-crest">✦</span>
            <span className="divider-glow-line" />
          </div>

          <p className="family-share-joy-text">WE INVITE YOU TO SHARE IN OUR JOY</p>

          <button
            type="button"
            className="family-to-rsvp-btn"
            onClick={handleScrollToRsvp}
            aria-label="Continue to RSVP"
            title="Continue to RSVP"
          >
            <span>CONTINUE TO RSVP</span>
            <ChevronDown size={16} className="family-arrow-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}

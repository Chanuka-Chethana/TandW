"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  CalendarCheck,
  ChevronDown,
  Sparkles,
  Send,
  CheckCircle2,
  Smile,
  Edit3,
  X,
} from "lucide-react";
import { saveDateUniversally } from "../utils/calendar";

interface WillYouJoinUsSceneProps {
  onRsvpChange?: (rsvp: {
    guest: string;
    attendance: string;
    guestsCount: number;
    message: string;
  }) => void;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  type: "petal" | "sparkle";
}

export default function WillYouJoinUsScene({ onRsvpChange }: WillYouJoinUsSceneProps) {
  const [selection, setSelection] = useState<"attending" | "declining" | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [wishMessage, setWishMessage] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [calendarSaved, setCalendarSaved] = useState(false);
  const [rsvpId, setRsvpId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Load saved response from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tw_wedding_rsvp");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id) setRsvpId(parsed.id);
        if (parsed.attendance === "attending" || parsed.attendance === "declining") {
          setSelection(parsed.attendance);
          setGuestName(parsed.guest || "");
          setGuestCount(parsed.guestCount || 1);
          setWishMessage(parsed.message || "");
          setIsConfirmed(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync with parent component if callback provided
  const triggerParentSync = (att: "attending" | "declining", name: string, count: number, msg: string) => {
    if (onRsvpChange) {
      onRsvpChange({
        guest: name,
        attendance: att === "attending" ? "joyfully accepts" : "regretfully declines",
        guestsCount: count,
        message: msg,
      });
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsConfirmed(true);

    const payload: {
      id?: string;
      attendance: "attending" | "declining" | null;
      guest: string;
      guestCount: number;
      message: string;
      timestamp: string;
    } = {
      id: rsvpId || undefined,
      attendance: selection,
      guest: guestName.trim(),
      guestCount: selection === "attending" ? guestCount : 0,
      message: wishMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem("tw_wedding_rsvp", JSON.stringify(payload));
    } catch {
      // Ignore
    }

    // Persist to Server Database for Admin Dashboard
    try {
      fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rsvpId || undefined,
          guest: guestName.trim(),
          status: selection,
          guestCount: selection === "attending" ? guestCount : 0,
          message: wishMessage.trim(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.rsvp?.id) {
            setRsvpId(data.rsvp.id);
            payload.id = data.rsvp.id;
            try {
              localStorage.setItem("tw_wedding_rsvp", JSON.stringify(payload));
            } catch {}
          }
        })
        .catch((err) => console.error("RSVP sync error:", err));
    } catch (e) {
      // Ignore network errors on client
    }

    if (selection) {
      triggerParentSync(selection, guestName.trim(), guestCount, wishMessage.trim());
    }
  };

  // Reset or Edit Response
  const handleEdit = () => {
    setIsConfirmed(false);
  };

  // Switch between Attending and Declining
  const handleSwitchSelection = (target: "attending" | "declining") => {
    setSelection(target);
    setIsConfirmed(false);
  };

  const handleSaveCalendar = () => {
    saveDateUniversally();
    setCalendarSaved(true);
    setTimeout(() => setCalendarSaved(false), 4000);
  };

  const handleScrollToDetails = () => {
    const el = document.getElementById("moments-we-love") || document.getElementById("home");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Elegant Floating Petals & Golden Stardust Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle Palette
    const petalColors = [
      "rgba(255, 215, 0, 0.75)",      // Radiant gold
      "rgba(255, 235, 170, 0.85)",     // Champagne gold
      "rgba(244, 210, 205, 0.8)",      // Soft blush rose
      "rgba(255, 248, 230, 0.9)",      // Jasmine white
      "rgba(218, 165, 32, 0.7)",       // Golden rod
    ];

    const particleCount = isConfirmed && selection === "attending" ? 45 : 18;
    const particles: Petal[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 0.9 + 0.35,
        speedX: Math.sin(Math.random() * Math.PI) * 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: Math.random() * 0.6 + 0.3,
        type: Math.random() > 0.4 ? "petal" : "sparkle",
      });
    }

    let animationTime = 0;

    const render = () => {
      animationTime += 0.015;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(animationTime + p.rotation) * 0.6;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === "petal") {
          // Curved gentle petal shape
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
          ctx.fill();
        } else {
          // Golden four-point stardust sparkle
          ctx.beginPath();
          ctx.fillStyle = p.color;
          const s = p.size * 0.6;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isConfirmed, selection]);

  return (
    <section className="join-us-scene" id="will-you-join-us" aria-label="Will You Join Us Invitation">
      {/* Warm Ambient Radial Glow */}
      <div className="join-us-ambient-glow" aria-hidden="true" />

      {/* Floating Petals & Golden Stardust Canvas */}
      <canvas ref={canvasRef} className="join-us-petals-canvas" aria-hidden="true" />

      <div className="join-us-container">
        {/* Top Inscription Header */}
        <header className="join-us-header">
          <p className="join-us-eyebrow">OUR DAY WOULD BE MORE SPECIAL WITH YOU</p>
          <h2 className="join-us-title">WILL YOU JOIN US?</h2>
          <p className="join-us-subtitle">
            We would love to celebrate this beautiful beginning with you.
          </p>

        </header>

        {/* Phase 1: Two Elegant Invitation Choice Cards */}
        {selection === null && (
          <div className="join-us-cards-wrap" role="group" aria-label="Invitation Options">
            {/* Card 1: Attending */}
            <div
              className="join-us-card card-attending"
              onClick={() => handleSwitchSelection("attending")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSwitchSelection("attending")}
              aria-label="Yes, I'd love to be there"
            >
              <div className="join-us-card-seal" aria-hidden="true">
                <Heart size={26} fill="currentColor" />
              </div>
              <span className="join-us-card-header">YES</span>
              <h3 className="join-us-card-main">LOVE TO BE THERE</h3>
              <p className="join-us-card-desc">Can&apos;t wait to celebrate with you</p>
              <div className="join-us-card-cta">
                <span>Open Invitation</span>

              </div>
            </div>

            {/* Card 2: Unable to Attend */}
            <div
              className="join-us-card card-declining"
              onClick={() => handleSwitchSelection("declining")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSwitchSelection("declining")}
              aria-label="Unable to attend, sending love from afar"
            >
              <div className="join-us-card-seal" aria-hidden="true">
                <Smile size={26} />
              </div>
              <span className="join-us-card-header">WITH LOVE</span>
              <h3 className="join-us-card-main">UNABLE TO ATTEND</h3>
              <p className="join-us-card-desc">Sending my love from afar</p>
              <div className="join-us-card-cta">
                <span>Send Blessings</span>

              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Stationery Letter Unfolded Form (When Choice Selected but not confirmed) */}
        {selection !== null && !isConfirmed && (
          <div className="join-us-letter-frame">
            {/* Top Right Corner Close Button */}
            <button
              type="button"
              className="join-us-letter-close-btn"
              onClick={() => setSelection(null)}
              aria-label="Close letter and return to options"
              title="Close and return to options"
            >
              <X size={17} />
            </button>

            <div className="join-us-letter-fold-shadow" aria-hidden="true" />

            <div className="join-us-letter-head">
              <div
                className={`join-us-letter-seal-mini ${selection === "declining" ? "seal-decline" : ""
                  }`}
                aria-hidden="true"
              >
                <Heart size={20} fill="currentColor" />
              </div>

              {selection === "attending" ? (
                <>
                  <span className="join-us-letter-badge">AN INVITATION FOR YOU</span>
                  <h3 className="join-us-letter-title">WE&apos;RE SO HAPPY TO HAVE YOU</h3>
                  <p className="join-us-letter-lead">
                    Please let us know your details so we can save a place for you at our wedding table.
                  </p>
                </>
              ) : (
                <>
                  <span className="join-us-letter-badge">WITH LOVE & GRATITUDE</span>
                  <h3 className="join-us-letter-title">WE&apos;LL MISS YOU</h3>
                  <p className="join-us-letter-lead">
                    Thank you for being part of our special day, even from afar. Your love and blessings
                    mean so much to us. ♡
                  </p>
                </>
              )}
            </div>

            <form className="join-us-form" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="join-us-field">
                <label className="join-us-field-label" htmlFor="rsvp-guest-name">
                  <span>Your Name</span>
                  <span className="req">*</span>
                </label>
                <input
                  id="rsvp-guest-name"
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sunil Perera or The Perera Family"
                  className="join-us-input"
                  autoFocus
                />
              </div>

              {/* Number of Guests (Only for Attending) */}
              {selection === "attending" && (
                <div className="join-us-field">
                  <div className="join-us-field-header">
                    <label className="join-us-field-label">Number of Guests Attending</label>
                    <span className="join-us-field-hint">
                      Total seats for your party (including yourself)
                    </span>
                  </div>
                  <div className="join-us-guest-pills" role="radiogroup" aria-label="Number of Guests">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        className={`join-us-guest-pill ${guestCount === num ? "active" : ""}`}
                        onClick={() => setGuestCount(num)}
                        role="radio"
                        aria-checked={guestCount === num}
                      >
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wish Message */}
              <div className="join-us-field">
                <label className="join-us-field-label" htmlFor="rsvp-wish-message">
                  {selection === "attending" ? (
                    <span>Leave a little wish for us</span>
                  ) : (
                    <span>Send your warm blessings</span>
                  )}
                </label>
                <textarea
                  id="rsvp-wish-message"
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder={
                    selection === "attending"
                      ? "Write a little note or blessings for our new beginning..."
                      : "Send your warm wishes for Thushara & Wadusha..."
                  }
                  rows={3}
                  className="join-us-textarea"
                />
              </div>

              {/* Form Buttons */}
              <div className="join-us-form-actions">
                <button
                  type="submit"
                  className={`join-us-submit-btn ${selection === "declining" ? "btn-decline" : ""
                    }`}
                >
                  {selection === "attending" ? (
                    <>
                      <span>Confirm Attendance</span>
                      <Heart size={16} fill="currentColor" />
                    </>
                  ) : (
                    <>
                      <span>Send Your Blessings</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="join-us-switch-btn"
                  onClick={() =>
                    handleSwitchSelection(selection === "attending" ? "declining" : "attending")
                  }
                >
                  {selection === "attending"
                    ? "Unable to attend? Send your love from afar instead"
                    : "Plans changed? I'd love to attend instead"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Phase 3: Confirmation State (Magical Golden Petals & Saved Seat) */}
        {isConfirmed && (
          <div className="join-us-confirm-frame">
            <div
              className={`join-us-confirm-seal ${selection === "declining" ? "seal-decline" : ""
                }`}
              aria-hidden="true"
            >
              {selection === "attending" ? (
                <Heart size={28} fill="currentColor" />
              ) : (
                <Smile size={28} />
              )}
            </div>

            {selection === "attending" ? (
              <>
                <span className="join-us-confirm-badge">✦ YOUR SEAT IS SAVED ✦</span>
                <h3 className="join-us-confirm-title">WE CAN&apos;T WAIT TO SEE YOU!</h3>
                <p className="join-us-confirm-name">Dearest {guestName},</p>
                <p className="join-us-confirm-summary">
                  We are delighted to celebrate this once-in-a-lifetime beginning with you.
                  {guestCount > 1
                    ? ` We have reserved ${guestCount} seats in your honour.`
                    : " Your seat is warmly reserved."}
                  {wishMessage && <i> &ldquo;{wishMessage}&rdquo;</i>}
                </p>

                <div className="join-us-confirm-actions">
                  <button
                    type="button"
                    className="join-us-action-pill primary"
                    onClick={handleSaveCalendar}
                  >
                    {calendarSaved ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Date Saved!</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck size={16} />
                        <span>Save to Calendar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="join-us-action-pill secondary"
                    onClick={handleScrollToDetails}
                  >
                    <span>View Wedding Details</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="join-us-confirm-badge">✦ THANK YOU FOR YOUR LOVE ✦</span>
                <h3 className="join-us-confirm-title">WE&apos;LL MISS YOU DEARLY</h3>
                <p className="join-us-confirm-name">Dearest {guestName},</p>
                <p className="join-us-confirm-summary">
                  Thank you for your heartfelt blessing. Though distance may keep us apart in person,
                  your warm wishes will be held close in our hearts throughout our special day.
                  {wishMessage && <i> &ldquo;{wishMessage}&rdquo;</i>}
                </p>

                <div className="join-us-confirm-actions">
                  <button
                    type="button"
                    className="join-us-action-pill secondary"
                    onClick={handleScrollToDetails}
                  >
                    <span>View Wedding Details</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </>
            )}

            <div>
              <button type="button" className="join-us-edit-link" onClick={handleEdit}>
                <Edit3 size={14} style={{ display: "inline", marginRight: "5px" }} />
                Need to change or update your RSVP?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Seamless Fade */}
      <div className="join-us-bottom-fade" aria-hidden="true" />
    </section>
  );
}

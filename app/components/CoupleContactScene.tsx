"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Copy,
  Check,
  Heart,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";

interface ContactPerson {
  key: string;
  role: string;
  name: string;
  displayNumber: string;
  rawNumber: string;
  intlNumber: string;
}

const CONTACTS: ContactPerson[] = [
  {
    key: "groom",
    role: "THE GROOM",
    name: "Thushara",
    displayNumber: "076 663 5670",
    rawNumber: "0766635670",
    intlNumber: "+94766635670",
  },
  {
    key: "bride",
    role: "THE BRIDE",
    name: "Wadusha",
    displayNumber: "077 506 5636",
    rawNumber: "0775065636",
    intlNumber: "+94775065636",
  },
];

export default function CoupleContactScene() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  return (
    <section className="contact-ending-scene" id="contact" aria-label="Couple Contact & Farewell">
      {/* Background Radial Glow & Ambient Stardust */}
      <div className="contact-ambient-glow" aria-hidden="true" />
      <div className="contact-stars-layer" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="contact-star"
            style={{
              top: `${(i * 41) % 92 + 4}%`,
              left: `${(i * 61) % 94 + 3}%`,
              animationDelay: `${(i * 0.35).toFixed(2)}s`,
            }}
          />
        ))}
      </div>

      <div className="contact-container">
        {/* Section Header */}
        <header className="contact-header">

          <h2 className="contact-title">GET IN TOUCH</h2>
          <p className="contact-subtitle">
            Need directions or have a question? We’d love to hear from you anytime.
          </p>
        </header>

        {/* Two Hearts Contact Section (Replaces the big rectangular boxes) */}
        <div className="contact-hearts-grid">
          {CONTACTS.map((person) => {
            const isCopied = copiedKey === person.key;
            const waUrl = `https://wa.me/${person.rawNumber.startsWith("0")
              ? "94" + person.rawNumber.slice(1)
              : person.rawNumber
              }`;
            const gradId = `heartGoldGrad-${person.key}`;
            const fillId = `heartFillGrad-${person.key}`;
            const glowId = `heartGlow-${person.key}`;

            return (
              <article
                key={person.key}
                className="contact-heart-unit"
                aria-label={`Contact details for ${person.name} (${person.role})`}
              >
                {/* Heart-Shaped Vessel */}
                <div className="contact-heart-card">
                  <svg
                    className="contact-heart-svg"
                    viewBox="0 0 340 310"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="40%" stopColor="#F5E5FD" stopOpacity="0.9" />
                        <stop offset="75%" stopColor="#C655FD" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#9A26D7" stopOpacity="0.85" />
                      </linearGradient>
                      <linearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3d0356" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#2e0143" stopOpacity="0.88" />
                        <stop offset="100%" stopColor="#190028" stopOpacity="0.92" />
                      </linearGradient>
                      <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow
                          dx="0"
                          dy="8"
                          stdDeviation="14"
                          floodColor="#C655FD"
                          floodOpacity="0.28"
                        />
                      </filter>
                    </defs>
                    <path
                      d="M 170,75
                         C 160,55 140,20 100,20
                         C 45,20 15,65 15,120
                         C 15,185 85,240 170,295
                         C 255,240 325,185 325,120
                         C 325,65 295,20 240,20
                         C 200,20 180,55 170,75 Z"
                      fill={`url(#${fillId})`}
                      stroke={`url(#${gradId})`}
                      strokeWidth="1.8"
                      filter={`url(#${glowId})`}
                    />
                  </svg>

                  {/* Inside Heart Content: Role, Name, and Phone Number */}
                  <div className="contact-heart-inner">

                    <span className="contact-heart-role">{person.role}</span>
                    <h3 className="contact-heart-name">{person.name}</h3>

                    <a
                      href={`tel:${person.intlNumber}`}
                      className="contact-phone-link"
                      title={`Call ${person.name}`}
                    >
                      <span className="contact-phone-number">{person.displayNumber}</span>
                    </a>
                  </div>
                </div>

                {/* Quick Action Pill Buttons (Call, WhatsApp, Copy) */}
                <div className="contact-heart-actions">
                  <a
                    href={`tel:${person.intlNumber}`}
                    className="contact-action-pill call-pill"
                    title={`Call ${person.name}`}
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-action-pill wa-pill"
                    title={`WhatsApp message to ${person.name}`}
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    className={`contact-action-pill copy-pill ${isCopied ? "copied" : ""}`}
                    onClick={() => copyToClipboard(person.key, person.displayNumber)}
                    title="Copy phone number"
                  >
                    {isCopied ? (
                      <>
                        <Check size={13} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* =====================================================================
            GRAND FINALE FAREWELL SECTION (Outer Box Removed)
            Breathes directly against the starry background without heavy borders
            ===================================================================== */}
        <div className="contact-farewell-section">


          <p className="farewell-script">Two hearts, one beautiful beginning</p>
          <h3 className="farewell-heading">SEE YOU ON OUR SPECIAL DAY</h3>


          <p className="farewell-blessing">
            With love and gratitude,<br />
            <strong>Thushara & Wadusha</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

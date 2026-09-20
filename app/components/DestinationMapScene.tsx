"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  Navigation,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Car,
} from "lucide-react";

interface RouteDefinition {
  id: "colombo" | "kaduwela";
  name: string;
  pathD: string;
  milestones: string[];
  startLabel: string;
  startCoords: { x: number; y: number };
}

function GoogleMapsPinIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "inline-block" }}
      aria-hidden="true"
    >
      {/* Official Google Maps Multi-Color Pin */}
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#EA4335"
      />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 2.45 1.3 5.48 3.05 8.35L12 9.5V2z"
        fill="#4285F4"
      />
      <path
        d="M8.05 17.35C9.4 19.55 10.75 21.2 12 22v-6.5l-3.95 1.85z"
        fill="#34A853"
      />
      <path
        d="M12 22c1.25-.8 2.6-2.45 3.95-4.65L12 15.5V22z"
        fill="#FBBC04"
      />
      <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
    </svg>
  );
}

const ROUTES: Record<"colombo" | "kaduwela", RouteDefinition> = {
  colombo: {
    id: "colombo",
    name: "From Colombo (High Level Rd)",
    // Smooth road trajectory: Colombo -> Nugegoda/Maharagama -> Kottawa -> Homagama
    pathD: "M 90 210 C 180 205, 270 225, 380 215 C 470 205, 540 220, 615 228 C 640 231, 660 233, 680 235",
    milestones: ["Colombo", "Maharagama", "Kottawa", "Hotel Green Court"],
    startLabel: "Colombo",
    startCoords: { x: 90, y: 210 },
  },
  kaduwela: {
    id: "kaduwela",
    name: "From Kaduwela (Expressway)",
    // Smooth expressway trajectory: Kaduwela -> Makumbura/Athurugiriya -> Homagama
    pathD: "M 360 65 C 390 105, 430 140, 480 170 C 535 200, 600 220, 680 235",
    milestones: ["Kaduwela", "Makumbura Hub", "Homagama", "Hotel Green Court"],
    startLabel: "Kaduwela",
    startCoords: { x: 360, y: 65 },
  },
};

// Hotel Green Court Homagama Coordinates on the SVG Canvas
const VENUE_COORDS = { x: 680, y: 235 };

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/JMA4mU4P6sHxFWwL7?g_st=ic";

export default function DestinationMapScene() {
  const [selectedRoute, setSelectedRoute] = useState<"colombo" | "kaduwela">("colombo");
  const [carProgress, setCarProgress] = useState<number>(0);
  const [carTransform, setCarTransform] = useState<{ x: number; y: number; angle: number }>({
    x: 90,
    y: 210,
    angle: 0,
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const routePathRef = useRef<SVGPathElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const activeRoute = ROUTES[selectedRoute];

  // Drive animation along the SVG curve using requestAnimationFrame and getPointAtLength
  useEffect(() => {
    let startTimestamp: number | null = null;
    const animationDuration = 5200; // 5.2 seconds for a stately, cinematic glide

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(1, elapsed / animationDuration);

      setCarProgress(progress);

      if (routePathRef.current) {
        const path = routePathRef.current;
        const totalLength = path.getTotalLength();
        const currentLength = progress * totalLength;

        const p1 = path.getPointAtLength(currentLength);
        // Sample ahead for smooth heading angle
        const aheadLength = Math.min(totalLength, currentLength + 2);
        const p2 = path.getPointAtLength(aheadLength);

        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

        setCarTransform({
          x: p1.x,
          y: p1.y,
          angle: angle,
        });
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    };

    setIsPlaying(true);
    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedRoute]);

  const handleReplay = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setCarProgress(0);
    setIsPlaying(true);
    let startTimestamp: number | null = null;
    const animationDuration = 5200;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(1, elapsed / animationDuration);

      setCarProgress(progress);

      if (routePathRef.current) {
        const path = routePathRef.current;
        const totalLength = path.getTotalLength();
        const currentLength = progress * totalLength;

        const p1 = path.getPointAtLength(currentLength);
        const aheadLength = Math.min(totalLength, currentLength + 2);
        const p2 = path.getPointAtLength(aheadLength);

        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

        setCarTransform({
          x: p1.x,
          y: p1.y,
          angle: angle,
        });
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const handleScrollToInvitation = () => {
    const el =
      document.getElementById("family-blessings-scene") ||
      document.getElementById("will-you-join-us") ||
      document.getElementById("home");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="destination-scene"
      id="destination-scene"
      aria-label="Wedding Destination Map"
    >
      {/* Background Celestial Stars */}
      <div className="destination-celestial-bg" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="destination-star"
            style={{
              top: `${(i * 29) % 92 + 4}%`,
              left: `${(i * 47) % 94 + 3}%`,
              animationDelay: `${(i * 0.35).toFixed(2)}s`,
              animationDuration: `${3.2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Destination Map Content */}
      <div className="destination-card-frame">
        {/* Card Header */}
        <header className="dest-header">



          <div className="dest-pin-icon-wrap" aria-hidden="true">
            <MapPin className="dest-venue-pin" />
          </div>

          <h2 className="dest-venue-title">HOTEL GREEN COURT</h2>
          <p className="dest-venue-subtitle">610 Galawila Rd, Homagama</p>



        </header>

        {/* Route Selector Tabs */}
        <div className="dest-route-tabs" role="tablist" aria-label="Route Selection">
          <button
            type="button"
            role="tab"
            aria-selected={selectedRoute === "colombo"}
            className={`dest-route-tab-btn ${selectedRoute === "colombo" ? "active" : ""}`}
            onClick={() => setSelectedRoute("colombo")}
          >

            <span>Via Colombo (High Level Rd)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedRoute === "kaduwela"}
            className={`dest-route-tab-btn ${selectedRoute === "kaduwela" ? "active" : ""}`}
            onClick={() => setSelectedRoute("kaduwela")}
          >

            <span>Via Kaduwela (Expressway)</span>
          </button>
        </div>

        {/* Monochrome Ivory & Gold Stylized Map Viewport */}
        <div className="dest-map-viewport">
          {/* Replay Controls Overlay */}
          <div className="dest-map-overlay-controls">
            <button
              type="button"
              className="dest-control-btn"
              onClick={handleReplay}
              title="Replay journey route"
            >
              <RotateCcw size={12} />
              <span>{isPlaying ? "DRIVING..." : "REPLAY ROUTE"}</span>
            </button>
          </div>

          <svg
            className="dest-map-svg"
            viewBox="0 0 800 380"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subtle Linear Gradients */}
              <linearGradient id="routeGoldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C655FD" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#9A26D7" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#F3D8FF" stopOpacity="1" />
              </linearGradient>

              <radialGradient id="venueGlowRad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C655FD" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#9A26D7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#760EAB" stopOpacity="0" />
              </radialGradient>

              {/* Vehicle Drop Shadow */}
              <filter id="carShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#760EAB" floodOpacity="0.3" />
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C655FD" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Architectural Grid (Monochrome Ivory / Faint Gold) */}
            <g className="map-grid-layer" opacity="0.8">
              {[60, 140, 220, 300].map((y) => (
                <line key={`gh-${y}`} x1="40" y1={y} x2="760" y2={y} className="map-grid-line" />
              ))}
              {[120, 220, 320, 420, 520, 620, 720].map((x) => (
                <line key={`gv-${x}`} x1={x} y1="30" x2={x} y2="350" className="map-grid-line" />
              ))}
            </g>

            {/* Stylized Topographic Contours */}
            <path
              d="M 50 320 Q 200 350, 400 310 T 750 340"
              className="map-terrain-contour"
            />
            <path
              d="M 60 70 Q 240 40, 480 80 T 740 60"
              className="map-terrain-contour"
            />

            {/* Surrounding Network Minor Roads (Monochrome Ivory) */}
            <g className="map-minor-roads-layer">
              {/* Outer feeder roads */}
              <path d="M 80 140 Q 150 160, 220 150 T 360 170" className="map-minor-road" />
              <path d="M 220 150 L 250 290" className="map-minor-road" />
              <path d="M 360 170 L 390 320" className="map-minor-road" />
              <path d="M 480 170 L 520 330" className="map-minor-road" />
              <path d="M 520 80 L 550 220" className="map-minor-road" />
              <path d="M 620 100 Q 640 180, 680 235" className="map-minor-road" />
              <path d="M 680 235 L 750 250" className="map-minor-road" />
              <path d="M 680 235 L 700 340" className="map-minor-road" />
              <path d="M 420 280 Q 560 300, 730 290" className="map-minor-road" />
            </g>

            {/* Arterial Highways: Colombo -> Homagama & Kaduwela -> Expressway */}
            <g className="map-highways-layer">
              {/* A4 High Level Road */}
              <path
                d="M 90 210 C 180 205, 270 225, 380 215 C 470 205, 540 220, 615 228 C 640 231, 660 233, 680 235"
                className="map-major-highway"
              />
              <path
                d="M 90 210 C 180 205, 270 225, 380 215 C 470 205, 540 220, 615 228 C 640 231, 660 233, 680 235"
                className="map-highway-core"
              />

              {/* Outer Circular Expressway E02 from Kaduwela */}
              <path
                d="M 360 65 C 390 105, 430 140, 480 170 C 535 200, 600 220, 680 235"
                className="map-major-highway"
              />
              <path
                d="M 360 65 C 390 105, 430 140, 480 170 C 535 200, 600 220, 680 235"
                className="map-highway-core"
              />
            </g>

            {/* Active Selected Route (Animated Glowing Gold Stream) */}
            <g className="map-active-route-layer">
              <path
                d={activeRoute.pathD}
                className="map-active-route-base"
              />
              <path
                ref={routePathRef}
                d={activeRoute.pathD}
                className="map-active-route-glow"
              />
            </g>

            {/* Waypoint Markers */}
            {/* Colombo Waypoint */}
            <g className="map-waypoint-colombo" transform="translate(90, 210)">
              <circle r="12" className="map-waypoint-circle-bg" />
              <circle r="4" className="map-waypoint-circle-core" />
              <text x="0" y="-18" textAnchor="middle" className="map-waypoint-label">
                COLOMBO
              </text>
              <text x="0" y="-7" textAnchor="middle" className="map-waypoint-sublabel">
                STARTING HUB
              </text>
            </g>

            {/* Kaduwela Waypoint */}
            <g className="map-waypoint-kaduwela" transform="translate(360, 65)">
              <circle r="12" className="map-waypoint-circle-bg" />
              <circle r="4" className="map-waypoint-circle-core" />
              <text x="0" y="-18" textAnchor="middle" className="map-waypoint-label">
                KADUWELA
              </text>
              <text x="0" y="-7" textAnchor="middle" className="map-waypoint-sublabel">
                EXPRESSWAY INTERCHANGE
              </text>
            </g>

            {/* Mid-Way Junction: Kottawa / Makumbura Interchange */}
            <g className="map-waypoint-kottawa" transform="translate(480, 185)">
              <circle r="6" className="map-waypoint-circle-bg" />
              <circle r="2.5" className="map-waypoint-circle-core" />
              <text x="0" y="20" textAnchor="middle" className="map-waypoint-sublabel">
                KOTTAWA / MAKUMBURA
              </text>
            </g>

            {/* Destination Beacon: Hotel Green Court, Homagama */}
            <g className="map-dest-group" transform={`translate(${VENUE_COORDS.x}, ${VENUE_COORDS.y})`}>
              {/* Pulsing Beacon Rings */}
              <circle r="16" className="map-dest-beacon-pulse" />
              <circle r="24" className="map-dest-beacon-inner-pulse" />
              <circle r="36" fill="url(#venueGlowRad)" />

              {/* Pin Base & Center */}
              <circle r="8" fill="#ffffff" stroke="#760EAB" strokeWidth="2.5" />
              <circle r="4" fill="#9A26D7" />

              {/* Destination Label */}
              <text x="0" y="-34" textAnchor="middle" className="map-dest-label">
                HOTEL GREEN COURT
              </text>
              <text x="0" y="-20" textAnchor="middle" className="map-dest-sublabel">
                HOMAGAMA · DESTINATION
              </text>
            </g>

            {/* Traveling Car Marker */}
            <g
              className="map-traveling-car-group"
              transform={`translate(${carTransform.x}, ${carTransform.y}) rotate(${carTransform.angle})`}
              filter="url(#carShadow)"
            >
              {/* Headlights beam */}
              <polygon
                points="12,-4 26,-9 26,9 12,4"
                className="map-car-headlights"
              />

              {/* Sleek Coupe Silhouette (Top View) */}
              {/* Main Body */}
              <rect
                x="-12"
                y="-6"
                width="24"
                height="12"
                rx="3.5"
                className="map-car-body"
              />
              {/* Roof / Windshield Glass */}
              <rect
                x="-5"
                y="-4"
                width="11"
                height="8"
                rx="1.5"
                fill="#FAF2FE"
                stroke="#760EAB"
                strokeWidth="0.8"
              />
              {/* Front bumper accent */}
              <rect x="11" y="-4.5" width="2" height="9" rx="1" fill="#760EAB" />
              {/* Rear tail lights */}
              <rect x="-12.5" y="-5" width="1.5" height="3" fill="#C655FD" />
              <rect x="-12.5" y="2" width="1.5" height="3" fill="#C655FD" />
            </g>
          </svg>
        </div>

        {/* Route Milestones Bar (Concept Photo Style: Colombo/Kaduwela | Hotel Green Court) */}
        <div className="dest-timeline-milestones" aria-label="Route waypoints">
          {activeRoute.milestones.map((stepName, idx) => (
            <React.Fragment key={stepName}>
              <div
                className={`dest-milestone-step ${carProgress >= idx / (activeRoute.milestones.length - 1) ? "active" : ""
                  }`}
              >
                <span className="dest-milestone-bullet" />
                <span>{stepName}</span>
              </div>
              {idx < activeRoute.milestones.length - 1 && (
                <span className="dest-milestone-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Hotel Location QR Code & Navigation Card */}
        <div className="dest-qr-section">
          <div className="dest-qr-card">
            {/* Visual Frame: QR Code with Gold Accents */}
            <div className="dest-qr-visual-wrap">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="dest-qr-link"
                title="Scan or tap to open Hotel Green Court location in Google Maps"
              >
                <div className="dest-qr-code-box">
                  {/* Subtle traditional gold ornamental corners */}
                  <span className="dest-qr-corner dest-qr-corner-tl" />
                  <span className="dest-qr-corner dest-qr-corner-tr" />
                  <span className="dest-qr-corner dest-qr-corner-bl" />
                  <span className="dest-qr-corner dest-qr-corner-br" />

                  {/* Subtle futuristic / luxury laser scan line */}
                  <div className="dest-qr-scanline" aria-hidden="true" />

                  <Image
                    src="/images/hotel_location_qr.png"
                    alt="Hotel Green Court Google Maps Location QR Code"
                    width={150}
                    height={150}
                    className="dest-qr-img"
                    priority
                  />
                </div>
              </a>
            </div>

            {/* Information & Direct Navigation Button */}
            <div className="dest-qr-content">


              <h3 className="dest-qr-title">Scan for Hotel Location</h3>

              <p className="dest-qr-instruction">
                Scan with your phone camera for live turn-by-turn navigation to{" "}
                <strong className="dest-qr-hotel-name">Hotel Green Court</strong>, Homagama.
              </p>

              <div className="dest-qr-actions">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dest-directions-btn google-maps-btn"
                  title="Open Hotel Green Court in Google Maps for turn-by-turn navigation"
                >
                  <GoogleMapsPinIcon size={20} />
                  <span className="google-maps-btn-text">Open in Google Maps</span>
                  <ExternalLink size={14} className="google-maps-btn-arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Cue to Wedding Details */}
        <div className="dest-footer-action-wrap">
          <div className="dest-scroll-cue-wrap">
            <button
              type="button"
              className="scroll-down-cue-btn"
              onClick={handleScrollToInvitation}
              aria-label="Scroll down to invitation details"
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

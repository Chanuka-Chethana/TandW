"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Camera,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ArrowDown,
  RotateCcw,
  Grid,
  Layers,
} from "lucide-react";

export interface PhotoItem {
  id: number;
  src: string;
  width: number;
  height: number;
  isLandscape: boolean;
  caption: string;
  rotation: number;
}

export const PHOTOS: PhotoItem[] = [
  {
    id: 1,
    src: "/photos/moments/photo-1.webp",
    width: 1086,
    height: 1448,
    isLandscape: false,
    caption: "The Beginning of Forever",
    rotation: -3.2,
  },
  {
    id: 2,
    src: "/photos/moments/photo-2.webp",
    width: 1086,
    height: 1448,
    isLandscape: false,
    caption: "Where Love Finds its Home",
    rotation: 3.5,
  },
  {
    id: 3,
    src: "/photos/moments/photo-3.webp",
    width: 1448,
    height: 1086,
    isLandscape: true,
    caption: "Golden Sunsets With You",
    rotation: -1.8,
  },
  {
    id: 4,
    src: "/photos/moments/photo-4.webp",
    width: 1086,
    height: 1448,
    isLandscape: false,
    caption: "Laughter in Every Step",
    rotation: 4.2,
  },
  {
    id: 5,
    src: "/photos/moments/photo-5.webp",
    width: 1448,
    height: 1086,
    isLandscape: true,
    caption: "Hand in Hand, Heart to Heart",
    rotation: -4.0,
  },
  {
    id: 6,
    src: "/photos/moments/photo-6.webp",
    width: 1086,
    height: 1448,
    isLandscape: false,
    caption: "Whispers of Tomorrow",
    rotation: 2.8,
  },
  {
    id: 7,
    src: "/photos/moments/photo-7.webp",
    width: 1448,
    height: 1086,
    isLandscape: true,
    caption: "Two Souls, One Journey",
    rotation: -3.0,
  },
  {
    id: 8,
    src: "/photos/moments/photo-8.webp",
    width: 1086,
    height: 1448,
    isLandscape: false,
    caption: "The Warmth of Your Embrace",
    rotation: 3.2,
  },
  {
    id: 9,
    src: "/photos/moments/photo-9.webp",
    width: 1024,
    height: 1536,
    isLandscape: false,
    caption: "Purest Joy",
    rotation: -2.0,
  },
  {
    id: 10,
    src: "/photos/moments/photo-10.webp",
    width: 1086,
    height: 1448,
    isLandscape: false,
    caption: "Forever by Your Side",
    rotation: 3.8,
  },
  {
    id: 11,
    src: "/photos/moments/photo-11.webp",
    width: 509,
    height: 645,
    isLandscape: false,
    caption: "Our Love Story",
    rotation: -2.4,
  },
];

// Phase thresholds along the scroll track (0.0 to 1.0)
const STAGES = [
  { id: 1, label: "Photo 1 floats upward", range: [0.05, 0.26] },
  { id: 2, label: "Photo 2 drifts in", range: [0.22, 0.46] },
  { id: 3, label: "Photo 3 overlaps it", range: [0.42, 0.68] },
  { id: 4, label: "Photo 4 appears", range: [0.62, 0.84] },
  { id: 5, label: "Composition settles", range: [0.82, 1.0] },
];

export default function MomentsWeLoveScene() {
  const [photos, setPhotos] = useState<PhotoItem[]>(PHOTOS);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"floating" | "gallery">("floating");

  const trackRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  // Fetch dynamic photos list from /api/photos
  useEffect(() => {
    fetch("/api/photos")
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos(data.photos);
        }
      })
      .catch((err) => console.log("Photos load error:", err));
  }, []);

  // Monitor scroll progress smoothly inside trackRef
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = rect.height - windowH;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollProgress(progress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activePhotoIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePhotoIdx(null);
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIdx((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setActivePhotoIdx((prev) =>
          prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activePhotoIdx]);

  // Current choreography status text
  const currentStage = useMemo(() => {
    if (scrollProgress < 0.05) return "Scroll to float memories";
    if (scrollProgress < 0.25) return "Photo 1 floats upward...";
    if (scrollProgress < 0.45) return "Photo 2 drifts in...";
    if (scrollProgress < 0.65) return "Photo 3 overlaps it...";
    if (scrollProgress < 0.82) return "Photo 4 appears...";
    return "Composition settled ✦";
  }, [scrollProgress]);

  // Helper to interpolate between ranges
  const calcP = (min: number, max: number) => {
    return Math.max(0, Math.min(1, (scrollProgress - min) / (max - min)));
  };

  const p1 = calcP(0.04, 0.24); // Photo 1: floats upward
  const p2 = calcP(0.20, 0.44); // Photo 2: drifts in
  const p3 = calcP(0.40, 0.64); // Photo 3: overlaps it
  const p4 = calcP(0.58, 0.80); // Photo 4: appears
  const pRest = calcP(0.76, 0.96); // Photos 5-11: settle into composition
  const isSettled = scrollProgress >= 0.86;

  const photo1 = photos[0] || PHOTOS[0];
  const photo2 = photos[1] || PHOTOS[1];
  const photo3 = photos[2] || PHOTOS[2];
  const photo4 = photos[3] || PHOTOS[3];
  const peripheralPhotos = photos.slice(4);

  const scrollToTrackStart = () => {
    if (trackRef.current) {
      trackRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="moments-master-container" id="moments-we-love">
      {/* =========================================================================
          PART 1: SCROLL-DRIVEN FLOATING PHOTOGRAPHS TRACK (Sticky Interactive View)
          ========================================================================= */}
      <section ref={trackRef} className="moments-scroll-track" aria-label="Floating Photographs Interaction">
        <div className="moments-sticky-stage">
          {/* Ambient Lighting & Particles */}
          <div className="moments-ambient-glow" aria-hidden="true" />
          <div className="moments-stars-layer" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="moments-star"
                style={{
                  top: `${(i * 37) % 92 + 4}%`,
                  left: `${(i * 59) % 94 + 3}%`,
                  animationDelay: `${(i * 0.28).toFixed(2)}s`,
                }}
              />
            ))}
          </div>

          {/* Sticky Header */}
          <header className="moments-sticky-header">
            <h2 className="moments-title">MOMENTS WE LOVE</h2>
            <p className="moments-subtitle">
              From one hello to a lifetime of hellos.
            </p>

            {/* Live Choreography Pill Indicator */}
            <div className="moments-choreography-badge" role="status" aria-live="polite">

              <span>{currentStage}</span>
              <span className="progress-fraction">({Math.round(scrollProgress * 100)}%)</span>
            </div>

            {/* Progress Stepper Dots */}
            <div className="moments-stepper-dots" aria-hidden="true">
              {STAGES.map((s, idx) => {
                const active = scrollProgress >= s.range[0];
                const current = scrollProgress >= s.range[0] && scrollProgress <= s.range[1];
                return (
                  <span
                    key={s.id}
                    className={`stepper-dot ${active ? "active" : ""} ${current ? "current" : ""}`}
                    title={s.label}
                  />
                );
              })}
            </div>
          </header>

          {/* View Toggle Bar (Floating Stage vs All Photos Grid) */}
          <div className="moments-control-bar">
            <button
              type="button"
              className={`control-tab ${viewMode === "floating" ? "active" : ""}`}
              onClick={() => setViewMode("floating")}
            >
              <Layers size={14} />
              <span>Floating Stage</span>
            </button>
            <button
              type="button"
              className={`control-tab ${viewMode === "gallery" ? "active" : ""}`}
              onClick={() => {
                setViewMode("gallery");
                scrollToGallery();
              }}
            >
              <Grid size={14} />
              <span>All Photos</span>
            </button>
          </div>

          {/* =====================================================================
              THE CHOREOGRAPHED FLOATING PHOTOGRAPHS SCENE
              photo 1 floats upward -> photo 2 drifts in -> photo 3 overlaps it
              -> photo 4 appears -> whole composition settles
              ===================================================================== */}
          <div className={`moments-viewport-table ${isSettled ? "is-settled" : ""}`}>
            {/* PHOTO 1: Floats upward from bottom */}
            <div
              className="printed-photo photo-item-1"
              style={{
                opacity: p1,
                transform: `translate3d(0, ${(1 - p1) * 140}px, 0) rotate(${-3.2 * p1}deg) scale(${0.88 + 0.12 * p1
                  })`,
                zIndex: 5,
              }}
              onClick={() => setActivePhotoIdx(0)}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${photo1.caption}`}
            >
              <div className="printed-photo-paper">
                <div className={`printed-photo-img-wrap ${photo1.isLandscape ? "landscape" : "portrait"}`}>
                  <Image
                    src={photo1.src}
                    alt={photo1.caption}
                    width={photo1.width}
                    height={photo1.height}
                    className="printed-photo-img"
                    priority
                  />
                  <div className="printed-photo-lens">
                    <Maximize2 size={16} />
                  </div>
                </div>
                <div className="printed-photo-footer">
                  <span className="photo-caption-text">{photo1.caption}</span>
                  <span className="photo-badge">✦ 01</span>
                </div>
              </div>
            </div>

            {/* PHOTO 2: Drifts in from right */}
            <div
              className="printed-photo photo-item-2"
              style={{
                opacity: p2,
                transform: `translate3d(${(1 - p2) * 160}px, ${(1 - p2) * 40}px, 0) rotate(${3.5 * p2
                  }deg) scale(${0.88 + 0.12 * p2})`,
                zIndex: 6,
              }}
              onClick={() => setActivePhotoIdx(1)}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${photo2.caption}`}
            >
              <div className="printed-photo-paper">
                <div className={`printed-photo-img-wrap ${photo2.isLandscape ? "landscape" : "portrait"}`}>
                  <Image
                    src={photo2.src}
                    alt={photo2.caption}
                    width={photo2.width}
                    height={photo2.height}
                    className="printed-photo-img"
                    priority
                  />
                  <div className="printed-photo-lens">
                    <Maximize2 size={16} />
                  </div>
                </div>
                <div className="printed-photo-footer">
                  <span className="photo-caption-text">{photo2.caption}</span>
                  <span className="photo-badge">✦ 02</span>
                </div>
              </div>
            </div>

            {/* PHOTO 3: Overlaps it from top/center with drop shadow */}
            <div
              className="printed-photo photo-item-3 overlapping-print"
              style={{
                opacity: p3,
                transform: `translate3d(${(1 - p3) * -60}px, ${(1 - p3) * -110}px, 0) rotate(${-1.8 * p3
                  }deg) scale(${0.88 + 0.12 * p3})`,
                zIndex: 16,
              }}
              onClick={() => setActivePhotoIdx(2)}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${photo3.caption}`}
            >
              <div className="printed-photo-paper">
                <div className={`printed-photo-img-wrap ${photo3.isLandscape ? "landscape" : "portrait"}`}>
                  <Image
                    src={photo3.src}
                    alt={photo3.caption}
                    width={photo3.width}
                    height={photo3.height}
                    className="printed-photo-img"
                    priority
                  />
                  <div className="printed-photo-lens">
                    <Maximize2 size={16} />
                  </div>
                </div>
                <div className="printed-photo-footer">
                  <span className="photo-caption-text">{photo3.caption}</span>
                  <span className="photo-badge">✦ 03</span>
                </div>
              </div>
            </div>

            {/* PHOTO 4: Appears from bottom-right */}
            <div
              className="printed-photo photo-item-4"
              style={{
                opacity: p4,
                transform: `translate3d(${(1 - p4) * 80}px, ${(1 - p4) * 110}px, 0) rotate(${4.2 * p4
                  }deg) scale(${0.86 + 0.14 * p4})`,
                zIndex: 20,
              }}
              onClick={() => setActivePhotoIdx(3)}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${photo4.caption}`}
            >
              <div className="printed-photo-paper">
                <div className={`printed-photo-img-wrap ${photo4.isLandscape ? "landscape" : "portrait"}`}>
                  <Image
                    src={photo4.src}
                    alt={photo4.caption}
                    width={photo4.width}
                    height={photo4.height}
                    className="printed-photo-img"
                    priority
                  />
                  <div className="printed-photo-lens">
                    <Maximize2 size={16} />
                  </div>
                </div>
                <div className="printed-photo-footer">
                  <span className="photo-caption-text">{photo4.caption}</span>
                  <span className="photo-badge">✦ 04</span>
                </div>
              </div>
            </div>

            {/* PHOTOS 5 to N: Surrounding Settled Atmosphere Prints */}
            {peripheralPhotos.map((photo, i) => {
              const photoIdx = i + 4;
              const photoNum = photoIdx + 1;
              return (
                <div
                  key={photo.id || photoIdx}
                  className={`printed-photo photo-item-${photoNum} peripheral-print`}
                  style={{
                    opacity: pRest,
                    transform: `translate3d(0, ${(1 - pRest) * 50}px, 0) rotate(${(photo.rotation || 0) * pRest
                      }deg) scale(${0.85 + 0.15 * pRest})`,
                    zIndex: 4 + (i % 4),
                  }}
                  onClick={() => setActivePhotoIdx(photoIdx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View photo: ${photo.caption}`}
                >
                  <div className="printed-photo-paper">
                    <div className={`printed-photo-img-wrap ${photo.isLandscape ? "landscape" : "portrait"}`}>
                      <Image
                        src={photo.src}
                        alt={photo.caption}
                        width={photo.width}
                        height={photo.height}
                        className="printed-photo-img"
                        loading="lazy"
                      />
                      <div className="printed-photo-lens">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                    <div className="printed-photo-footer">
                      <span className="photo-caption-text">{photo.caption}</span>
                      <span className="photo-badge">✦ {String(photoNum).padStart(2, "0")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Action Scroll Hint / Down Arrow */}
          <footer className="moments-bottom-actions">
            {scrollProgress < 0.85 ? (
              <div className="scroll-cue">
                <span className="cue-text">Keep scrolling to reveal all floating moments</span>
                <ArrowDown size={14} className="bounce-arrow" />
              </div>
            ) : (
              <button
                type="button"
                className="explore-gallery-pill"
                onClick={scrollToGallery}
              >
                <span>View All Photos in Detail</span>
                <ArrowDown size={14} />
              </button>
            )}
          </footer>
        </div>
      </section>

      {/* =========================================================================
          PART 2: ALL PHOTOGRAPHS CURATED SHOWCASE (Masonry Wall & Easy Browsing)
          ========================================================================= */}
      <section ref={galleryRef} className="moments-full-showcase" aria-label="All Wedding Photographs">
        <div className="showcase-header">

          <h3 className="showcase-title">A LIFETIME IN THE MAKING</h3>
          <p className="showcase-desc">
            Each printed photograph preserves a precious milestone. Click any portrait to enlarge in full luxury resolution.
          </p>

        </div>

        <div className="showcase-grid">
          {photos.map((photo, idx) => (
            <article
              key={photo.id || idx}
              className="showcase-card"
              style={{
                "--item-rot": `${photo.rotation || 0}deg`,
              } as React.CSSProperties}
              onClick={() => setActivePhotoIdx(idx)}
              role="button"
              tabIndex={0}
              aria-label={`Enlarge photo: ${photo.caption}`}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActivePhotoIdx(idx)}
            >
              <div className="showcase-paper">
                <div className={`showcase-media ${photo.isLandscape ? "landscape" : "portrait"}`}>
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={photo.width || 1086}
                    height={photo.height || 1448}
                    className="showcase-img"
                    loading="lazy"
                    quality={90}
                  />
                  <div className="showcase-hover-lens" aria-hidden="true">
                    <Maximize2 size={20} />
                  </div>
                </div>
                <div className="showcase-caption-bar">
                  <span className="showcase-caption-title">{photo.caption}</span>
                  <span className="showcase-badge">✦ {String(idx + 1).padStart(2, "0")}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="showcase-back-top">
          <button type="button" className="replay-btn" onClick={scrollToTrackStart}>
            <RotateCcw size={14} />
            <span>Replay Floating Photographs</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          PART 3: LUXURY FULL-SCREEN LIGHTBOX MODAL
          ========================================================================= */}
      {activePhotoIdx !== null && photos[activePhotoIdx] && (
        <div
          className="moments-lightbox-backdrop"
          onClick={() => setActivePhotoIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Full size photo viewer"
        >
          <div
            className="moments-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="moments-lightbox-close"
              onClick={() => setActivePhotoIdx(null)}
              aria-label="Close viewer"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>

            {/* Prev Button */}
            <button
              type="button"
              className="moments-lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx((prev) =>
                  prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null
                );
              }}
              aria-label="Previous photograph"
              title="Previous photo (Left arrow)"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              className="moments-lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx((prev) =>
                  prev !== null ? (prev < photos.length - 1 ? prev + 1 : 0) : null
                );
              }}
              aria-label="Next photograph"
              title="Next photo (Right arrow)"
            >
              <ChevronRight size={28} />
            </button>

            {/* Fine-Art Photographic Paper Frame in Lightbox */}
            <div className="moments-lightbox-photo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[activePhotoIdx].src}
                alt={photos[activePhotoIdx].caption}
                className="moments-lightbox-img"
              />

              <div className="moments-lightbox-caption">
                <span className="moments-lightbox-caption-text">
                  {photos[activePhotoIdx].caption}
                </span>
                <span className="moments-lightbox-counter">
                  {activePhotoIdx + 1} / {photos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

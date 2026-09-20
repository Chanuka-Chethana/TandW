"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Music2, VolumeX } from "lucide-react";

import GoldenPoruwaPreloader, { PoruwaReplayTrigger } from "./components/GoldenPoruwaPreloader";
import AlmanacCalendarScene from "./components/AlmanacCalendarScene";
import OrderOfTheDayScene from "./components/OrderOfTheDayScene";
import LiveCountdownScene from "./components/LiveCountdownScene";
import DestinationMapScene from "./components/DestinationMapScene";
import FamilyBlessingsScene from "./components/FamilyBlessingsScene";
import WillYouJoinUsScene from "./components/WillYouJoinUsScene";
import MomentsWeLoveScene from "./components/MomentsWeLoveScene";
import CoupleContactScene from "./components/CoupleContactScene";

import "./order_of_day.css";
import "./countdown.css";
import "./destination_map.css";
import "./family_blessings.css";
import "./will_you_join_us.css";
import "./moments_we_love.css";
import "./couple_contact.css";

export default function Home() {
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and handle background music autoplay + user interaction unlock
  useEffect(() => {
    const audio = new Audio("/music/wedding-invitation-music.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    // Check if active music track was customized in admin
    fetch("/api/music")
      .then((res) => res.json())
      .then((data) => {
        if (data.activeMusic && audioRef.current) {
          const wasPlaying = !audioRef.current.paused;
          audioRef.current.src = data.activeMusic;
          if (wasPlaying) {
            audioRef.current.play().catch(() => {});
          }
        }
      })
      .catch(() => {});

    // Attempt autoplay immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setMusicOn(true);
        })
        .catch(() => {
          // Browser prevented autoplay without interaction: wait for first gesture
          const handleFirstGesture = () => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current
                .play()
                .then(() => setMusicOn(true))
                .catch(() => {});
            }
            window.removeEventListener("click", handleFirstGesture);
            window.removeEventListener("touchstart", handleFirstGesture);
            window.removeEventListener("scroll", handleFirstGesture);
          };

          window.addEventListener("click", handleFirstGesture, { passive: true });
          window.addEventListener("touchstart", handleFirstGesture, { passive: true });
          window.addEventListener("scroll", handleFirstGesture, { passive: true });
        });
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Toggle Play / Pause function
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      audioRef.current
        .play()
        .then(() => setMusicOn(true))
        .catch((err) => console.log("Audio play error:", err));
    }
  };

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    setPreloaderActive(true);
  };

  return (
    <main>
      {/* Scene 1: Auspicious Golden Poruwa Preloader Curtain Reveal */}
      <GoldenPoruwaPreloader
        key={replayKey}
        isOpen={preloaderActive}
        onComplete={() => {
          setPreloaderActive(false);
          // When preloader curtain opens, ensure audio starts playing if paused
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current
              .play()
              .then(() => setMusicOn(true))
              .catch(() => {});
          }
        }}
      />

      {/* Scene 2: The Date Has Been Chosen (Day Reveal) */}
      <AlmanacCalendarScene
        key={`almanac-${replayKey}`}
        isActive={!preloaderActive}
        onExplore={() => {
          const el = document.getElementById("order-of-the-day");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Scene 3: The Day Unfolds — Auspicious Vertical Timeline (Directly after Day Reveal) */}
      <OrderOfTheDayScene />

      {/* Scene 4: Live Time Countdown (Directly after The Day Unfolds) */}
      <LiveCountdownScene />

      {/* Scene 5: Destination Mini Animated Map (Directly after Countdown) */}
      <DestinationMapScene />

      {/* Scene 6: "With the Blessings of Our Families" — Honoring Groom & Bride Parents */}
      <FamilyBlessingsScene />

      {/* Scene 7: "Will You Join Us?" — Heartfelt Acceptance/Decline & RSVP Stationery (Directly after Families) */}
      <WillYouJoinUsScene />

      {/* Scene 7: "Moments We Love" — Floating Photographs Scene */}
      <MomentsWeLoveScene />

      {/* Scene 8: Groom & Bride Contact Scene & Grand Finale */}
      <CoupleContactScene />

      {/* Floating Poruwa Reveal Replay Trigger */}
      <PoruwaReplayTrigger onClick={handleReplay} />

      {/* Ambient Music Toggle Button (Play / Pause) */}
      <button
        type="button"
        className={`music-button ${musicOn ? "playing on" : "paused"}`}
        onClick={toggleMusic}
        aria-label={musicOn ? "Pause wedding music" : "Play wedding music"}
        title={musicOn ? "Pause Music" : "Play Music"}
      >
        {musicOn ? <Music2 size={19} className="music-note-icon" /> : <VolumeX size={19} className="music-muted-icon" />}
        {musicOn && <span className="music-soundwave-ring" aria-hidden="true" />}
      </button>

      {/* Developer Credit Footer */}
      <footer className="footer">
        <span>Made with ❤️ by</span>
        <a
          href="https://www.facebook.com/profile.php/?id=61585220961996"
          target="_blank"
          rel="noopener noreferrer"
          className="developer-link"
          title="Chanuka Chethana on Facebook"
        >
          Chanuka Chethana
        </a>
      </footer>
    </main>
  );
}
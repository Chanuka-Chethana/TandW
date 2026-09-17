"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Music,
  Play,
  Pause,
  Upload,
  ExternalLink,
  Lock,
  LogOut,
  Image as ImageIcon,
  Key,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import "./admin.css";
import { uploadMediaFile } from "../utils/upload";

interface RsvpItem {
  id: string;
  guest: string;
  status: "attending" | "declining";
  guestCount: number;
  message: string;
  createdAt: string;
}

interface PhotoItem {
  id: number;
  src: string;
  width: number;
  height: number;
  isLandscape: boolean;
  caption: string;
  rotation: number;
}

interface MusicTrack {
  id: number;
  src: string;
  title: string;
  uploadedAt: string;
}

export default function AdminDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"rsvps" | "photos" | "music" | "settings">("rsvps");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // RSVP state
  const [rsvps, setRsvps] = useState<RsvpItem[]>([]);
  const [stats, setStats] = useState({
    totalResponses: 0,
    attendingCount: 0,
    decliningCount: 0,
    totalGuestHeadcount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "attending" | "declining">("all");
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(false);

  // Photo state
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [newPhotoData, setNewPhotoData] = useState({
    caption: "",
    isLandscape: false,
    rotation: 0,
  });
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [replacingPhotoId, setReplacingPhotoId] = useState<number | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);

  // Music state
  const [activeMusic, setActiveMusic] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [newMusicFile, setNewMusicFile] = useState<File | null>(null);
  const [newMusicTitle, setNewMusicTitle] = useState("");
  const [previewTrack, setPreviewTrack] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Settings state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Check session storage on mount
  useEffect(() => {
    const authed = sessionStorage.getItem("tw_wedding_admin_auth");
    if (authed === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadRsvps();
      loadPhotos();
      loadMusic();
    }
  }, [isAuthenticated]);

  // Authenticate with PIN
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPinError("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", pin: pinInput.trim() }),
      });
      const data = await res.json();

      if (data.authorized) {
        setIsAuthenticated(true);
        sessionStorage.setItem("tw_wedding_admin_auth", "true");
      } else {
        setPinError(data.error || "Incorrect passcode. Please try again.");
      }
    } catch {
      setPinError("Connection error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tw_wedding_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  // =========================================================================
  // RSVP Actions
  // =========================================================================
  const loadRsvps = async () => {
    setIsLoadingRsvps(true);
    try {
      const res = await fetch("/api/rsvp");
      const data = await res.json();
      setRsvps(data.rsvps || []);
      setStats(
        data.stats || {
          totalResponses: 0,
          attendingCount: 0,
          decliningCount: 0,
          totalGuestHeadcount: 0,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRsvps(false);
    }
  };

  const deleteRsvp = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the RSVP from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/rsvp?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Removed RSVP for ${name}`);
        loadRsvps();
      }
    } catch {
      alert("Failed to delete RSVP.");
    }
  };

  const exportCsv = () => {
    if (rsvps.length === 0) {
      alert("No RSVP responses to export yet.");
      return;
    }

    const headers = ["Guest Name", "Attendance Status", "Party Size", "Personal Wishes", "Submitted Date"];
    const rows = rsvps.map((r) => [
      `"${(r.guest || "").replace(/"/g, '""')}"`,
      `"${r.status === "attending" ? "Joyfully Attending" : "Regretfully Declining"}"`,
      r.status === "attending" ? r.guestCount || 1 : 0,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wedding-rsvps-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded guest list as CSV");
  };

  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // =========================================================================
  // Photo Actions
  // =========================================================================
  const loadPhotos = async () => {
    setIsLoadingPhotos(true);
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoFile) {
      alert("Please select an image file.");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // 1. Direct upload to Supabase Storage (bypasses Vercel 4.5MB limit)
      const { url } = await uploadMediaFile(newPhotoFile, "photo");

      // 2. Add photo record
      const addRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: url,
          caption: newPhotoData.caption || "Cherished Moment",
          isLandscape: newPhotoData.isLandscape,
          rotation: Number(newPhotoData.rotation) || 0,
        }),
      });

      if (addRes.ok) {
        showToast("New photo added to gallery!");
        setIsAddPhotoOpen(false);
        setNewPhotoFile(null);
        setNewPhotoData({ caption: "", isLandscape: false, rotation: 0 });
        loadPhotos();
      } else {
        const errData = await addRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save photo.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to add photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const triggerReplacePhoto = (photoId: number) => {
    setReplacingPhotoId(photoId);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.click();
    }
  };

  const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingPhotoId === null) return;

    showToast("Uploading replacement image...");
    try {
      const { url } = await uploadMediaFile(file, "photo");

      const updateRes = await fetch("/api/photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: replacingPhotoId,
          src: url,
        }),
      });
      if (updateRes.ok) {
        showToast("Photo replaced successfully!");
        loadPhotos();
      } else {
        const errData = await updateRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to replace photo.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to replace image.");
    } finally {
      setReplacingPhotoId(null);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = "";
    }
  };

  const handleUpdatePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      const res = await fetch("/api/photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPhoto),
      });
      if (res.ok) {
        showToast("Photo details updated!");
        setEditingPhoto(null);
        loadPhotos();
      }
    } catch {
      alert("Failed to update photo.");
    }
  };

  const deletePhoto = async (id: number, caption: string) => {
    if (!confirm(`Are you sure you want to delete photo "${caption}"?`)) return;

    try {
      const res = await fetch(`/api/photos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Photo removed from gallery");
        loadPhotos();
      }
    } catch {
      alert("Failed to delete photo.");
    }
  };

  const movePhoto = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= photos.length) return;

    const updated = [...photos];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    setPhotos(updated);
    try {
      await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: updated }),
      });
      showToast("Photo order updated");
    } catch {
      loadPhotos();
    }
  };

  // =========================================================================
  // Music Actions
  // =========================================================================
  const loadMusic = async () => {
    try {
      const res = await fetch("/api/music");
      const data = await res.json();
      setActiveMusic(data.activeMusic || "");
      setMusicTitle(data.musicTitle || "");
      setTracks(data.tracks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const setActiveTrack = async (track: MusicTrack) => {
    try {
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeMusic: track.src,
          musicTitle: track.title,
        }),
      });
      if (res.ok) {
        setActiveMusic(track.src);
        setMusicTitle(track.title);
        showToast(`Active wedding track set to "${track.title}"!`);
      }
    } catch {
      alert("Failed to set active track.");
    }
  };

  const handleUploadMusicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tracks.length >= 5) {
      alert("Maximum limit of 5 soundtracks reached. Please delete an existing track before uploading a new one.");
      return;
    }
    if (!newMusicFile) {
      alert("Please choose an MP3 or audio file.");
      return;
    }

    setIsUploadingMusic(true);
    try {
      showToast("Uploading music track to cloud storage...");
      // 1. Direct upload to Supabase Storage (bypasses Vercel 4.5MB limit)
      const { url } = await uploadMediaFile(newMusicFile, "music");

      const trackTitle = newMusicTitle.trim() || newMusicFile.name.replace(/\.[^/.]+$/, "");

      const updateRes = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeMusic: url,
          musicTitle: trackTitle,
        }),
      });

      const updateData = await updateRes.json().catch(() => ({}));

      if (updateRes.ok && updateData.success) {
        showToast(`New music track uploaded and set as active!`);
        setNewMusicFile(null);
        setNewMusicTitle("");
        loadMusic();
      } else {
        throw new Error(updateData.error || "Failed to update music settings.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload music track.");
    } finally {
      setIsUploadingMusic(false);
    }
  };

  const deleteTrack = async (track: MusicTrack) => {
    const isActive = activeMusic === track.src;
    const confirmMsg = isActive
      ? `"${track.title}" is currently active for wedding guests.\n\nAre you sure you want to delete it? The invitation will automatically switch to another soundtrack.`
      : `Are you sure you want to delete the soundtrack "${track.title}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      if (previewTrack === track.src) {
        if (audioPreviewRef.current) {
          audioPreviewRef.current.pause();
        }
        setPreviewTrack(null);
      }

      showToast("Removing soundtrack...");
      const res = await fetch(`/api/music?id=${track.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        showToast(`Soundtrack "${track.title}" deleted.`);
        if (data.activeMusic) {
          setActiveMusic(data.activeMusic);
          setMusicTitle(data.musicTitle || "");
        }
        loadMusic();
      } else {
        alert(data.error || "Failed to delete soundtrack.");
      }
    } catch {
      alert("Failed to delete soundtrack.");
    }
  };

  const togglePreview = (src: string) => {
    if (previewTrack === src) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPreviewTrack(null);
    } else {
      setPreviewTrack(src);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = src;
        audioPreviewRef.current.play().catch(() => { });
      }
    }
  };

  // =========================================================================
  // Settings Actions
  // =========================================================================
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_pin",
          currentPin,
          newPin,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPinChangeMsg("Passcode changed successfully! Keep it safe.");
        setCurrentPin("");
        setNewPin("");
        showToast("Admin passcode updated");
      } else {
        setPinChangeMsg(data.error || "Failed to change passcode.");
      }
    } catch {
      setPinChangeMsg("Server error.");
    }
  };

  // =========================================================================
  // Render: Passcode Gate Screen
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <main className="admin-gate-screen">
        <div className="admin-ambient-glow" aria-hidden="true" />
        <div className="admin-gate-card">
          <div className="admin-monogram">
            <span>T</span>
            <Heart size={16} fill="#ffd700" color="#ffd700" />
            <span>W</span>
          </div>

          <h1 className="admin-gate-title">ADMIN PORTAL</h1>
          <p className="admin-gate-subtitle">
            Enter your passcode to access RSVP tracking, photo management, and music settings.
          </p>

          <form onSubmit={handleVerifyPin} className="admin-gate-form">
            <div className="pin-input-wrap">
              <Lock size={16} className="pin-lock-icon" />
              <input
                id="admin-passcode-input"
                name="passcode"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit Passcode"
                autoComplete="current-password"
                required
                autoFocus
                className="pin-input"
              />
            </div>

            {pinError && <p className="pin-error-text">{pinError}</p>}

            <button type="submit" disabled={isVerifying} className="admin-primary-btn gate-submit">
              {isVerifying ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="admin-gate-footer">
            <Link href="/" className="back-to-invitation-link">
              ← Return to Wedding Invitation
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // Render: Authenticated Dashboard
  // =========================================================================
  return (
    <main className="admin-dashboard-container">
      {/* Hidden File Input for Image Replacement */}
      <input
        type="file"
        ref={replaceFileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleReplaceFileSelected}
      />

      {/* Audio Element for in-dashboard previews */}
      <audio ref={audioPreviewRef} onEnded={() => setPreviewTrack(null)} />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="admin-toast" role="status">
          <Sparkles size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-nav-brand">
          <div>
            <h1 className="admin-nav-title">THUSHARA & WADUSHA</h1>
            <span className="admin-nav-subtitle">Wedding Management Portal</span>
          </div>
        </div>

        <div className="admin-nav-actions">
          <Link href="/" target="_blank" className="nav-action-pill link-pill">
            <span>View Live Invitation</span>
            <ExternalLink size={13} />
          </Link>
          <button type="button" onClick={handleLogout} className="nav-action-pill logout-pill" title="Sign Out">
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav className="admin-tabs-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "rsvps"}
          className={`tab-btn ${activeTab === "rsvps" ? "active" : ""}`}
          onClick={() => setActiveTab("rsvps")}
        >
          <Users size={16} />
          <span>RSVPs & Guests</span>
          <span className="tab-counter">{rsvps.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "photos"}
          className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          <ImageIcon size={16} />
          <span>Photos Gallery</span>
          <span className="tab-counter">{photos.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "music"}
          className={`tab-btn ${activeTab === "music" ? "active" : ""}`}
          onClick={() => setActiveTab("music")}
        >
          <Music size={16} />
          <span>Background Music</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "settings"}
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Key size={16} />
          <span>Passcode & Info</span>
        </button>
      </nav>

      {/* =====================================================================
          TAB 1: RSVPs & GUEST MANAGEMENT
          ===================================================================== */}
      {activeTab === "rsvps" && (
        <section className="admin-tab-content">
          {/* KPI Analytics Cards */}
          <div className="admin-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">TOTAL RESPONSES</span>
              <div className="kpi-number">{stats.totalResponses}</div>
              <span className="kpi-subtext">Invited Parties Replied</span>
            </div>

            <div className="kpi-card gold">
              <span className="kpi-label">JOYFULLY ATTENDING</span>
              <div className="kpi-number">{stats.attendingCount}</div>
              <span className="kpi-subtext">
                <strong>{stats.totalGuestHeadcount}</strong> Total Guests / Seats
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">UNABLE TO ATTEND</span>
              <div className="kpi-number">{stats.decliningCount}</div>
              <span className="kpi-subtext">Sent Wishes From Afar</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">ATTENDANCE RATE</span>
              <div className="kpi-number">
                {stats.totalResponses > 0
                  ? `${Math.round((stats.attendingCount / stats.totalResponses) * 100)}%`
                  : "0%"}
              </div>
              <span className="kpi-subtext">Acceptance Ratio</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="admin-toolbar">
            <div className="toolbar-search">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search by guest name or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="toolbar-filters">
              <button
                type="button"
                className={`filter-pill ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All ({rsvps.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === "attending" ? "active" : ""}`}
                onClick={() => setStatusFilter("attending")}
              >
                Attending ({stats.attendingCount})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === "declining" ? "active" : ""}`}
                onClick={() => setStatusFilter("declining")}
              >
                Declined ({stats.decliningCount})
              </button>
            </div>

            <div className="toolbar-right-btns">
              <button type="button" onClick={loadRsvps} className="icon-btn" title="Refresh List">
                <RefreshCw size={15} className={isLoadingRsvps ? "spinning" : ""} />
              </button>
              <button type="button" onClick={exportCsv} className="admin-primary-btn csv-btn">
                <Download size={14} />
                <span>Export to CSV</span>
              </button>
            </div>
          </div>

          {/* Guest Responses Table */}
          <div className="admin-table-wrapper">
            {filteredRsvps.length === 0 ? (
              <div className="admin-empty-state">
                <Users size={36} />
                <h3>No RSVP responses found</h3>
                <p>
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "When guests respond to your invitation, their details will appear here automatically."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop & Tablet Table View */}
                <table className="admin-data-table admin-desktop-table">
                  <thead>
                    <tr>
                      <th>GUEST NAME</th>
                      <th>STATUS</th>
                      <th>PARTY SIZE</th>
                      <th>PERSONAL WISHES / MESSAGE</th>
                      <th>SUBMITTED AT</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id}>
                        <td className="guest-name-cell">
                          <strong>{rsvp.guest}</strong>
                        </td>
                        <td>
                          {rsvp.status === "attending" ? (
                            <span className="status-badge attending">
                              <CheckCircle2 size={12} />
                              <span>Attending</span>
                            </span>
                          ) : (
                            <span className="status-badge declining">
                              <XCircle size={12} />
                              <span>Declined</span>
                            </span>
                          )}
                        </td>
                        <td>
                          {rsvp.status === "attending" ? (
                            <span className="party-badge">
                              {rsvp.guestCount} {rsvp.guestCount === 1 ? "Guest" : "Guests"}
                            </span>
                          ) : (
                            <span className="party-muted">—</span>
                          )}
                        </td>
                        <td className="message-cell">
                          {rsvp.message ? (
                            <span className="guest-message">“{rsvp.message}”</span>
                          ) : (
                            <span className="party-muted">No message</span>
                          )}
                        </td>
                        <td className="timestamp-cell">
                          {new Date(rsvp.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="row-delete-btn"
                            onClick={() => deleteRsvp(rsvp.id, rsvp.guest)}
                            title="Delete response"
                            aria-label={`Delete RSVP from ${rsvp.guest}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile-Optimized Executive Cards View */}
                <div className="admin-mobile-cards">
                  {filteredRsvps.map((rsvp) => (
                    <article key={rsvp.id} className="admin-mobile-rsvp-card">
                      <div className="mobile-card-top">
                        <div className="mobile-card-guest">
                          <h4 className="mobile-guest-name">{rsvp.guest}</h4>
                          <span className="mobile-timestamp">
                            {new Date(rsvp.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {rsvp.status === "attending" ? (
                          <span className="status-badge attending">
                            <CheckCircle2 size={12} />
                            <span>Attending</span>
                          </span>
                        ) : (
                          <span className="status-badge declining">
                            <XCircle size={12} />
                            <span>Declined</span>
                          </span>
                        )}
                      </div>

                      <div className="mobile-card-meta">
                        {rsvp.status === "attending" ? (
                          <span className="party-badge">
                            Party of {rsvp.guestCount} {rsvp.guestCount === 1 ? "Guest" : "Guests"}
                          </span>
                        ) : (
                          <span className="party-muted">Sending Love From Afar</span>
                        )}
                      </div>

                      {rsvp.message && (
                        <div className="mobile-message-quote">
                          <p className="mobile-quote-text">“{rsvp.message}”</p>
                        </div>
                      )}

                      <div className="mobile-card-actions">
                        <button
                          type="button"
                          className="mobile-delete-btn"
                          onClick={() => deleteRsvp(rsvp.id, rsvp.guest)}
                        >
                          <Trash2 size={13} />
                          <span>Remove Response</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 2: PHOTO GALLERY MANAGER
          ===================================================================== */}
      {activeTab === "photos" && (
        <section className="admin-tab-content">
          <div className="section-header-bar">
            <div>
              <h2 className="section-heading">MOMENTS WE LOVE PHOTOGRAPHS</h2>
              <p className="section-subheading">
                Manage the floating photographs displayed in your invitation. Reorder, replace images, edit captions, or add new ones.
              </p>
            </div>
            <button
              type="button"
              className="admin-primary-btn"
              onClick={() => setIsAddPhotoOpen(true)}
            >
              <Plus size={15} />
              <span>Add New Photo</span>
            </button>
          </div>

          {/* Photos Grid */}
          <div className="admin-photos-grid">
            {photos.map((photo, index) => (
              <article key={photo.id || index} className="admin-photo-card">
                <div className="admin-photo-preview">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={photo.width || 400}
                    height={photo.height || 400}
                    className="admin-photo-thumb"
                  />
                  <span className="admin-photo-index">✦ {String(index + 1).padStart(2, "0")}</span>
                  <span className="admin-photo-aspect">
                    {photo.isLandscape ? "Landscape 4:3" : "Portrait 3:4"}
                  </span>
                </div>

                <div className="admin-photo-details">
                  <h4 className="admin-photo-caption" title={photo.caption}>
                    {photo.caption}
                  </h4>
                  <span className="admin-photo-rot">Tilt: {photo.rotation || 0}°</span>

                  {/* Actions: Reorder, Replace, Edit, Delete */}
                  <div className="admin-photo-actions">
                    <button
                      type="button"
                      className="photo-action-btn"
                      onClick={() => triggerReplacePhoto(photo.id)}
                      title="Replace this image with a new file"
                    >
                      <Upload size={13} />
                      <span>Replace</span>
                    </button>

                    <button
                      type="button"
                      className="photo-action-btn"
                      onClick={() => setEditingPhoto(photo)}
                      title="Edit caption and orientation"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className="photo-action-btn move"
                      onClick={() => movePhoto(index, "up")}
                      disabled={index === 0}
                      title="Move backward in order"
                    >
                      <ArrowUp size={13} />
                    </button>

                    <button
                      type="button"
                      className="photo-action-btn move"
                      onClick={() => movePhoto(index, "down")}
                      disabled={index === photos.length - 1}
                      title="Move forward in order"
                    >
                      <ArrowDown size={13} />
                    </button>

                    <button
                      type="button"
                      className="photo-action-btn delete"
                      onClick={() => deletePhoto(photo.id, photo.caption)}
                      title="Delete photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Modal: Edit Photo Caption / Orientation */}
          {editingPhoto && (
            <div className="admin-modal-backdrop" onClick={() => setEditingPhoto(null)}>
              <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Edit Photo Details</h3>
                <form onSubmit={handleUpdatePhotoSubmit} className="modal-form">
                  <label className="form-field">
                    <span>Caption</span>
                    <input
                      type="text"
                      value={editingPhoto.caption}
                      onChange={(e) =>
                        setEditingPhoto({ ...editingPhoto, caption: e.target.value })
                      }
                      required
                    />
                  </label>

                  <div className="form-row">
                    <label className="form-field">
                      <span>Orientation</span>
                      <select
                        value={editingPhoto.isLandscape ? "true" : "false"}
                        onChange={(e) =>
                          setEditingPhoto({
                            ...editingPhoto,
                            isLandscape: e.target.value === "true",
                          })
                        }
                      >
                        <option value="false">Portrait (3:4)</option>
                        <option value="true">Landscape (4:3)</option>
                      </select>
                    </label>

                    <label className="form-field">
                      <span>Rotation Angle ({editingPhoto.rotation || 0}°)</span>
                      <input
                        type="range"
                        min="-6"
                        max="6"
                        step="0.5"
                        value={editingPhoto.rotation || 0}
                        onChange={(e) =>
                          setEditingPhoto({
                            ...editingPhoto,
                            rotation: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="admin-secondary-btn"
                      onClick={() => setEditingPhoto(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="admin-primary-btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Add New Photo */}
          {isAddPhotoOpen && (
            <div className="admin-modal-backdrop" onClick={() => setIsAddPhotoOpen(false)}>
              <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Add New Wedding Photo</h3>
                <form onSubmit={handleAddPhotoSubmit} className="modal-form">
                  <label className="form-field">
                    <span>Select Photo File (PNG, JPG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewPhotoFile(e.target.files?.[0] || null)}
                      required
                    />
                    {newPhotoFile && (
                      <span style={{ fontSize: "0.8rem", color: "#d4af37", marginTop: "4px", display: "block" }}>
                        📷 {newPhotoFile.name} ({(newPhotoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    )}
                  </label>

                  <label className="form-field">
                    <span>Romantic Caption</span>
                    <input
                      type="text"
                      placeholder="e.g. Sunset in Nuwara Eliya"
                      value={newPhotoData.caption}
                      onChange={(e) =>
                        setNewPhotoData({ ...newPhotoData, caption: e.target.value })
                      }
                      required
                    />
                  </label>

                  <div className="form-row">
                    <label className="form-field">
                      <span>Orientation</span>
                      <select
                        value={newPhotoData.isLandscape ? "true" : "false"}
                        onChange={(e) =>
                          setNewPhotoData({
                            ...newPhotoData,
                            isLandscape: e.target.value === "true",
                          })
                        }
                      >
                        <option value="false">Portrait (3:4)</option>
                        <option value="true">Landscape (4:3)</option>
                      </select>
                    </label>

                    <label className="form-field">
                      <span>Rotation Tilt ({newPhotoData.rotation}°)</span>
                      <input
                        type="range"
                        min="-6"
                        max="6"
                        step="0.5"
                        value={newPhotoData.rotation}
                        onChange={(e) =>
                          setNewPhotoData({
                            ...newPhotoData,
                            rotation: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="admin-secondary-btn"
                      onClick={() => setIsAddPhotoOpen(false)}
                      disabled={isUploadingPhoto}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadingPhoto}
                      className="admin-primary-btn"
                    >
                      {isUploadingPhoto ? "Uploading & Adding..." : "Add to Invitation"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 3: BACKGROUND MUSIC MANAGER
          ===================================================================== */}
      {activeTab === "music" && (
        <section className="admin-tab-content">
          <div className="section-header-bar">
            <div>
              <h2 className="section-heading">BACKGROUND MUSIC SETTINGS</h2>
              <p className="section-subheading">
                Change or upload the soundtrack that plays when guests open your invitation.
              </p>
            </div>
          </div>

          {/* Current Active Track Card */}
          <div className="current-track-card">
            <div className="track-icon-badge">
              <Music size={24} />
            </div>
            <div className="track-info">
              <span className="track-badge">CURRENTLY ACTIVE IN INVITATION</span>
              <h3 className="track-name">{musicTitle || "Default Wedding Music"}</h3>
              <span className="track-url">{activeMusic}</span>
            </div>
            <button
              type="button"
              className={`preview-play-btn ${previewTrack === activeMusic ? "playing" : ""}`}
              onClick={() => togglePreview(activeMusic)}
            >
              {previewTrack === activeMusic ? <Pause size={16} /> : <Play size={16} />}
              <span>{previewTrack === activeMusic ? "Pause" : "Listen Preview"}</span>
            </button>
          </div>

          {/* Upload New Music Card */}
          <div className="admin-card-box">
            <h3 className="card-box-title">Upload a New Track</h3>
            <p className="card-box-desc">
              Upload your favorite love song or instrumental (supports MP3, M4A, WAV). Up to 5 soundtracks can be uploaded and managed.
            </p>

            {tracks.length >= 5 && (
              <div className="track-limit-alert">
                <span>⚠️ Soundtrack limit reached (5 of 5 used). Please delete an existing track below before uploading a new one.</span>
              </div>
            )}

            <form onSubmit={handleUploadMusicSubmit} className="music-upload-form">
              <div className="form-row">
                <label className="form-field flex-2">
                  <span>Audio File (.mp3, .m4a, .wav)</span>
                  <input
                    type="file"
                    accept="audio/*,.mp3,.m4a,.wav"
                    disabled={tracks.length >= 5 || isUploadingMusic}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setNewMusicFile(file);
                      if (file && !newMusicTitle) {
                        setNewMusicTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }}
                    required
                  />
                  {newMusicFile && (
                    <span style={{ fontSize: "0.8rem", color: "#d4af37", marginTop: "4px", display: "block" }}>
                      🎵 {newMusicFile.name} ({(newMusicFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </label>
                <label className="form-field flex-3">
                  <span>Track Title (Optional)</span>
                  <input
                    type="text"
                    disabled={tracks.length >= 5 || isUploadingMusic}
                    placeholder="e.g. A Thousand Years - Piano Version"
                    value={newMusicTitle}
                    onChange={(e) => setNewMusicTitle(e.target.value)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isUploadingMusic || tracks.length >= 5}
                className="admin-primary-btn"
              >
                <Upload size={14} />
                <span>
                  {tracks.length >= 5
                    ? "Soundtrack Limit Reached (5/5)"
                    : isUploadingMusic
                    ? "Uploading Track..."
                    : "Upload & Set as Active"}
                </span>
              </button>
            </form>
          </div>

          {/* Playlist / Previous Tracks */}
          <div className="admin-card-box">
            <div className="tracks-list-header">
              <h3 className="card-box-title">Available Soundtracks ({tracks.length} / 5)</h3>
              <span className="track-count-badge">{tracks.length} / 5 used</span>
            </div>
            <div className="tracks-list">
              {tracks.map((track, i) => {
                const isActive = activeMusic === track.src;
                const isPlaying = previewTrack === track.src;

                return (
                  <div key={track.id || i} className={`track-list-row ${isActive ? "active-row" : ""}`}>
                    <div className="track-row-left">
                      <button
                        type="button"
                        className="track-mini-play"
                        onClick={() => togglePreview(track.src)}
                        title={isPlaying ? "Pause" : "Play preview"}
                        aria-label={isPlaying ? "Pause soundtrack preview" : "Play soundtrack preview"}
                      >
                        {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                      </button>
                      <div className="track-text-meta">
                        <strong className="track-title-text">{track.title}</strong>
                        <span className="track-src-text">{track.src}</span>
                      </div>
                    </div>

                    <div className="track-row-right">
                      {isActive ? (
                        <span className="active-pill">✦ Active</span>
                      ) : (
                        <button
                          type="button"
                          className="admin-secondary-btn track-set-btn"
                          onClick={() => setActiveTrack(track)}
                        >
                          Set as Active
                        </button>
                      )}
                      <button
                        type="button"
                        className="track-delete-btn"
                        onClick={() => deleteTrack(track)}
                        title="Delete soundtrack"
                        aria-label={`Delete ${track.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 4: SETTINGS & PASSCODE
          ===================================================================== */}
      {activeTab === "settings" && (
        <section className="admin-tab-content">
          <div className="section-header-bar">
            <div>
              <h2 className="section-heading">ADMIN SECURITY & INFO</h2>
              <p className="section-subheading">
                Update the passcode used to log into this administrative portal.
              </p>
            </div>
          </div>

          <div className="admin-card-box max-w-md">
            <h3 className="card-box-title">Change Admin Passcode</h3>
            <form onSubmit={handleChangePin} className="modal-form">
              <label className="form-field">
                <span>Current Passcode</span>
                <input
                  type="password"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter current passcode"
                  required
                />
              </label>

              <label className="form-field">
                <span>New Passcode (at least 4 digits)</span>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="e.g. 1126"
                  required
                />
              </label>

              {pinChangeMsg && (
                <p className={`pin-msg ${pinChangeMsg.includes("success") ? "success" : "error"}`}>
                  {pinChangeMsg}
                </p>
              )}

              <button type="submit" className="admin-primary-btn">
                Update Passcode
              </button>
            </form>
          </div>

          <div className="admin-card-box max-w-md mt-6">
            <h3 className="card-box-title">Quick Invitation Links</h3>
            <p className="card-box-desc">
              Share this link with your guests or preview your changes:
            </p>
            <div className="invite-link-box">
              <code>https://thusharaandwadusha.vercel.app</code>
              <Link href="/" target="_blank" className="admin-secondary-btn">
                Open Link ↗
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

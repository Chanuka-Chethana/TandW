css_content = """/* ==========================================================================
   ROYAL PURPLE ADMIN MANAGEMENT PORTAL — PROFESSIONAL STYLESHEET
   Curated for Thushara & Wadusha's Wedding Web Application
   Aesthetic: Clear, Modern, Professional SaaS in Royal Purple & Crisp White
   Clean typography, high-contrast readability, NO glowing text effects
   Fully Responsive for Desktop, Tablets, and All Mobile Devices
   ========================================================================== */

/* --------------------------------------------------------------------------
   BASE & RESET
   -------------------------------------------------------------------------- */
.admin-gate-screen,
.admin-dashboard-container {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background: radial-gradient(ellipse at 50% 12%, #2e0143 0%, #170024 55%, #0e0017 100%);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.admin-gate-screen *,
.admin-dashboard-container * {
  box-sizing: border-box;
}

/* Subtle Ambient Lighting Glow */
.admin-ambient-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle 600px at 50% 25%, rgba(198, 85, 253, 0.09) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
.admin-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  max-width: calc(100vw - 32px);
  background: rgba(38, 2, 54, 0.96);
  border: 1px solid #C655FD;
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  animation: toastFadeDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
}

.admin-toast span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes toastFadeDown {
  from {
    opacity: 0;
    transform: translate(-50%, -16px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* --------------------------------------------------------------------------
   PASSCODE GATE SCREEN (Desktop & Mobile)
   -------------------------------------------------------------------------- */
.admin-gate-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.admin-gate-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 440px;
  background: rgba(28, 1, 40, 0.92);
  border: 1px solid rgba(198, 85, 253, 0.32);
  border-radius: 20px;
  padding: 44px 32px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.admin-monogram {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #ffffff;
  margin-bottom: 18px;
  padding: 6px 18px;
  border-radius: 999px;
  background: rgba(198, 85, 253, 0.15);
  border: 1px solid rgba(198, 85, 253, 0.35);
}

.admin-gate-title {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.55rem;
  letter-spacing: 0.18em;
  color: #ffffff;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.admin-gate-subtitle {
  font-size: 0.86rem;
  color: #E9D5FF;
  line-height: 1.5;
  margin: 0 0 26px 0;
}

.admin-gate-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pin-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.pin-lock-icon {
  position: absolute;
  left: 16px;
  color: #C655FD;
  pointer-events: none;
}

.pin-input {
  width: 100%;
  background: rgba(18, 0, 26, 0.85);
  border: 1.5px solid rgba(198, 85, 253, 0.3);
  border-radius: 12px;
  padding: 14px 16px 14px 44px;
  font-size: 1.25rem;
  letter-spacing: 0.3em;
  text-align: center;
  color: #ffffff;
  outline: none;
  transition: all 0.25s ease;
  min-height: 48px;
}

.pin-input:focus {
  border-color: #C655FD;
  box-shadow: 0 0 0 3px rgba(198, 85, 253, 0.22);
  background: rgba(24, 1, 35, 0.95);
}

.pin-input::placeholder {
  font-size: 0.85rem;
  letter-spacing: normal;
  color: #8c6fa8;
}

.pin-error-text {
  font-size: 0.84rem;
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  padding: 9px 14px;
  border-radius: 8px;
  margin: 0;
}

.admin-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #9A26D7 0%, #760EAB 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  padding: 13px 24px;
  border: 1px solid rgba(198, 85, 253, 0.45);
  border-radius: 10px;
  cursor: pointer;
  min-height: 46px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 16px rgba(109, 40, 217, 0.3);
}

.admin-primary-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #a833e7 0%, #8312bc 100%);
  border-color: #C655FD;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(109, 40, 217, 0.45);
}

.admin-primary-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.admin-primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.admin-secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(198, 85, 253, 0.1);
  border: 1px solid rgba(198, 85, 253, 0.3);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.86rem;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  min-height: 40px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.admin-secondary-btn:hover {
  background: rgba(198, 85, 253, 0.2);
  border-color: #C655FD;
  color: #ffffff;
}

.admin-secondary-btn:active {
  transform: scale(0.98);
}

.admin-gate-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(198, 85, 253, 0.18);
}

.back-to-invitation-link {
  display: inline-block;
  color: #E9D5FF;
  text-decoration: none;
  font-size: 0.84rem;
  letter-spacing: 0.04em;
  padding: 6px 12px;
  transition: color 0.2s ease;
}

.back-to-invitation-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* --------------------------------------------------------------------------
   DASHBOARD: TOP NAVBAR
   -------------------------------------------------------------------------- */
.admin-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
  background: rgba(18, 1, 26, 0.95);
  border-bottom: 1px solid rgba(198, 85, 253, 0.2);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.nav-monogram {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(198, 85, 253, 0.16);
  border: 1.5px solid #C655FD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.84rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.admin-nav-title {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-nav-subtitle {
  font-size: 0.74rem;
  color: #E9D5FF;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: block;
}

.admin-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.nav-action-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 15px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  min-height: 38px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.link-pill {
  background: rgba(198, 85, 253, 0.14);
  color: #ffffff;
  border-color: rgba(198, 85, 253, 0.35);
}

.link-pill:hover {
  background: rgba(198, 85, 253, 0.25);
  border-color: #C655FD;
  color: #ffffff;
}

.logout-pill {
  background: rgba(255, 255, 255, 0.05);
  color: #E9D5FF;
  border-color: rgba(255, 255, 255, 0.12);
}

.logout-pill:hover {
  background: rgba(239, 68, 68, 0.18);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

/* --------------------------------------------------------------------------
   DASHBOARD: TABS BAR (Horizontally Scrollable on Mobile)
   -------------------------------------------------------------------------- */
.admin-tabs-bar {
  display: flex;
  gap: 8px;
  padding: 10px 32px;
  background: rgba(14, 0, 20, 0.95);
  border-bottom: 1px solid rgba(198, 85, 253, 0.18);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.admin-tabs-bar::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #E9D5FF;
  font-size: 0.86rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  min-height: 42px;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-btn:hover {
  color: #ffffff;
  background: rgba(198, 85, 253, 0.08);
}

.tab-btn.active {
  background: rgba(198, 85, 253, 0.2);
  border-color: #C655FD;
  color: #ffffff;
}

.tab-counter {
  background: rgba(198, 85, 253, 0.25);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
}

.tab-btn.active .tab-counter {
  background: #9A26D7;
  color: #ffffff;
}

/* --------------------------------------------------------------------------
   TAB CONTENT CONTAINER
   -------------------------------------------------------------------------- */
.admin-tab-content {
  max-width: 1360px;
  margin: 0 auto;
  padding: 28px 32px 64px 32px;
}

.section-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-heading {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.35rem;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin: 0 0 6px 0;
  font-weight: 700;
}

.section-subheading {
  font-size: 0.86rem;
  color: #E9D5FF;
  margin: 0;
  line-height: 1.45;
  max-width: 720px;
}

/* --------------------------------------------------------------------------
   TAB 1: RSVP KPI CARDS
   -------------------------------------------------------------------------- */
.admin-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.kpi-card {
  background: rgba(28, 2, 40, 0.85);
  border: 1px solid rgba(198, 85, 253, 0.22);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(198, 85, 253, 0.45);
}

.kpi-card.gold {
  background: linear-gradient(145deg, rgba(62, 3, 90, 0.82) 0%, rgba(28, 2, 40, 0.88) 100%);
  border-color: rgba(198, 85, 253, 0.45);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.kpi-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: #E9D5FF;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.kpi-number {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 6px;
}

.kpi-card.gold .kpi-number {
  color: #ffffff;
}

.kpi-subtext {
  font-size: 0.8rem;
  color: #D1B8E8;
}

.kpi-subtext strong {
  color: #ffffff;
}

/* --------------------------------------------------------------------------
   TOOLBAR (Search, Filter, Actions)
   -------------------------------------------------------------------------- */
.admin-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.toolbar-search {
  position: relative;
  flex: 1;
  min-width: 260px;
  max-width: 440px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #A78BFA;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: rgba(18, 0, 26, 0.85);
  border: 1px solid rgba(198, 85, 253, 0.25);
  border-radius: 999px;
  padding: 11px 16px 11px 40px;
  font-size: 0.88rem;
  color: #ffffff;
  outline: none;
  min-height: 42px;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #C655FD;
  box-shadow: 0 0 0 3px rgba(198, 85, 253, 0.2);
  background: rgba(25, 1, 36, 0.95);
}

.search-input::placeholder {
  color: #8c6fa8;
}

.toolbar-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(198, 85, 253, 0.22);
  color: #E9D5FF;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 38px;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  color: #ffffff;
  border-color: rgba(198, 85, 253, 0.45);
}

.filter-pill.active {
  background: rgba(198, 85, 253, 0.22);
  border-color: #C655FD;
  color: #ffffff;
}

.toolbar-right-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(198, 85, 253, 0.25);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.icon-btn:hover {
  background: rgba(198, 85, 253, 0.2);
  border-color: #C655FD;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.csv-btn {
  padding: 10px 18px;
  font-size: 0.84rem;
  min-height: 40px;
}

/* --------------------------------------------------------------------------
   TAB 1: RSVP DATA VIEWS (Desktop Table + Mobile Cards)
   -------------------------------------------------------------------------- */
.admin-table-wrapper {
  background: rgba(21, 1, 30, 0.9);
  border: 1px solid rgba(198, 85, 253, 0.22);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(14px);
}

/* Desktop Table (Shown on screens >= 769px) */
.admin-desktop-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-desktop-table th {
  background: rgba(36, 3, 52, 0.95);
  padding: 14px 20px;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: #ffffff;
  font-weight: 700;
  border-bottom: 1px solid rgba(198, 85, 253, 0.25);
  text-transform: uppercase;
}

.admin-desktop-table td {
  padding: 16px 20px;
  font-size: 0.88rem;
  border-bottom: 1px solid rgba(198, 85, 253, 0.1);
  color: #E9D5FF;
  vertical-align: middle;
}

.admin-desktop-table tr:hover td {
  background: rgba(198, 85, 253, 0.06);
}

.guest-name-cell strong {
  color: #ffffff;
  font-size: 0.95rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.status-badge.attending {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.status-badge.declining {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.party-badge {
  display: inline-block;
  background: rgba(198, 85, 253, 0.18);
  color: #ffffff;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  border: 1px solid rgba(198, 85, 253, 0.35);
  white-space: nowrap;
}

.party-muted {
  color: #8c6fa8;
  font-style: italic;
  font-size: 0.82rem;
}

.message-cell {
  max-width: 320px;
}

.guest-message {
  color: #ffffff;
  font-style: italic;
  font-size: 0.85rem;
  line-height: 1.4;
  display: block;
}

.timestamp-cell {
  font-size: 0.8rem;
  color: #A78BFA;
  white-space: nowrap;
}

.row-delete-btn {
  background: transparent;
  border: none;
  color: #A78BFA;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  min-width: 36px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.row-delete-btn:hover {
  color: #f87171;
  background: rgba(239, 68, 68, 0.15);
}

/* Mobile Cards View (Hidden on desktop, shown on <= 768px) */
.admin-mobile-cards {
  display: none;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
}

.admin-mobile-rsvp-card {
  background: rgba(27, 2, 38, 0.92);
  border: 1px solid rgba(198, 85, 253, 0.22);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.mobile-card-guest {
  min-width: 0;
  flex: 1;
}

.mobile-guest-name {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 3px 0;
  line-height: 1.3;
}

.mobile-timestamp {
  font-size: 0.74rem;
  color: #A78BFA;
  display: block;
}

.mobile-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mobile-message-quote {
  background: rgba(16, 0, 24, 0.7);
  border-left: 3px solid #C655FD;
  padding: 8px 12px;
  border-radius: 0 8px 8px 0;
}

.mobile-quote-text {
  color: #ffffff;
  font-style: italic;
  font-size: 0.84rem;
  line-height: 1.45;
  margin: 0;
}

.mobile-card-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid rgba(198, 85, 253, 0.12);
}

.mobile-delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  font-size: 0.76rem;
  font-weight: 600;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
  min-height: 36px;
}

.mobile-delete-btn:active {
  background: rgba(239, 68, 68, 0.2);
}

.admin-empty-state {
  text-align: center;
  padding: 56px 20px;
  color: #E9D5FF;
}

.admin-empty-state svg {
  color: #C655FD;
  opacity: 0.5;
  margin-bottom: 14px;
}

.admin-empty-state h3 {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.15rem;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.admin-empty-state p {
  font-size: 0.85rem;
  max-width: 400px;
  margin: 0 auto;
}

/* --------------------------------------------------------------------------
   TAB 2: PHOTO GALLERY GRID
   -------------------------------------------------------------------------- */
.admin-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
}

.admin-photo-card {
  background: rgba(24, 2, 35, 0.9);
  border: 1px solid rgba(198, 85, 253, 0.22);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
}

.admin-photo-card:hover {
  transform: translateY(-2px);
  border-color: #C655FD;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}

.admin-photo-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #100018;
  overflow: hidden;
}

.admin-photo-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.admin-photo-card:hover .admin-photo-thumb {
  transform: scale(1.03);
}

.admin-photo-index {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(18, 0, 26, 0.88);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid rgba(198, 85, 253, 0.35);
  backdrop-filter: blur(6px);
}

.admin-photo-aspect {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(18, 0, 26, 0.88);
  color: #E9D5FF;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
}

.admin-photo-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.admin-photo-caption {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.96rem;
  color: #ffffff;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-photo-rot {
  font-size: 0.76rem;
  color: #A78BFA;
  margin-bottom: 14px;
}

.admin-photo-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(198, 85, 253, 0.15);
  flex-wrap: wrap;
}

.photo-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(198, 85, 253, 0.25);
  color: #ffffff;
  padding: 7px 11px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 36px;
  transition: all 0.2s ease;
}

.photo-action-btn:hover {
  background: rgba(198, 85, 253, 0.2);
  border-color: #C655FD;
}

.photo-action-btn:active {
  transform: scale(0.96);
}

.photo-action-btn.move {
  padding: 7px 9px;
  color: #E9D5FF;
}

.photo-action-btn.move:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.photo-action-btn.delete {
  padding: 7px 9px;
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
  margin-left: auto;
}

.photo-action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: #f87171;
}

/* --------------------------------------------------------------------------
   TAB 2 & 3: MODALS & FORMS (Responsive & Scrollable)
   -------------------------------------------------------------------------- */
.admin-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 0, 16, 0.85);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.admin-modal-box {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  background: rgba(26, 2, 38, 0.98);
  border: 1.5px solid rgba(198, 85, 253, 0.4);
  border-radius: 18px;
  padding: 30px 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
}

.modal-title {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.25rem;
  letter-spacing: 0.08em;
  color: #ffffff;
  margin: 0 0 20px 0;
  text-align: center;
  font-weight: 700;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field span {
  font-size: 0.78rem;
  font-weight: 700;
  color: #E9D5FF;
  letter-spacing: 0.04em;
}

.form-field input[type="text"],
.form-field input[type="password"],
.form-field select {
  background: rgba(14, 0, 20, 0.9);
  border: 1px solid rgba(198, 85, 253, 0.28);
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 1rem;
  color: #ffffff;
  outline: none;
  min-height: 44px;
  transition: all 0.2s ease;
}

.form-field input[type="text"]:focus,
.form-field input[type="password"]:focus,
.form-field select:focus {
  border-color: #C655FD;
  box-shadow: 0 0 0 2px rgba(198, 85, 253, 0.22);
}

.form-field input[type="file"] {
  background: rgba(14, 0, 20, 0.9);
  border: 1px dashed rgba(198, 85, 253, 0.35);
  border-radius: 8px;
  padding: 14px;
  font-size: 0.85rem;
  color: #E9D5FF;
  cursor: pointer;
  min-height: 48px;
}

.form-field input[type="range"] {
  accent-color: #C655FD;
  cursor: pointer;
  height: 24px;
}

.form-row {
  display: flex;
  gap: 14px;
}

.form-row .form-field {
  flex: 1;
}

.flex-2 {
  flex: 2 !important;
}

.flex-3 {
  flex: 3 !important;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

/* --------------------------------------------------------------------------
   TAB 3: MUSIC MANAGER
   -------------------------------------------------------------------------- */
.current-track-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, rgba(46, 1, 67, 0.88) 0%, rgba(26, 2, 38, 0.92) 100%);
  border: 1.5px solid rgba(198, 85, 253, 0.38);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  flex-wrap: wrap;
}

.track-icon-badge {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(198, 85, 253, 0.2);
  border: 2px solid #C655FD;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.track-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.track-badge {
  display: inline-block;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  font-weight: 800;
  color: #C655FD;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.track-name {
  font-family: 'Cinzel', Georgia, serif;
  font-size: clamp(1.1rem, 3.5vw, 1.25rem);
  color: #ffffff;
  margin: 0 0 6px 0;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.35;
  font-weight: 700;
}

.track-url {
  font-size: 0.78rem;
  color: #A78BFA;
  word-break: break-all;
  overflow-wrap: break-word;
  line-height: 1.35;
}

.preview-play-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(198, 85, 253, 0.18);
  border: 1px solid #C655FD;
  color: #ffffff;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.preview-play-btn:hover {
  background: #9A26D7;
  color: #ffffff;
}

.preview-play-btn:active {
  transform: scale(0.98);
}

.preview-play-btn.playing {
  background: #9A26D7;
  color: #ffffff;
}

.admin-card-box {
  background: rgba(24, 2, 35, 0.88);
  border: 1px solid rgba(198, 85, 253, 0.22);
  border-radius: 16px;
  padding: 26px;
  margin-bottom: 24px;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.card-box-title {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.15rem;
  color: #ffffff;
  margin: 0 0 6px 0;
  font-weight: 700;
}

.card-box-desc {
  font-size: 0.84rem;
  color: #E9D5FF;
  margin: 0 0 20px 0;
  line-height: 1.45;
}

.music-upload-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.track-list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(16, 0, 24, 0.7);
  border: 1px solid rgba(198, 85, 253, 0.18);
  gap: 14px;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.track-list-row:hover {
  background: rgba(198, 85, 253, 0.08);
  border-color: rgba(198, 85, 253, 0.35);
}

.track-list-row.active-row {
  border-color: #C655FD;
  background: rgba(198, 85, 253, 0.14);
}

.track-row-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.track-mini-play {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(198, 85, 253, 0.16);
  border: 1px solid rgba(198, 85, 253, 0.35);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.track-mini-play:hover {
  background: #9A26D7;
  color: #ffffff;
}

.track-mini-play:active {
  transform: scale(0.94);
}

.track-text-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.track-title-text {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.35;
  margin: 0;
}

.track-src-text {
  display: block;
  font-size: 0.74rem;
  color: #A78BFA;
  word-break: break-all;
  overflow-wrap: break-word;
  line-height: 1.3;
}

.track-row-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.active-pill {
  font-size: 0.76rem;
  font-weight: 700;
  color: #ffffff;
  background: rgba(198, 85, 253, 0.25);
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid #C655FD;
  white-space: nowrap;
}

.track-set-btn {
  padding: 8px 14px;
  font-size: 0.8rem;
  white-space: nowrap;
}

/* --------------------------------------------------------------------------
   TAB 4: SETTINGS & UTILITIES
   -------------------------------------------------------------------------- */
.max-w-md {
  max-width: 520px;
}

.mt-6 {
  margin-top: 24px;
}

.pin-msg {
  font-size: 0.84rem;
  padding: 9px 14px;
  border-radius: 8px;
  margin: 0;
}

.pin-msg.success {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: #4ade80;
}

.pin-msg.error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #f87171;
}

.invite-link-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(14, 0, 20, 0.85);
  border: 1px solid rgba(198, 85, 253, 0.25);
  border-radius: 10px;
  flex-wrap: wrap;
}

.invite-link-box code {
  color: #ffffff;
  font-size: 0.86rem;
  word-break: break-all;
}

/* ==========================================================================
   RESPONSIVE DESIGN BREAKPOINTS
   Laptops, Tablets, and Smartphones
   ========================================================================== */

/* Tablet Screens (<= 1024px) */
@media (max-width: 1024px) {
  .admin-navbar {
    padding: 12px 24px;
  }

  .admin-tabs-bar {
    padding: 8px 24px;
  }

  .admin-tab-content {
    padding: 24px 24px 56px 24px;
  }

  .admin-kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Screens (<= 768px) */
@media (max-width: 768px) {
  /* Switch from Desktop Table to Mobile Cards */
  .admin-desktop-table {
    display: none !important;
  }

  .admin-mobile-cards {
    display: flex !important;
  }

  .admin-table-wrapper {
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .admin-navbar {
    padding: 10px 16px;
  }

  .admin-tabs-bar {
    padding: 8px 16px;
  }

  .admin-tab-content {
    padding: 20px 16px 48px 16px;
  }

  .section-header-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .section-header-bar button {
    width: 100%;
  }

  .admin-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .toolbar-search {
    max-width: 100%;
    min-width: 100%;
  }

  .toolbar-filters {
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }

  .toolbar-filters::-webkit-scrollbar {
    display: none;
  }

  .toolbar-right-btns {
    display: flex;
    width: 100%;
    gap: 8px;
  }

  .csv-btn {
    flex: 1;
    justify-content: center;
  }

  .current-track-card {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    gap: 16px;
  }

  .track-info {
    text-align: center;
  }

  .preview-play-btn {
    width: 100%;
  }

  .track-icon-badge {
    margin: 0 auto;
  }

  .form-row {
    flex-direction: column;
    gap: 12px;
  }

  .admin-photos-grid {
    grid-template-columns: 1fr;
  }

  .photo-action-btn {
    flex: 1;
    justify-content: center;
    padding: 9px 8px;
  }

  .photo-action-btn.move {
    flex: 0 0 40px;
  }

  .photo-action-btn.delete {
    flex: 0 0 40px;
    margin-left: 0;
  }

  .modal-actions {
    flex-direction: column;
    gap: 10px;
  }

  .modal-actions button {
    width: 100%;
  }

  .track-list-row {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 16px;
    gap: 12px;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
  }

  .track-row-left {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
  }

  .track-mini-play {
    margin-top: 2px;
  }

  .track-row-right {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding-top: 10px;
    border-top: 1px solid rgba(198, 85, 253, 0.15);
  }

  .track-row-right .active-pill {
    display: inline-flex;
    align-items: center;
  }

  .track-row-right .track-set-btn {
    width: 100%;
    justify-content: center;
  }

  .invite-link-box {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .invite-link-box .admin-secondary-btn {
    width: 100%;
  }
}

/* Small Smartphone Screens (<= 480px) */
@media (max-width: 480px) {
  .admin-gate-card {
    padding: 32px 20px;
    border-radius: 18px;
  }

  .admin-gate-title {
    font-size: 1.35rem;
  }

  .admin-gate-subtitle {
    font-size: 0.82rem;
  }

  .nav-monogram {
    width: 36px;
    height: 36px;
    font-size: 0.76rem;
  }

  .admin-nav-title {
    font-size: 0.92rem;
    letter-spacing: 0.08em;
  }

  .admin-nav-subtitle {
    display: none;
  }

  .link-pill span {
    display: none;
  }

  .logout-pill span {
    display: none;
  }

  .nav-action-pill {
    padding: 8px 10px;
    min-height: 36px;
  }

  .tab-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
    gap: 6px;
  }

  .admin-kpi-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .kpi-card {
    padding: 14px 12px;
  }

  .kpi-number {
    font-size: 1.65rem;
  }

  .kpi-label {
    font-size: 0.66rem;
    letter-spacing: 0.08em;
  }

  .kpi-subtext {
    font-size: 0.72rem;
  }

  .admin-card-box {
    padding: 20px 16px;
  }

  .admin-modal-box {
    padding: 22px 16px;
    border-radius: 14px;
  }
}
"""

with open("app/admin/admin.css", "w", encoding="utf-8") as f:
    f.write(css_content.strip() + "\\n")

print("admin.css redesigned successfully.")

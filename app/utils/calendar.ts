/**
 * Universal Calendar Saving Utility
 * Works seamlessly with a single click across:
 * - Android (Google Calendar app / web intent)
 * - iOS / iPhone / iPad (Apple Calendar native .ics prompt)
 * - macOS (Apple Calendar .ics)
 * - Windows PC (Outlook / Windows Calendar .ics + Google Calendar web)
 */

export interface WeddingEventDetails {
  title: string;
  startDate: string; // ISO or UTC format YYYYMMDDTHHMMSSZ
  endDate: string;
  location: string;
  description: string;
}

export const WEDDING_EVENT: WeddingEventDetails = {
  title: "Wedding of Thushara & Wadusha",
  startDate: "20261126T033000Z", // Nov 26, 2026 09:00 AM Asia/Colombo (UTC+5:30) = 03:30 UTC
  endDate: "20261126T103000Z", // Nov 26, 2026 04:00 PM Asia/Colombo = 10:30 UTC
  location: "Hotel Green Court, No. 6, Jaya Mawatha, Galawilawatta, Homagama, Sri Lanka",
  description:
    "We invite you to celebrate our wedding day with us!\n\nORDER OF THE DAY:\n• 09:00 AM — Poruwe Charithra (Traditional Auspicious Ceremony)\n• 10:00 AM – 04:00 PM — Wedding Celebration & Reception\n\nVenue: Hotel Green Court, Homagama, Sri Lanka",
};

/**
 * Generates an RFC-5545 compliant iCalendar (.ics) string with alarms
 */
export function generateICSContent(event: WeddingEventDetails = WEDDING_EVENT): string {
  const cleanDescription = event.description.replace(/\n/g, "\\n");
  const cleanLocation = event.location.replace(/,/g, "\\,");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Thushara and Wadusha//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-thushara-wadusha-20261126@invitation.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${event.startDate}`,
    `DTEND:${event.endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: ${event.title} is tomorrow!`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: ${event.title} starts at 9:00 AM at Hotel Green Court, Homagama!`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Returns Google Calendar web URL
 */
export function getGoogleCalendarUrl(event: WeddingEventDetails = WEDDING_EVENT): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${event.startDate}/${event.endDate}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Triggers native .ics file download / open in browser
 */
export function downloadICSFile(filename = "thushara-wadusha-wedding.ics") {
  const icsData = generateICSContent();
  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}

export type PlatformType = "android" | "ios" | "mac" | "windows" | "other";

export function detectPlatform(): PlatformType {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "other";
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";

  // iOS detection (iPhone, iPad, iPod, or iPad on iOS 13+ desktop mode)
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";
  if (/android/i.test(userAgent)) return "android";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "mac";
  if (/Windows/i.test(userAgent)) return "windows";

  return "other";
}

/**
 * Universal single-click handler.
 * Automatically does the optimal native action according to the user's OS.
 */
export function saveDateUniversally(): {
  platform: PlatformType;
  googleUrl: string;
} {
  const platform = detectPlatform();
  const googleUrl = getGoogleCalendarUrl();

  if (platform === "android") {
    // Android: Google Calendar intent seamlessly opens native app
    window.open(googleUrl, "_blank", "noopener,noreferrer");
  } else if (platform === "ios") {
    // iOS: .ics triggers native iOS system "Add to Calendar" sheet
    downloadICSFile("thushara-wadusha-wedding.ics");
  } else if (platform === "mac") {
    // macOS: .ics opens macOS Apple Calendar app with 1 click
    downloadICSFile("thushara-wadusha-wedding.ics");
  } else {
    // Windows / Desktop: .ics downloads for Outlook & Windows Calendar
    downloadICSFile("thushara-wadusha-wedding.ics");
  }

  return { platform, googleUrl };
}

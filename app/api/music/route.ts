import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

function getSettings() {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return {
        adminPin: "1126",
        activeMusic: "/music/wedding-invitation-music.mp3",
        musicTitle: "Wedding Invitation by Jason Farnham (Extended Version)",
        tracks: [
          {
            src: "/music/wedding-invitation-music.mp3",
            title: "Wedding Invitation by Jason Farnham (Extended Version)",
            uploadedAt: "2026-09-17T08:00:00.000Z",
          },
        ],
      };
    }
    const data = fs.readFileSync(settingsFilePath, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Error reading settings.json:", err);
    return {};
  }
}

function saveSettings(settings: any) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error("Error writing settings.json:", err);
  }
}

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({
    activeMusic: settings.activeMusic || "/music/wedding-invitation-music.mp3",
    musicTitle: settings.musicTitle || "Wedding Invitation by Jason Farnham",
    tracks: settings.tracks || [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activeMusic, musicTitle } = body;

    if (!activeMusic) {
      return NextResponse.json({ error: "Active music track is required." }, { status: 400 });
    }

    const settings = getSettings();
    settings.activeMusic = activeMusic;
    if (musicTitle) settings.musicTitle = musicTitle;

    // Check if track is in playlist, if not add it
    if (!Array.isArray(settings.tracks)) settings.tracks = [];
    const exists = settings.tracks.some((t: any) => t.src === activeMusic);
    if (!exists) {
      settings.tracks.unshift({
        src: activeMusic,
        title: musicTitle || path.basename(activeMusic),
        uploadedAt: new Date().toISOString(),
      });
    }

    saveSettings(settings);

    return NextResponse.json({
      success: true,
      activeMusic: settings.activeMusic,
      musicTitle: settings.musicTitle,
      tracks: settings.tracks,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update music settings." }, { status: 500 });
  }
}

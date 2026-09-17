import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Read active music and title from settings table
  const { data: settingsRows } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["active_music", "music_title"]);

  const settingsMap: Record<string, string> = {};
  (settingsRows || []).forEach((row) => {
    settingsMap[row.key] = row.value;
  });

  // Read all tracks from music_tracks table
  const { data: tracks } = await supabase
    .from("music_tracks")
    .select("*")
    .order("uploaded_at", { ascending: false });

  return NextResponse.json(
    {
      activeMusic: settingsMap.active_music || "/music/wedding-invitation-music.mp3",
      musicTitle: settingsMap.music_title || "Wedding Invitation by Jason Farnham",
      tracks: (tracks || []).map((t) => ({
        src: t.src,
        title: t.title,
        uploadedAt: t.uploaded_at,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activeMusic, musicTitle } = body;

    if (!activeMusic) {
      return NextResponse.json(
        { error: "Active music track is required." },
        { status: 400 }
      );
    }

    // Update settings
    await supabase
      .from("settings")
      .update({ value: activeMusic })
      .eq("key", "active_music");

    if (musicTitle) {
      await supabase
        .from("settings")
        .update({ value: musicTitle })
        .eq("key", "music_title");
    }

    // Check if track exists in playlist, if not add it
    const { data: existing } = await supabase
      .from("music_tracks")
      .select("id")
      .eq("src", activeMusic)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from("music_tracks").insert({
        src: activeMusic,
        title: musicTitle || activeMusic.split("/").pop() || "Unknown Track",
      });
    }

    // Fetch updated data
    const { data: tracks } = await supabase
      .from("music_tracks")
      .select("*")
      .order("uploaded_at", { ascending: false });

    return NextResponse.json({
      success: true,
      activeMusic,
      musicTitle: musicTitle || "",
      tracks: (tracks || []).map((t) => ({
        src: t.src,
        title: t.title,
        uploadedAt: t.uploaded_at,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update music settings." },
      { status: 500 }
    );
  }
}

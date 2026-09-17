import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
        id: t.id,
        src: t.src,
        title: t.title,
        uploadedAt: t.uploaded_at,
      })),
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
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

    // Check if track exists in playlist, if not add it
    const { data: existing } = await supabase
      .from("music_tracks")
      .select("id")
      .eq("src", activeMusic)
      .limit(1);

    const isNew = !existing || existing.length === 0;

    if (isNew) {
      // Check track count limit: max 5 soundtracks
      const { count } = await supabase
        .from("music_tracks")
        .select("*", { count: "exact", head: true });

      if ((count || 0) >= 5) {
        return NextResponse.json(
          {
            error:
              "Soundtrack limit reached (maximum 5 tracks). Please delete an existing track before uploading a new one.",
          },
          { status: 400 }
        );
      }

      const { error: insertErr } = await supabase.from("music_tracks").insert({
        src: activeMusic,
        title: musicTitle || activeMusic.split("/").pop() || "Unknown Track",
      });

      if (insertErr) {
        console.error("Error inserting track:", insertErr);
        return NextResponse.json(
          { error: "Failed to add track to list: " + insertErr.message },
          { status: 500 }
        );
      }
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
        id: t.id,
        src: t.src,
        title: t.title,
        uploadedAt: t.uploaded_at,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update music settings." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Soundtrack ID is required." },
        { status: 400 }
      );
    }

    // 1. Fetch track record
    const { data: track, error: fetchErr } = await supabase
      .from("music_tracks")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (fetchErr || !track) {
      return NextResponse.json(
        { error: "Soundtrack not found." },
        { status: 404 }
      );
    }

    // 2. Check if this track is currently active
    const { data: activeSetting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "active_music")
      .single();

    const isActive = activeSetting?.value === track.src;

    // 3. Delete file from Supabase Storage if it was uploaded to storage
    try {
      const match = track.src.match(/\/uploads\/(.+)$/);
      if (match && match[1]) {
        const storagePath = decodeURIComponent(match[1]);
        await supabase.storage.from("uploads").remove([storagePath]);
      }
    } catch (storageErr) {
      console.warn("Could not delete track file from storage:", storageErr);
    }

    // 4. Delete track row from database
    const { error: delErr } = await supabase
      .from("music_tracks")
      .delete()
      .eq("id", Number(id));

    if (delErr) {
      return NextResponse.json(
        { error: "Failed to delete track: " + delErr.message },
        { status: 500 }
      );
    }

    // 5. If this was the active track, switch active to another remaining track or default
    let newActive = track.src;
    let newTitle = "";

    if (isActive) {
      const { data: remaining } = await supabase
        .from("music_tracks")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (remaining && remaining.length > 0) {
        newActive = remaining[0].src;
        newTitle = remaining[0].title;
      } else {
        newActive = "/music/wedding-invitation-music.mp3";
        newTitle = "Wedding Invitation by Jason Farnham (Extended Version)";
      }

      await supabase
        .from("settings")
        .update({ value: newActive })
        .eq("key", "active_music");

      await supabase
        .from("settings")
        .update({ value: newTitle })
        .eq("key", "music_title");
    }

    // Fetch updated playlist
    const { data: remainingTracks } = await supabase
      .from("music_tracks")
      .select("*")
      .order("uploaded_at", { ascending: false });

    return NextResponse.json({
      success: true,
      switchedActive: isActive,
      activeMusic: newActive,
      musicTitle: newTitle,
      tracks: (remainingTracks || []).map((t) => ({
        id: t.id,
        src: t.src,
        title: t.title,
        uploadedAt: t.uploaded_at,
      })),
    });
  } catch (err: any) {
    console.error("Error deleting soundtrack:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete soundtrack." },
      { status: 500 }
    );
  }
}

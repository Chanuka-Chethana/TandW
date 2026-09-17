import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: rsvps, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rsvps:", error);
    return NextResponse.json({
      rsvps: [],
      stats: { totalResponses: 0, attendingCount: 0, decliningCount: 0, totalGuestHeadcount: 0 },
    });
  }

  const rawList = rsvps || [];

  // Deduplicate by guest name (case-insensitive), preserving the most recent submission
  const seenGuests = new Map<string, (typeof rawList)[0]>();
  for (const r of rawList) {
    const key = (r.guest || "").trim().toLowerCase();
    if (!key) continue;
    if (!seenGuests.has(key)) {
      seenGuests.set(key, r);
    }
  }

  const list = Array.from(seenGuests.values());
  const attendingList = list.filter((r) => r.status === "attending");
  const decliningList = list.filter((r) => r.status === "declining");

  return NextResponse.json({
    rsvps: list.map((r) => ({
      id: r.id,
      guest: r.guest,
      status: r.status,
      guestCount: r.guest_count,
      message: r.message,
      createdAt: r.created_at,
    })),
    stats: {
      totalResponses: list.length,
      attendingCount: attendingList.length,
      decliningCount: decliningList.length,
      totalGuestHeadcount: attendingList.reduce(
        (sum, r) => sum + (Number(r.guest_count) || 1),
        0
      ),
    },
  }, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, guest, status, guestCount, message } = body;

    if (!guest || !status) {
      return NextResponse.json(
        { error: "Guest name and status are required." },
        { status: 400 }
      );
    }

    const trimmedGuest = String(guest).trim();
    const cleanStatus = status === "attending" ? "attending" : "declining";
    const count = cleanStatus === "attending" ? Number(guestCount) || 1 : 0;
    const cleanMessage = message ? String(message).trim() : "";

    // 1. Check if an RSVP record already exists for this guest (by ID or case-insensitive guest name)
    let existingRecord: { id: string; [key: string]: any } | null = null;

    if (id) {
      const { data } = await supabase.from("rsvps").select("*").eq("id", id).maybeSingle();
      if (data) existingRecord = data;
    }

    if (!existingRecord) {
      // Look up by case-insensitive name
      const { data } = await supabase
        .from("rsvps")
        .select("*")
        .ilike("guest", trimmedGuest)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        existingRecord = data[0];
        // Clean up any historical redundant rows with the same guest name
        if (data.length > 1) {
          const redundantIds = data.slice(1).map((r) => r.id);
          await supabase.from("rsvps").delete().in("id", redundantIds);
        }
      }
    }

    if (existingRecord) {
      // 2. UPDATE existing row in-place instead of creating a duplicate
      const updatePayload = {
        guest: trimmedGuest,
        status: cleanStatus,
        guest_count: count,
        message: cleanMessage,
        created_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("rsvps")
        .update(updatePayload)
        .eq("id", existingRecord.id);

      if (updateError) {
        console.error("Error updating RSVP:", updateError);
        return NextResponse.json({ error: "Failed to update RSVP." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        updated: true,
        rsvp: {
          id: existingRecord.id,
          guest: trimmedGuest,
          status: cleanStatus,
          guestCount: count,
          message: cleanMessage,
          createdAt: updatePayload.created_at,
        },
      });
    }

    // 3. Otherwise, INSERT new row
    const newEntry = {
      id: id || `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      guest: trimmedGuest,
      status: cleanStatus,
      guest_count: count,
      message: cleanMessage,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from("rsvps").insert(newEntry);

    if (insertError) {
      console.error("Error inserting RSVP:", insertError);
      return NextResponse.json({ error: "Failed to save RSVP." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updated: false,
      rsvp: {
        ...newEntry,
        guestCount: newEntry.guest_count,
        createdAt: newEntry.created_at,
      },
    });
  } catch (err) {
    console.error("Error submitting RSVP:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const { error } = await supabase.from("rsvps").delete().eq("id", id);

    if (error) {
      console.error("Error deleting RSVP:", error);
      return NextResponse.json({ error: "Failed to delete RSVP." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete RSVP." },
      { status: 500 }
    );
  }
}

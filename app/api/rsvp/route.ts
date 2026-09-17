import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: rsvps, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rsvps:", error);
    return NextResponse.json({ rsvps: [], stats: { totalResponses: 0, attendingCount: 0, decliningCount: 0, totalGuestHeadcount: 0 } });
  }

  const list = rsvps || [];
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
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guest, status, guestCount, message } = body;

    if (!guest || !status) {
      return NextResponse.json(
        { error: "Guest name and status are required." },
        { status: 400 }
      );
    }

    const newEntry = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      guest: String(guest).trim(),
      status: status === "attending" ? "attending" : "declining",
      guest_count: status === "attending" ? Number(guestCount) || 1 : 0,
      message: message ? String(message).trim() : "",
    };

    const { error } = await supabase.from("rsvps").insert(newEntry);

    if (error) {
      console.error("Error inserting RSVP:", error);
      return NextResponse.json({ error: "Failed to save RSVP." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      rsvp: {
        ...newEntry,
        guestCount: newEntry.guest_count,
        createdAt: new Date().toISOString(),
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

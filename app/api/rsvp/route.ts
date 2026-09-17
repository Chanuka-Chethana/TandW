import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const rsvpFilePath = path.join(process.cwd(), "data", "rsvps.json");

function getRsvps() {
  try {
    if (!fs.existsSync(rsvpFilePath)) {
      fs.writeFileSync(rsvpFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(rsvpFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading rsvps.json:", err);
    return [];
  }
}

function saveRsvps(rsvps: any[]) {
  try {
    fs.writeFileSync(rsvpFilePath, JSON.stringify(rsvps, null, 2));
  } catch (err) {
    console.error("Error writing rsvps.json:", err);
  }
}

export async function GET() {
  const rsvps = getRsvps();

  const totalResponses = rsvps.length;
  const attendingList = rsvps.filter((r: any) => r.status === "attending");
  const decliningList = rsvps.filter((r: any) => r.status === "declining");

  const attendingCount = attendingList.length;
  const decliningCount = decliningList.length;

  const totalGuestHeadcount = attendingList.reduce(
    (sum: number, r: any) => sum + (Number(r.guestCount) || 1),
    0
  );

  return NextResponse.json({
    rsvps,
    stats: {
      totalResponses,
      attendingCount,
      decliningCount,
      totalGuestHeadcount,
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

    const rsvps = getRsvps();
    const newEntry = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      guest: String(guest).trim(),
      status: status === "attending" ? "attending" : "declining",
      guestCount: status === "attending" ? Number(guestCount) || 1 : 0,
      message: message ? String(message).trim() : "",
      createdAt: new Date().toISOString(),
    };

    // Prepend new entry
    rsvps.unshift(newEntry);
    saveRsvps(rsvps);

    return NextResponse.json({ success: true, rsvp: newEntry });
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

    const rsvps = getRsvps();
    const updated = rsvps.filter((r: any) => r.id !== id);
    saveRsvps(updated);

    return NextResponse.json({ success: true, count: updated.length });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete RSVP." },
      { status: 500 }
    );
  }
}

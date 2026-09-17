import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, pin, currentPin, newPin } = body;

    // Action: Verify PIN
    if (action === "verify") {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "admin_pin")
        .single();

      if (error) {
        console.error("Error reading admin pin:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
      }

      const storedPin = data?.value || "1126";

      if (pin === storedPin) {
        return NextResponse.json({ success: true, authorized: true });
      } else {
        return NextResponse.json(
          { success: false, authorized: false, error: "Incorrect passcode." },
          { status: 401 }
        );
      }
    }

    // Action: Change PIN
    if (action === "change_pin") {
      const { data, error: readErr } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "admin_pin")
        .single();

      if (readErr) {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
      }

      const storedPin = data?.value || "1126";

      if (currentPin !== storedPin) {
        return NextResponse.json(
          { error: "Current passcode is incorrect." },
          { status: 401 }
        );
      }

      if (!newPin || String(newPin).length < 4) {
        return NextResponse.json(
          { error: "Passcode must be at least 4 digits." },
          { status: 400 }
        );
      }

      const { error: updateErr } = await supabase
        .from("settings")
        .update({ value: String(newPin).trim() })
        .eq("key", "admin_pin");

      if (updateErr) {
        console.error("Error updating pin:", updateErr);
        return NextResponse.json({ error: "Failed to update passcode." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Passcode updated successfully.",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    console.error("Settings POST error:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}

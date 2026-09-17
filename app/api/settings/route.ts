import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

function getSettings() {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return { adminPin: "1126" };
    }
    const data = fs.readFileSync(settingsFilePath, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    return { adminPin: "1126" };
  }
}

function saveSettings(settings: any) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error("Error writing settings.json:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, pin, currentPin, newPin } = body;

    const settings = getSettings();
    const storedPin = settings.adminPin || "1126";

    // Action: Verify PIN
    if (action === "verify") {
      if (pin === storedPin) {
        return NextResponse.json({ success: true, authorized: true });
      } else {
        return NextResponse.json({ success: false, authorized: false, error: "Incorrect passcode." }, { status: 401 });
      }
    }

    // Action: Change PIN
    if (action === "change_pin") {
      if (currentPin !== storedPin) {
        return NextResponse.json({ error: "Current passcode is incorrect." }, { status: 401 });
      }
      if (!newPin || String(newPin).length < 4) {
        return NextResponse.json({ error: "Passcode must be at least 4 digits." }, { status: 400 });
      }
      settings.adminPin = String(newPin).trim();
      saveSettings(settings);
      return NextResponse.json({ success: true, message: "Passcode updated successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    console.error("Settings POST error:", err);
    return NextResponse.json({ error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}

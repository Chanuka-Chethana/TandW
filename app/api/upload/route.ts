import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null; // "photo" or "music"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "-");
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;

    const isAudio =
      category === "music" ||
      file.type.startsWith("audio/") ||
      [".mp3", ".wav", ".m4a", ".aac"].includes(ext);

    let targetDir = "";
    let publicUrl = "";

    if (isAudio) {
      targetDir = path.join(process.cwd(), "public", "music");
      publicUrl = `/music/${uniqueFileName}`;
    } else {
      targetDir = path.join(process.cwd(), "public", "photos", "moments");
      publicUrl = `/photos/moments/${uniqueFileName}`;
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, uniqueFileName);
    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFileName,
      originalName,
      isAudio,
    });
  } catch (err) {
    console.error("File upload error:", err);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}

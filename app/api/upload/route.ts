import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    const ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
    const baseName = originalName
      .substring(0, originalName.lastIndexOf("."))
      .replace(/[^a-zA-Z0-9_-]/g, "-");
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;

    const isAudio =
      category === "music" ||
      file.type.startsWith("audio/") ||
      [".mp3", ".wav", ".m4a", ".aac"].includes(ext);

    // Determine storage path
    const storagePath = isAudio
      ? `music/${uniqueFileName}`
      : `photos/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: "File upload failed: " + uploadError.message },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData?.publicUrl || "";

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

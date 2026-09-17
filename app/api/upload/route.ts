import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null; // "photo" or "music"

    if (!file) {
      return NextResponse.json({ error: "No file provided in request." }, { status: 400 });
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 4.5 MB serverless limit. Please use direct cloud upload.`,
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name;
    const dotIndex = originalName.lastIndexOf(".");
    const ext = dotIndex !== -1 ? originalName.substring(dotIndex).toLowerCase() : "";
    const baseName = (dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 50);
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;

    const isAudio =
      category === "music" ||
      file.type.startsWith("audio/") ||
      [".mp3", ".wav", ".m4a", ".aac", ".ogg"].includes(ext);

    // Determine storage path
    const storagePath = isAudio
      ? `music/${uniqueFileName}`
      : `photos/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, buffer, {
        contentType: file.type || (isAudio ? "audio/mpeg" : "image/jpeg"),
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Storage upload failed: " + uploadError.message },
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
  } catch (err: any) {
    console.error("File upload route error:", err);
    return NextResponse.json(
      { error: err?.message || "File upload failed on server." },
      { status: 500 }
    );
  }
}

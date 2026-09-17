import { supabase } from "@/lib/supabase";

export interface UploadResult {
  url: string;
  filename: string;
}

/**
 * Uploads media (music tracks or gallery photos) directly to Supabase Storage.
 *
 * Why client-direct upload?
 * Vercel Serverless Functions enforce a strict 4.5 MB request body limit.
 * High-quality audio files (MP3/WAV/M4A) and high-res photos often exceed 4.5 MB,
 * causing Vercel to return HTTP 413 "Request Entity Too Large", which breaks
 * JSON parsing on the frontend.
 *
 * Direct Supabase upload completely bypasses the 4.5 MB Vercel limit,
 * allows up to 50 MB files, and uploads faster without serverless intermediary hops.
 */
export async function uploadMediaFile(
  file: File,
  category: "music" | "photo"
): Promise<UploadResult> {
  // Check file limit
  const maxMb = category === "music" ? 50 : 25;
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed ${maxMb} MB.`
    );
  }

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

  const storagePath = isAudio
    ? `music/${uniqueFileName}`
    : `photos/${uniqueFileName}`;

  // 1. Direct Supabase Storage upload
  try {
    const { error: directUploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, file, {
        contentType: file.type || (isAudio ? "audio/mpeg" : "image/jpeg"),
        upsert: false,
      });

    if (!directUploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(storagePath);

      if (publicUrlData?.publicUrl) {
        return {
          url: publicUrlData.publicUrl,
          filename: uniqueFileName,
        };
      }
    } else {
      console.warn("Direct Supabase storage upload failed, attempting fallback:", directUploadError.message);
    }
  } catch (err: any) {
    console.warn("Direct upload error, falling back to server route:", err?.message || err);
  }

  // 2. Fallback to /api/upload with safe non-JSON error handling
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  let uploadRes: Response;
  try {
    uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  } catch (networkErr: any) {
    throw new Error(
      `Connection error during upload: ${networkErr?.message || "Please check your network."}`
    );
  }

  if (!uploadRes.ok) {
    if (uploadRes.status === 413) {
      throw new Error(
        `File is too large for the server route (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a file under 4.5 MB or compress it.`
      );
    }

    const rawText = await uploadRes.text();
    let errorMsg = `Upload failed (Status ${uploadRes.status})`;
    try {
      const parsed = JSON.parse(rawText);
      if (parsed?.error) errorMsg = parsed.error;
    } catch {
      if (rawText && rawText.length < 200) {
        errorMsg = rawText;
      }
    }
    throw new Error(errorMsg);
  }

  const rawText = await uploadRes.text();
  let uploadData: any;
  try {
    uploadData = JSON.parse(rawText);
  } catch {
    throw new Error("Invalid response from upload server.");
  }

  if (!uploadData.success || !uploadData.url) {
    throw new Error(uploadData.error || "File upload failed.");
  }

  return {
    url: uploadData.url,
    filename: uploadData.filename || uniqueFileName,
  };
}

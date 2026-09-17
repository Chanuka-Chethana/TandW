import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ photos: [] });
  }

  // Map DB snake_case to frontend camelCase
  const mapped = (photos || []).map((p) => ({
    id: p.id,
    src: p.src,
    width: p.width,
    height: p.height,
    isLandscape: p.is_landscape,
    caption: p.caption,
    rotation: p.rotation,
  }));

  return NextResponse.json(
    { photos: mapped },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Batch reorder/update all photos
    if (Array.isArray(body.photos)) {
      // Delete all existing and re-insert in new order
      await supabase.from("photos").delete().gte("id", 0);

      const rows = body.photos.map((p: any, idx: number) => ({
        id: p.id,
        src: p.src,
        width: p.width || (p.isLandscape ? 1448 : 1086),
        height: p.height || (p.isLandscape ? 1086 : 1448),
        is_landscape: Boolean(p.isLandscape),
        caption: p.caption || "Cherished Memory",
        rotation: typeof p.rotation === "number" ? p.rotation : 0,
        sort_order: idx + 1,
      }));

      const { error } = await supabase.from("photos").insert(rows);
      if (error) {
        console.error("Error batch saving photos:", error);
        return NextResponse.json({ error: "Failed to save photos." }, { status: 500 });
      }

      return NextResponse.json({ success: true, photos: body.photos });
    }

    // Add a single new photo
    const { src, width, height, isLandscape, caption, rotation } = body;
    if (!src) {
      return NextResponse.json({ error: "Source URL is required." }, { status: 400 });
    }

    // Get the next sort_order
    const { data: maxRow } = await supabase
      .from("photos")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxRow?.sort_order || 0) + 1;

    const newPhoto = {
      src,
      width: width || (isLandscape ? 1448 : 1086),
      height: height || (isLandscape ? 1086 : 1448),
      is_landscape: Boolean(isLandscape),
      caption: caption || "Cherished Memory",
      rotation: typeof rotation === "number" ? rotation : parseFloat((Math.random() * 6 - 3).toFixed(1)),
      sort_order: nextOrder,
    };

    const { data: inserted, error } = await supabase
      .from("photos")
      .insert(newPhoto)
      .select()
      .single();

    if (error) {
      console.error("Error adding photo:", error);
      return NextResponse.json({ error: "Failed to add photo." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: inserted.id,
        src: inserted.src,
        width: inserted.width,
        height: inserted.height,
        isLandscape: inserted.is_landscape,
        caption: inserted.caption,
        rotation: inserted.rotation,
      },
    });
  } catch (err) {
    console.error("Error adding photo:", err);
    return NextResponse.json({ error: "Failed to add photo." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, src, caption, isLandscape, rotation } = body;

    if (!id) {
      return NextResponse.json({ error: "Photo ID is required." }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (src !== undefined) updates.src = src;
    if (caption !== undefined) updates.caption = caption;
    if (isLandscape !== undefined) updates.is_landscape = Boolean(isLandscape);
    if (rotation !== undefined) updates.rotation = Number(rotation);

    const { data: updated, error } = await supabase
      .from("photos")
      .update(updates)
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating photo:", error);
      return NextResponse.json({ error: "Failed to update photo." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: updated.id,
        src: updated.src,
        width: updated.width,
        height: updated.height,
        isLandscape: updated.is_landscape,
        caption: updated.caption,
        rotation: updated.rotation,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update photo." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Photo ID is required." }, { status: 400 });
    }

    const { error } = await supabase.from("photos").delete().eq("id", Number(id));

    if (error) {
      console.error("Error deleting photo:", error);
      return NextResponse.json({ error: "Failed to delete photo." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete photo." }, { status: 500 });
  }
}

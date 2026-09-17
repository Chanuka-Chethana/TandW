import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const photosFilePath = path.join(process.cwd(), "data", "photos.json");

function getPhotos() {
  try {
    if (!fs.existsSync(photosFilePath)) {
      return [];
    }
    const data = fs.readFileSync(photosFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading photos.json:", err);
    return [];
  }
}

function savePhotos(photos: any[]) {
  try {
    fs.writeFileSync(photosFilePath, JSON.stringify(photos, null, 2));
  } catch (err) {
    console.error("Error writing photos.json:", err);
  }
}

export async function GET() {
  const photos = getPhotos();
  return NextResponse.json({ photos });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // If reordering/batch updating all photos
    if (Array.isArray(body.photos)) {
      savePhotos(body.photos);
      return NextResponse.json({ success: true, photos: body.photos });
    }

    // Otherwise adding a single new photo
    const { src, width, height, isLandscape, caption, rotation } = body;
    if (!src) {
      return NextResponse.json({ error: "Source URL is required." }, { status: 400 });
    }

    const photos = getPhotos();
    const nextId = photos.length > 0 ? Math.max(...photos.map((p: any) => Number(p.id) || 0)) + 1 : 1;

    const newPhoto = {
      id: nextId,
      src,
      width: width || (isLandscape ? 1448 : 1086),
      height: height || (isLandscape ? 1086 : 1448),
      isLandscape: Boolean(isLandscape),
      caption: caption || "Cherished Memory",
      rotation: typeof rotation === "number" ? rotation : (Math.random() * 6 - 3).toFixed(1),
    };

    photos.push(newPhoto);
    savePhotos(photos);

    return NextResponse.json({ success: true, photo: newPhoto });
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

    const photos = getPhotos();
    const index = photos.findIndex((p: any) => p.id === Number(id));

    if (index === -1) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    if (src !== undefined) photos[index].src = src;
    if (caption !== undefined) photos[index].caption = caption;
    if (isLandscape !== undefined) photos[index].isLandscape = Boolean(isLandscape);
    if (rotation !== undefined) photos[index].rotation = Number(rotation);

    savePhotos(photos);

    return NextResponse.json({ success: true, photo: photos[index] });
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

    const photos = getPhotos();
    const filtered = photos.filter((p: any) => p.id !== Number(id));
    savePhotos(filtered);

    return NextResponse.json({ success: true, count: filtered.length });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete photo." }, { status: 500 });
  }
}

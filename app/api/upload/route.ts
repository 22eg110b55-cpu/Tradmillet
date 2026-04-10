import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/adminAuth";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  if (!requireAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) return NextResponse.json({ message: "Missing file" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFileName(file.name || "upload.png");
  const uploadRoot = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
  const outDir = uploadRoot;
  await fs.mkdir(outDir, { recursive: true });
  const outName = `${Date.now()}_${safeName}`;
  const outPath = path.join(outDir, outName);
  await fs.writeFile(outPath, bytes);

  return NextResponse.json({ url: `/uploads/${outName}` }, { status: 201 });
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}



import { NextRequest, NextResponse } from "next/server";
import {
  createScopeItem,
  getScopeItems,
  updateScopeItemStatus,
} from "@/lib/scopeStore";
import type { ScopeItem } from "@/types/scope";

const allowedStatus: ScopeItem["status"][] = [
  "included",
  "pending",
  "approved",
  "rejected",
];

export async function GET() {
  return NextResponse.json({ items: getScopeItems() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const estimatedHours = Number(body.estimatedHours) || 0;
  const cost = Number(body.cost) || 0;
  if (estimatedHours < 0 || cost < 0) {
    return NextResponse.json(
      { error: "Hours and cost must be non-negative" },
      { status: 400 }
    );
  }

  const item = createScopeItem({
    title: body.title,
    description: typeof body.description === "string" ? body.description : "",
    estimatedHours,
    cost,
    isOriginal: Boolean(body.isOriginal),
  });

  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  if (!allowedStatus.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const ok = updateScopeItemStatus(body.id, body.status);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: item, error } = await supabase
    .from("itinerary_items")
    .insert({
      day_id: body.dayId,
      time: "",
      location: "",
      notes: "",
      sort_order: body.sortOrder || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: item.id,
    time: item.time || "",
    location: item.location || "",
    notes: item.notes || "",
  });
}

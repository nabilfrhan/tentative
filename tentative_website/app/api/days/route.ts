import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  // Create new day
  const { data: day, error: dayError } = await supabase
    .from("days")
    .insert({
      tentative_id: body.tentativeId,
      day_number: body.dayNumber,
      date: body.date || "",
    })
    .select()
    .single();

  if (dayError) {
    return NextResponse.json({ error: dayError.message }, { status: 500 });
  }

  // Create first empty item for the day
  const { data: item, error: itemError } = await supabase
    .from("itinerary_items")
    .insert({
      day_id: day.id,
      time: "",
      location: "",
      notes: "",
      sort_order: 0,
    })
    .select()
    .single();

  if (itemError) {
    return NextResponse.json({ error: itemError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: day.id,
    dayNumber: day.day_number,
    date: day.date || "",
    items: [
      {
        id: item.id,
        time: "",
        location: "",
        notes: "",
      },
    ],
  });
}

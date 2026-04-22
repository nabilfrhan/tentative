import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: tentatives, error } = await supabase
    .from("tentatives")
    .select(`
      *,
      days (
        *,
        itinerary_items (*)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform data to match our frontend structure
  const transformed = tentatives?.map((t) => ({
    id: t.id,
    title: t.title,
    dateRange: t.date_range,
    days: t.days
      ?.sort((a: { day_number: number }, b: { day_number: number }) => a.day_number - b.day_number)
      .map((d: { id: string; day_number: number; date: string | null; itinerary_items: Array<{ id: string; time: string; location: string; notes: string; sort_order: number }> }) => ({
        id: d.id,
        dayNumber: d.day_number,
        date: d.date || "",
        items: d.itinerary_items
          ?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
          .map((i: { id: string; time: string; location: string; notes: string }) => ({
            id: i.id,
            time: i.time || "",
            location: i.location || "",
            notes: i.notes || "",
          })) || [],
      })) || [],
  }));

  return NextResponse.json(transformed);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  // Create tentative
  const { data: tentative, error: tentativeError } = await supabase
    .from("tentatives")
    .insert({
      title: body.title,
      date_range: body.dateRange,
    })
    .select()
    .single();

  if (tentativeError) {
    return NextResponse.json({ error: tentativeError.message }, { status: 500 });
  }

  // Create first day with empty item
  const { data: day, error: dayError } = await supabase
    .from("days")
    .insert({
      tentative_id: tentative.id,
      day_number: 1,
      date: "",
    })
    .select()
    .single();

  if (dayError) {
    return NextResponse.json({ error: dayError.message }, { status: 500 });
  }

  // Create first empty item
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
    id: tentative.id,
    title: tentative.title,
    dateRange: tentative.date_range,
    days: [
      {
        id: day.id,
        dayNumber: 1,
        date: "",
        items: [
          {
            id: item.id,
            time: "",
            location: "",
            notes: "",
          },
        ],
      },
    ],
  });
}

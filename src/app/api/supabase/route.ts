import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
 const { data, error } = await supabase.rpc("increment_run_counter");

 if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
 }

 return NextResponse.json({ total: data });
}

export async function GET() {
 const { data, error } = await supabase
  .from("run_counter")
  .select("total")
  .eq("id", 1)
  .single();

 if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
 }

 return NextResponse.json({ total: data.total });
}

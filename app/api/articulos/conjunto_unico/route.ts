import { NextResponse } from "next/server";
import { supabase } from "@/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const { data, error } = await supabase
    .from("conjuntos")
    .select("id_conjunto, nombre")
    .eq("id_conjunto", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(data);
}

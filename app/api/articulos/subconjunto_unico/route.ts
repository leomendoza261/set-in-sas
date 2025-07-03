import { NextResponse } from "next/server";
import { supabase } from "@/lib/client";
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';

export const GET = withAuth(async (_req: NextRequest, session) => {
    const { searchParams } = new URL(_req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const { data, error } = await supabase
        .from("subconjuntos")
        .select("id_subconjunto, nombre")
        .eq("id_subconjunto", id)
        .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    return NextResponse.json(data);
})

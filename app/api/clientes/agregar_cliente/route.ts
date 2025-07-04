// app/api/clientes/agregar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/client';
import { withAuth } from '@/lib/protected-handler';

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const { nombre, cuit } = await req.json();

    if (!nombre || !cuit) {
      return NextResponse.json({ error: 'Nombre y CUIT son requeridos.' }, { status: 400 });
    }

    const { error } = await supabase.from('clientes').insert({ nombre, cuit });

    if (error) throw error;

    return NextResponse.json({ ok: true, mensaje: 'Cliente agregado correctamente.' });
  } catch (error: any) {
    console.error('Error al agregar cliente:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al registrar cliente' },
      { status: 500 }
    );
  }
});

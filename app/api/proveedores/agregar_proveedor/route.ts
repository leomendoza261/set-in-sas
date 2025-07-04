// app/api/clientes/agregar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/client';
import { withAuth } from '@/lib/protected-handler';

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const { nombre } = await req.json();

    if (!nombre ) {
      return NextResponse.json({ error: 'Nombre requerido.' }, { status: 400 });
    }

    const { error } = await supabase.from('proveedores').insert({ nombre });

    if (error) throw error;

    return NextResponse.json({ ok: true, mensaje: 'Proveedeor agregado correctamente.' });
  } catch (error: any) {
    console.error('Error al agregar proveedor:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al registrar proveedor' },
      { status: 500 }
    );
  }
});

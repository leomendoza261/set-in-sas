import { NextResponse, NextRequest } from 'next/server'
import { supabase } from '@/lib/client'
import { withAuth } from '@/lib/protected-handler';


export const GET = withAuth(async (_req: NextRequest, session) => {
  const { searchParams } = new URL(_req.url);
  const id = searchParams.get('id_movimiento');
  const fecha = searchParams.get('fecha'); // YYYY-MM-DD
  const tipo = searchParams.get('tipo_movimiento');
  const articulo = searchParams.get('articulo');

  let query = supabase.from('vista_lista_movimientos').select('*').order('fecha', { ascending: false }).limit(400);

  if (id) {
    query = query.eq('id_movimiento', id);
  }

  if (tipo) {
    query = query.ilike('tipo_movimiento', `%${tipo}%`);
  }

  if (articulo) {
    query = query.ilike('articulo', `%${articulo}%`);
  }

  if (fecha) {
    query = query.eq('fecha', fecha);
  }

  const { data, error } = await query;

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new NextResponse(JSON.stringify(data), { status: 200 });
})

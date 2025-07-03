import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/client';
import { withAuth } from '@/lib/protected-handler';

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Falta el parámetro id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('articulos')
    .select('id_articulo, cantidad_stock, cantidad_reservada')
    .eq('id_articulo', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});

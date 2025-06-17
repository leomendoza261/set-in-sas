import { NextRequest } from 'next/server';
 import { supabase } from '@/lib/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cliente = searchParams.get('cliente');
  const proyecto = searchParams.get('proyecto');

  let query = supabase
    .from('vista_materiales_proyecto')
    .select('*');

  if (cliente) query = query.eq('cliente', cliente);
  if (proyecto) query = query.eq('proyecto', proyecto);

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

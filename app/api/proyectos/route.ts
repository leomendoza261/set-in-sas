import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client'
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';

export const GET = withAuth(async (_req: NextRequest, session) => {

  const { searchParams } = new URL(_req.url);  // <-- aquí estaba el error
  const cliente = searchParams.get('cliente');
  const proyecto = searchParams.get('proyecto');

  let query = supabase
    .from('vista_materiales_proyecto')
    .select('*');

  if (cliente) query = query.eq('cliente', cliente);
  if (proyecto) query = query.eq('proyecto', proyecto);

  const { data, error } = await query;

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
})

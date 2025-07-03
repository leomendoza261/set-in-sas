import { supabase } from '@/lib/client'
import { withAuth } from '@/lib/protected-handler';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(async (_req: NextRequest, session) => {
  const { data, error } = await supabase
    .from('vista_detalle_subconjunto')
    .select('*');

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
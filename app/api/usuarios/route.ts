import { supabase } from '@/lib/client';
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';

export const GET = withAuth(async (_req: NextRequest, session) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id_usuario, nombre');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client'; 
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';

export const GET = withAuth(async (_req: NextRequest, session) => {
  try {
    const { data, error } = await supabase
      .from('vista_materiales_proyecto_completa')
      .select('*');

    if (error) {
      console.error('Error al obtener materiales:', error.message);
      return NextResponse.json({ error: 'Error al obtener los materiales' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Error interno:', e);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
})

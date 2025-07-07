// /api/articulos/modificar.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/protected-handler';
import { supabase } from '@/lib/client';

export const PUT = withAuth(async (req: NextRequest, session) => {
  try {
    const body = await req.json();
    const {
      id_articulo,
      nombre,
      descripcion,
      unidad_medida,
      deposito,
      usuario,
      tipo_articulo,
      caracteristica_fabricacion_id,
      nivel,
      fecha
    } = body;

    if (!id_articulo) {
      return NextResponse.json({ error: 'ID del artículo requerido' }, { status: 400 });
    }

    const updateData: any = {
      nombre,
      descripcion,
      unidad_medida,
      deposito,
      usuario,
      fecha_modificacion: fecha,
      tipo_articulo,
      caracteristica_fabricacion_id,
      nivel,
    };

    // Limpiar campos no definidos
    Object.keys(updateData).forEach((key) => {
      const value = updateData[key];
      if (value === undefined || value === null || value === '') {
        delete updateData[key];
      }
    });

    const { error } = await supabase
      .from('articulos')
      .update(updateData)
      .eq('id_articulo', id_articulo);

    if (error) throw error;

    return NextResponse.json({ ok: true, mensaje: 'Artículo actualizado correctamente.' });
  } catch (error: any) {
    console.error('Error al modificar artículo:', error);
    return NextResponse.json(
      { error: error.message || 'Error al modificar el artículo' },
      { status: 500 }
    );
  }
});

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client';
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (_req: NextRequest, session) => {
  try {
    const body = await _req.json();
    const {
      tipo_movimiento_id,
      id_proyecto,
      id_articulo,
      id_proveedor,
      id_operador,
      cantidad,
      unidad_medida,
      fecha = new Date().toISOString(),
    } = body;

    // 1. Insertar en lista_movimientos
    const { error: insertError } = await supabase.from('lista_movimientos').insert({
      tipo_movimiento_id,
      id_proyecto: tipo_movimiento_id !== 1 ? id_proyecto : null,
      id_articulo,
      id_proveedor: tipo_movimiento_id === 1 ? id_proveedor : null,
      id_operador: tipo_movimiento_id === 2 || tipo_movimiento_id === 3 ? id_operador : null,
      cantidad,
      unidad_medida,
      fecha,
    });

    if (insertError) throw insertError;

    // 2. Obtener el stock actual y reservado del artículo
    const { data: articulo, error: fetchError } = await supabase
      .from('articulos')
      .select('cantidad_stock, cantidad_reservada')
      .eq('id_articulo', id_articulo)
      .single();

    if (fetchError || !articulo) throw fetchError || new Error('Artículo no encontrado');

    let nuevosValores: { cantidad_stock?: number; cantidad_reservada?: number } = {};

    if (tipo_movimiento_id === 1) {
      // Ingreso: sumar al stock
      nuevosValores.cantidad_stock = articulo.cantidad_stock + cantidad;
    } else if (tipo_movimiento_id === 2) {
      // Egreso: restar a reservado y al stock
      nuevosValores.cantidad_reservada = Math.max(0, articulo.cantidad_reservada - cantidad);
      nuevosValores.cantidad_stock = Math.max(0, articulo.cantidad_stock - cantidad);
    } else if (tipo_movimiento_id === 3) {
      // Reserva: sumar a reservado
      nuevosValores.cantidad_reservada = articulo.cantidad_reservada + cantidad;
    }

    // 3. Actualizar el artículo
    const { error: updateError } = await supabase
      .from('articulos')
      .update(nuevosValores)
      .eq('id_articulo', id_articulo);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true, mensaje: 'Movimiento registrado correctamente' });
  } catch (error) {
    console.error('Error registrando movimiento:', error);
    return NextResponse.json(
      { error: 'Hubo un error al registrar el movimiento' },
      { status: 500 }
    );
  }
});

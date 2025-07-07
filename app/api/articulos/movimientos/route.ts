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

    // 1. Insertar movimiento
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

    // 2. Obtener info del artículo
    const { data: articulo, error: fetchError } = await supabase
      .from('articulos')
      .select('cantidad_stock, cantidad_reservada')
      .eq('id_articulo', id_articulo)
      .single();

    if (fetchError || !articulo) throw fetchError || new Error('Artículo no encontrado');

    let nuevosValores: { cantidad_stock?: number; cantidad_reservada?: number } = {};

    if (tipo_movimiento_id === 1) {
      nuevosValores.cantidad_stock = articulo.cantidad_stock + cantidad;
    } else if (tipo_movimiento_id === 2) {
      nuevosValores.cantidad_reservada = Math.max(0, articulo.cantidad_reservada - cantidad);
      nuevosValores.cantidad_stock = Math.max(0, articulo.cantidad_stock - cantidad);
    } else if (tipo_movimiento_id === 3) {
      nuevosValores.cantidad_reservada = articulo.cantidad_reservada + cantidad;
    }

    // 3. Actualizar cantidades en tabla artículos
    const { error: updateError } = await supabase
      .from('articulos')
      .update(nuevosValores)
      .eq('id_articulo', id_articulo);

    if (updateError) throw updateError;

    // 4. Si es reserva, actualizar también cantidad_asignada en detalle_lista_materiales
    if (tipo_movimiento_id === 3 && id_proyecto) {
      // Obtener id_lista_materiales más reciente del proyecto
      const { data: lista, error: errorLista } = await supabase
        .from('lista_materiales')
        .select('id_lista_materiales')
        .eq('id_proyecto', id_proyecto)
        .order('fecha_creacion', { ascending: false })
        .limit(1)
        .single();

      if (errorLista || !lista) throw errorLista || new Error('No se encontró lista de materiales');

      const id_lista = lista.id_lista_materiales;

      // Buscar el registro en detalle_lista_materiales
      const { data: detalle, error: errorDetalle } = await supabase
        .from('detalle_lista_materiales')
        .select('cantidad_asignada')
        .eq('id_lista_materiales', id_lista)
        .eq('id_material', id_articulo)
        .maybeSingle();

      if (errorDetalle) throw errorDetalle;

      if (detalle) {
        // Ya existe, sumamos
        const nuevaCantidad = (detalle.cantidad_asignada ?? 0) + cantidad;

        const { error: errorUpdateDetalle } = await supabase
          .from('detalle_lista_materiales')
          .update({ cantidad_asignada: nuevaCantidad })
          .eq('id_lista_materiales', id_lista)
          .eq('id_material', id_articulo);

        if (errorUpdateDetalle) throw errorUpdateDetalle;
      } else {
        // No existe: insertamos nuevo detalle (opcional, según tu lógica)
        throw new Error('No se encontró el detalle para asignar cantidad');
      }
    }

    return NextResponse.json({ ok: true, mensaje: 'Movimiento registrado correctamente' });

  } catch (error: any) {
    console.error('Error registrando movimiento:', error);
    return NextResponse.json(
      { error: error.message || 'Hubo un error al registrar el movimiento' },
      { status: 500 }
    );
  }
});

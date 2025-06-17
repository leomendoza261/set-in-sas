import { NextResponse } from 'next/server'
import { supabase } from '@/lib/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      tipo_movimiento_id,
      id_proyecto,
      id_articulo,
      id_proveedor,
      id_operador,
      cantidad,
      unidad_medida,
      fecha = new Date().toISOString(),
    } = body

    // 1. Insertar en lista_movimientos
    const { error: insertError } = await supabase.from('lista_movimientos').insert({
      tipo_movimiento_id,
      id_proyecto,
      id_articulo,
      id_proveedor: tipo_movimiento_id === 1 ? id_proveedor : null,
      id_operador: tipo_movimiento_id === 2 ? id_operador : null,
      cantidad,
      unidad_medida,
      fecha,
    })

    if (insertError) throw insertError

    // 2. Actualizar stock del artículo
    const signo = tipo_movimiento_id === 1 ? 1 : -1

    const { data: articulo, error: fetchError } = await supabase
      .from('articulos')
      .select('cantidad_stock')
      .eq('id_articulo', id_articulo)
      .single()

    if (fetchError) throw fetchError

    const nuevoStock = articulo.cantidad_stock + signo * cantidad

    const { error: updateError } = await supabase
      .from('articulos')
      .update({ cantidad_stock: nuevoStock })
      .eq('id_articulo', id_articulo)

    if (updateError) throw updateError

    return NextResponse.json({ ok: true, mensaje: 'Movimiento registrado correctamente' })
  } catch (error) {
    console.error('Error registrando movimiento:', error)
    return NextResponse.json({ error: 'Hubo un error al registrar el movimiento' }, { status: 500 })
  }
}

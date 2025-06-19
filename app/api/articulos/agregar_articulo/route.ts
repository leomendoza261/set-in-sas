import { NextResponse } from 'next/server'
import { supabase } from '@/lib/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      nombre,
      descripcion,
      cantidad_stock,
      unidad_medida,
      deposito,
      usuario,
      fecha_modificacion = new Date().toISOString(),
      tipo_articulo
    } = body

    // 1. Insertar en articulos
    const { error: insertError } = await supabase.from('articulos').insert({
      nombre,
      descripcion,
      cantidad_stock,
      unidad_medida,
      deposito,
      usuario,
      fecha_modificacion,
      tipo_articulo
    })

    if (insertError) throw insertError

    return NextResponse.json({ ok: true, mensaje: 'Articulo registrado correctamente' })
  } catch (error) {
    console.error('Error registrando el articulo:', error)
    return NextResponse.json({ error: 'Hubo un error al registrar el articulo' }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { supabase } from '@/lib/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      nombre,
      prefijo,
      descripcion,
      cantidad_stock,
      unidad_medida,
      nivel_id,
      cantidad_reservada,
      deposito,
      articulos
    } = body

    // Paso 1: Insertar en subconjuntos
    const { data: subconjunto, error: errorSubconjunto } = await supabase
      .from("subconjuntos")
      .insert([{
        nombre,
        prefijo,
        descripcion,
        cantidad_stock,
        unidad_medida,
        nivel_id,
        cantidad_reservada,
        deposito
      }])
      .select()
      .single()

    if (errorSubconjunto) throw errorSubconjunto

    const id_subconjunto = subconjunto.id_subconjunto

    // Paso 2: Crear receta_subconjunto
    const { data: receta, error: errorReceta } = await supabase
      .from("receta_subconjunto")
      .insert([{ id_subconjunto, version: 1 }])
      .select()
      .single()

    if (errorReceta) throw errorReceta

    const id_receta_subconjunto = receta.id_receta_subconjunto

    // Paso 3: Insertar artículos en detalle_receta_subconjunto
    const detalles = articulos.map((art: any) => ({
      id_receta_subconjunto,
      id_articulo: art.id_articulo,
      cantidad: art.cantidad
    }))

    const { error: errorDetalles } = await supabase
      .from("detalle_receta_subconjunto")
      .insert(detalles)

    if (errorDetalles) throw errorDetalles

    return NextResponse.json({
      mensaje: "Subconjunto creado con éxito",
      id_subconjunto,
      id_receta_subconjunto
    })

  } catch (error: any) {
    console.error("Error al crear subconjunto:", error.message || error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}

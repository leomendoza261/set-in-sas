import { NextResponse } from "next/server"
import { supabase } from '@/lib/client'
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';

export const POST = withAuth(async (_req: NextRequest, session) => {
  try {
    const body = await _req.json()

    const {
      nombre,
      prefijo,
      descripcion,
      cantidad_stock,
      unidad_medida,
      categoria_id,
      nivel_id,
      cantidad_reservada,
      deposito,
      subconjuntos
    } = body

    // Paso 1: Insertar en conjuntos
    const { data: conjunto, error: errorConjunto } = await supabase
      .from("conjuntos")
      .insert([{
        nombre,
        prefijo,
        categoria_id,
        nivel_id,
        descripcion,
        cantidad_stock,
        unidad_medida,
        deposito,
        cantidad_reservada
      }])
      .select()
      .single()

    if (errorConjunto) throw errorConjunto

    const id_conjunto = conjunto.id_conjunto

    // Paso 2: Crear receta_conjunto
    const { data: receta, error: errorReceta } = await supabase
      .from("receta_conjunto")
      .insert([{ id_conjunto, version: 1 }])
      .select()
      .single()

    if (errorReceta) throw errorReceta

    const id_receta_conjunto = receta.id_receta_conjunto

    // Paso 3: Insertar subconjuntos en detalle_receta_conjunto
    const detalles = subconjuntos.map((sc: any) => ({
      id_receta_conjunto,
      id_subconjunto: sc.id_articulo,
      cantidad: sc.cantidad
    }))

    const { error: errorDetalles } = await supabase
      .from("detalle_receta_conjunto")
      .insert(detalles)

    if (errorDetalles) throw errorDetalles

    return NextResponse.json({
      message: "Conjunto creado con éxito",
      id_conjunto,
      id_receta_conjunto
    })
  } catch (error: any) {
    console.error("Error al crear conjunto:", error.message || error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
})

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/client';
import { withAuth } from '@/lib/protected-handler';

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body = await req.json();
    const {
      nombre_proyecto,
      cliente_id,
      estado_entrega_id,
      lista_nombre,
      lista_usuario_id,
      conjuntos = [],
      subconjuntos = [],
      articulos = [],
    } = body;

    // 1. Insertar en proyectos
    const { data: proyectoInsertado, error: errorProyecto } = await supabase
      .from('proyectos')
      .insert({
        nombre: nombre_proyecto,
        id_cliente: cliente_id,
        estado_entrega_id,
      })
      .select('id_proyecto')
      .single();

    if (errorProyecto) throw errorProyecto;
    const id_proyecto = proyectoInsertado.id_proyecto;

    // 2. Insertar en lista_materiales
    const { data: listaInsertada, error: errorLista } = await supabase
      .from('lista_materiales')
      .insert({
        id_proyecto,
        nombre: lista_nombre,
        fecha_creacion: new Date().toISOString(),
        usuario_id: lista_usuario_id,
      })
      .select('id_lista_materiales')
      .single();

    if (errorLista) throw errorLista;
    const id_lista_materiales = listaInsertada.id_lista_materiales;

    // 3. Preparar detalles a insertar
    const detalles: {
      id_lista_materiales: number;
      id_material: number;
      cantidad: number;
      nivel_id: number;
    }[] = [];

    for (const item of conjuntos) {
      detalles.push({
        id_lista_materiales,
        id_material: item.id,
        cantidad: item.cantidad,
        nivel_id: 3,
      });
    }

    for (const item of subconjuntos) {
      detalles.push({
        id_lista_materiales,
        id_material: item.id,
        cantidad: item.cantidad,
        nivel_id: 2,
      });
    }

    for (const item of articulos) {
      detalles.push({
        id_lista_materiales,
        id_material: item.id,
        cantidad: item.cantidad,
        nivel_id: 1,
      });
    }

    // 4. Insertar en detalle_lista_materiales si hay algo
    if (detalles.length > 0) {
      const { error: errorDetalles } = await supabase
        .from('detalle_lista_materiales')
        .insert(detalles);

      if (errorDetalles) throw errorDetalles;
    }

    return NextResponse.json({
      ok: true,
      mensaje: 'Proyecto registrado correctamente.',
      id_proyecto,
      id_lista_materiales,
    });
  } catch (error: any) {
    console.error('Error registrando proyecto:', error);
    return NextResponse.json(
      { error: error.message || 'Error al registrar proyecto' },
      { status: 500 }
    );
  }
});

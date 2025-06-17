import { NextResponse } from 'next/server'
import { supabase } from '@/lib/client'

export async function GET() {
  const { data, error } = await supabase.from('unidades_medida').select('id_unidad_medida, descripcion')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
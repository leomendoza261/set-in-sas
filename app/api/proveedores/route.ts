import { NextResponse } from 'next/server'
import { supabase } from '@/lib/client'

export async function GET() {
  const { data, error } = await supabase.from('proveedores').select('id_proveedor, nombre')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

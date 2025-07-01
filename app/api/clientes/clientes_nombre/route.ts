import { NextResponse } from 'next/server'
import { supabase } from '@/lib/client'

export async function GET() {
  const { data, error } = await supabase.from('clientes').select('id_cliente, nombre')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
 import { NextResponse } from 'next/server'
 import { supabase } from '@/lib/client'

 export async function GET() {
  const { data, error } = await supabase.from('articulos').select('*');
  if (error) return new NextResponse(JSON.stringify({error: error.message}))
  return new Response(JSON.stringify(data), {status: 200});  
}
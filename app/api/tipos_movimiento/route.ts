import { supabase } from '@/lib/client'

export async function GET() {
  const { data, error } = await supabase.from('tipo_movimiento').select('*');
  if (error) return new Response(JSON.stringify({error: error.message}))
  return new Response(JSON.stringify(data), {status: 200});  
}
 import { supabase } from '@/lib/client'

 export async function GET() {
  const { data, error } = await supabase
    .from('vista_detalle_conjunto')
    .select('*');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
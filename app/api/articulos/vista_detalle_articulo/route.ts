// app/api/tu-api/route.ts (ajustá la ruta según tu estructura)
import { supabase } from '@/lib/client'
import { withAuth } from '@/lib/protected-handler'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async (_req: NextRequest, session) => {
  const pageSize = 1000
  let start = 0
  let allData: any[] = []

  while (true) {
    const { data, error } = await supabase
      .from('vista_detalle_articulo')
      .select('*')
      .range(start, start + pageSize - 1)

    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    if (!data || data.length === 0) {
      break
    }

    allData = allData.concat(data)
    start += pageSize
  }

  return new NextResponse(JSON.stringify(allData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

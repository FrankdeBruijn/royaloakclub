import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)
export type Watch = {
  id: number; model_id: string | null; image: string | null; type: string | null
  geslacht: string | null; modelnaam: string | null; materiaal: string | null
  movement: string | null; productie_status: string | null; type_uurwerk: string | null
  prijs_euro: string | null; prijs_dollar: string | null
  jaar_geintroduceerd: number | null; diameter_kast: string | null
}

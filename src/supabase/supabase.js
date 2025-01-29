import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
console.log('ENV:' + JSON.stringify(process.env))
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export { supabase }

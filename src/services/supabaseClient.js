import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://abaxkoqbjkchimawjmrp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYXhrb3FiamtjaGltYXdqbXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTg2NTMsImV4cCI6MjA5MDQzNDY1M30.Sv_pjeJVfiz-rwk72OViyN3JNUsOJEPb8l2khXGgS3o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

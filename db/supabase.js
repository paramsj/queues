import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
// use SERVICE_ROLE_KEY on backend, not anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
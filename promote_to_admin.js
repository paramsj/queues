import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function promoteToAdmin(email) {
  if (!email) {
    console.error("Please provide an email address: node promote_to_admin.js user@example.com");
    process.exit(1);
  }

  console.log(`Promoting ${email} to ADMIN...`);
  
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'ADMIN' })
    .eq('email', email)
    .select();

  if (error) {
    console.error("Error updating user:", error.message);
  } else if (data && data.length > 0) {
    console.log("Success! User is now an ADMIN:", data[0].email);
  } else {
    console.log("No user found with that email.");
  }
}

const email = process.argv[2];
promoteToAdmin(email);

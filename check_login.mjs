import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function check() {
  for (const [email, pass] of [['admin@gmail.com','admin123'], ['customer@gmail.com','customer123']]) {
    console.log(`=== sign in ${email} ===`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) console.log('ERR:', error.status, error.message);
    else console.log('OK user:', data.user?.id);
  }
}

check();

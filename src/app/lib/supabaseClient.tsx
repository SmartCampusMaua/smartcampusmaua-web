import { createClient } from '@supabase/supabase-js';
import { auth } from "@/auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const getData = async (table:string ,column: string) => {
  // const SMARTCAMPUSMAUA_SERVER = `${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_PORT}`;
  const session = await auth()

  // const response = await fetch(`${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_PORT}/api/auth/email`);
  // const response = await fetch(`${SMARTCAMPUSMAUA_SERVER}/api/auth/email`);
  // const dataEmail = await response.json();

    const { data: userData } = await supabase.from(table).select(column).eq('email', session?.user.email).single();

    return userData;
};

export { supabase,getData }


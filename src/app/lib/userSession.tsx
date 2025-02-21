'use server';

import { auth } from "@/auth"
 
async function User() {
  const session = await auth()
  return session?.user;
}

export { User }
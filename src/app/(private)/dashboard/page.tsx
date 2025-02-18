import { outfit } from "@/app/ui/fonts";
import Head from 'next/head';
import Link from "next/link";
import { auth } from "@/auth"


export default async function Page() {
  const session = await auth()
  return (
    <>
      <Head>
        <title>SmartCampus Mauá</title>
      </Head>
      <div className="flex h-screen items-center justify-center bg-neutral-100 p-4">
        <div className='rounded-xl bg-white p-4 sm:p-8 w-full sm:w-1/2 animate-fade-in' style={{ boxShadow: '8px 8px 25px rgba(0,0,0,.2)' }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className='text-base sm:text-xl'>Seja bem-vindo, <span className='font-medium'>{session?.user.name}</span>.</h1>
              <p className=' text-neutral-600'>Selecione o módulo que deseja acessar.</p>
            </div>
          </div>
          <div className='grid mt-10 place-items-center text-center'>
            <Link
              // href="/login"
              href="/dashboard/devices"
              className="flex items-center gap-5 self-start rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 md:text-base"
            >
              <div className='w-full sm:w-72 p-6 hover:opacity-75 transition rounded-xl flex flex-col space-y-3 justify-center bg-gray-200' style={{ boxShadow: '8px 8px 25px rgba(0,0,0,.2)' }}>
                <img className="object-contain h-20" src='/images/logo_maua.svg' alt="IMT" />
                <span className={`text-base sm:text-2xl text-gms-tertiary ${outfit.className} antialiased`}>
                  <span className="text-blue-900">SmartCampus Mauá</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

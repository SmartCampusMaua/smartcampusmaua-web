import Image from "next/image";
import Head from 'next/head';
import Link from "next/link";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <>
      <Head>
        <title>SmartCampus Mauá</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center sm:p-6 md:p-8 lg:p-12">
        <div className="rounded-xl bg-white shadow-xl p-6 sm:p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/3 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
              <span className="font-medium">{session?.user.name}</span>.
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mt-3">
              Selecione o módulo que deseja acessar.
            </p>
          </div>

          {/* Grid container for cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 mt-10">
            <Link
              href="/dashboard/devices"
              className="flex flex-col items-center justify-between bg-gradient-to-tl from-blue-100 to-blue-200 text-white rounded-lg shadow-lg hover:opacity-90 transition-all p-6 space-y-4 group overflow-hidden"
            >
              <div className="w-full max-w-xs mx-auto flex justify-center">
                <Image className="object-contain h-24 sm:h-28 lg:h-32" src='/assets/images/logo_maua.svg' alt="IMT" width={150} height={150} />
              </div>
              <div className="text-center overflow-hidden">
                <h2 className="font-bold text-blue-900 relative">
                  SmartCampus Mauá
                </h2>
              </div>
            </Link>

            <Link
              href="https://smartcampus.maua.br/node/dash/#!/0?socketid=VreT6feV6Zxd4x7rAAJj"
              className="flex flex-col items-center justify-between bg-gradient-to-tl from-indigo-100 to-indigo-200 text-white rounded-lg shadow-lg hover:opacity-90 transition-all p-6 space-y-4 group overflow-hidden"
            >
              <div className="w-full max-w-xs mx-auto flex justify-center">
                <Image className="object-contain h-24 sm:h-28 lg:h-32" src='/assets/images/logo_maua.svg' alt="IMT" width={150} height={150} />
              </div>
              <div className="text-center overflow-hidden">
                <h2 className="font-bold text-blue-900 relative">
                  Dashboard
                </h2>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}

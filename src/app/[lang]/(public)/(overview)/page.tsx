// "use client";

// import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  // const [loading, setLoading] = useState(false);
  // const router = useRouter();

  // const handleLogin = () => {
  //   // setLoading(true);
  //   router.push("/api/auth/signin");
  // };

  const lang = (await params).lang;


  return (
    <main className="flex h-screen flex-col p-6 overflow-hidden">
      {/* Header Section */}
      <div className="flex h-20 shrink-0 items-center justify-center rounded-lg p-4 md:h-20">
        <Image
          src="/assets/images/logo_maua.svg"
          width={180}
          height={50}
          alt="SmartCampus Mauá Logo"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-4 py-6 md:flex-row overflow-hidden">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white px-6 py-8 md:w-2/5 md:px-16 shadow-lg">
          <Image
            src="/assets/images/logo_smartcampus.svg"
            width={150}
            height={50}
            alt="SmartCampus Mauá Sub Logo"
            className="self-center"
          />
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>Bem-vindo ao SmartCampus Mauá!</strong> Uma plataforma desenvolvida para aprimorar sua experiência no campus com soluções inteligentes e inovação.
          </p>
          {/* <button
            onClick={handleLogin}
            disabled={loading}
            className={`flex items-center gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors md:text-base ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8z"></path>
                </svg>
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
              </>
            )}
          </button> */}
          {/* <Link href={"/api/auth/signin"} className="bg-blue-500 border rounded-sm px-5"> */}
          <Link href={"/api/auth/signin"} className="bg-blue-600 hover:bg-blue-700 gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors md:text-base">

            Login
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center p-4 md:w-3/5 md:px-20 md:py-8">
          <Image
            src="/assets/images/logo_smartcampus.svg"
            width={800}
            height={760}
            className="hidden md:block rounded-lg shadow-md"
            alt="SmartCampus dashboard preview on desktop"
          />
        </div>
      </div>
    </main>
  );
}

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-blue-50">
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
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white px-6 py-10 md:w-2/5 md:px-20 shadow-lg">
          <Image
            src="/assets/images/logo_maua.svg"
            width={150}
            height={50}
            alt="SmartCampus Mauá Sub Logo"
            className="self-center"
          />
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
          <strong>Bem-vindo ao SmartCampus Mauá!</strong> Uma plataforma desenvolvida para aprimorar sua experiência no campus com soluções inteligentes e inovação.
          </p>
          <Link
            href="/api/auth/signin"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        
        {/* Image Section */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
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

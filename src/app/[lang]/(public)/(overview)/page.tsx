import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;

  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* Header Section */}
      <div className="flex h-20 items-center justify-center">
        <Image
          src="/assets/images/logo_maua.svg"
          width={180}
          height={50}
          alt="SmartCampus Mauá Logo"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-6 py-6 md:flex-row">
        {/* Text Section */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white px-6 py-8 shadow-lg md:flex-[2] md:px-16">
          <Image
            src="/assets/images/logo_smartcampus.svg"
            width={150}
            height={50}
            alt="SmartCampus Mauá Sub Logo"
            className="self-center"
          />
          <p className="text-xl text-gray-800 md:text-3xl">
            <strong>Bem-vindo ao SmartCampus Mauá!</strong> Uma plataforma
            desenvolvida para aprimorar sua experiência no campus com soluções
            inteligentes e inovação.
          </p>
          <Link
            href={"/api/auth/signin"}
            className="bg-blue-600 hover:bg-blue-700 gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium text-white transition-all md:text-base"
          >
            Login
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center p-4 md:flex-[3]">
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
import Image from "next/image";
import { Button } from "../../../ui/button";
import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { noto_serif } from "../../../ui/fonts";

type SearchParams = Promise<{ callbackUrl: string | undefined }>;


export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {


  const SIGNIN_ERROR_URL = "/";

  const sP = await searchParams;

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-8">
      {/* Main Container with padding */}
      <div className="flex flex-col justify-center items-center space-y-12">
        {/* Logo container with space between */}
        <div className="max-w-full px-4">
          <Image
            className=""
            src="/assets/images/logo_maua.svg"
            alt="Instituto Mauá de Tecnologia"
            width={160}
            height={160}
          />
        </div>
        
        {/* Title container with more spacing */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-center space-x-8">
            <Image
              className="h-24 w-auto"
              src="/assets/images/logo_smartcampus.svg"
              alt="Instituto Mauá de Tecnologia"
              width={160}
              height={160}
            />
            <h1 className={`text-maua_blue text-4xl sm:text-5xl font-medium tracking-wider ${noto_serif.className} antialiased`}>
              SmartCampus Mauá
            </h1>
          </div>

          {/* Button and Sign-in section with increased spacing */}
          <div className="space-y-5">
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                className="space-y-4"
                action={async () => {
                  "use server";
                  try {
                    await signIn(provider.id, {
                      redirectTo: sP?.callbackUrl ?? "",
                    });
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                    }
                    throw error;
                  }
                }}
              >
                <Button
                  className="space-x-5 rounded-full bg-white px-6 py-3 sm:px-7 sm:py-4 transition duration-150 ease-in hover:bg-neutral-300"
                  style={{ boxShadow: "8px 8px 25px rgba(0,0,0,.2)" }}
                >
                  <span className="text-center text-black text-[0.825rem] uppercase tracking-wider">ENTRAR COM</span>
                  <Image src="/assets/images/Microsoft_365.svg" alt="Microsoft" width={100} height={100} />
                </Button>
              </form>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

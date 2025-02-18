import Image from "next/image";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { noto_serif } from "../ui/fonts";


type SearchParams = Promise<{ callbackUrl: string | undefined }>;


export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {


  const SIGNIN_ERROR_URL = "/";

  const sP = await searchParams;

  return (
    <main className="min-h-screen p-6">


        <div className="flex flex-col justify-center items-center">


          <div className="max-w-full px-4">
            <Image
              className=""
              src="/images/logo_maua.svg"
              alt="Instituto Mauá de Tecnologia"
              width={160}
              height={160}
            />
          </div>

<div className="flex flex-row ">
          <div>
            <Image
              className="h-24"
              src="/images/logo_smartcampus.svg"
              alt="Instituto Mauá de Tecnologia"
              width={160}
              height={160}
            />
            <h1 className={`text-maua_blue  text-4xl sm:text-5xl font-medium tracking-wider ${noto_serif.className} antialiased`}>
              SmartCampus Mauá
            </h1>
          </div>

</div>


          <div>
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                className="space-y-3"

                action={async () => {
                  "use server";
                  try {
                    await signIn(provider.id, {
                      redirectTo: sP?.callbackUrl ?? "",
                    });
                  } catch (error) {
                    // Signin can fail for a number of reasons, such as the user
                    // not existing, or the user not having the correct role.
                    // In some cases, you may want to redirect to a custom error
                    if (error instanceof AuthError) {
                      return redirect(
                        `${SIGNIN_ERROR_URL}?error=${error.type}`
                      );
                    }

                    // Otherwise if a redirects happens Next.js can handle it
                    // so you can just re-thrown the error and let Next.js handle it.
                    // Docs:
                    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                    throw error;
                  }
                }}
              >
                {/* <Button className="mt-4 w-full h-14"
                    >
                      <p className="text-lg">SmartCampus Mauá </p>
                    </Button> */}

                <Button className="space-x-5 rounded-full bg-white px-6 py-3 sm:px-7 sm:py-4 transition duration-150 ease-in hover:bg-neutral-300" style={{ boxShadow: '8px 8px 25px rgba(0,0,0,.2)' }}>
                  <span className="text-center text-black text-[0.825rem] uppercase tracking-wider">ENTRAR COM</span>
                  <Image src="/images/Microsoft_365.svg" alt="Microsoft" width={100} height={100} />
                </Button>
              </form>
            ))}
          </div>

        </div>
    </main>
  );
}
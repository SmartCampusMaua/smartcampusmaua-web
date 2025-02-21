import { auth } from "@/auth"
import Sensores from "./devices/page";


export default async function Page() {
  const session = await auth()
  return (
    <>
     <Sensores />
    </>
  );
}

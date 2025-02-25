import type { Metadata } from "next";
import "@/globals.css";

export const metadata: Metadata = {
  title: "Smart Campus Mauá",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>

  );
}

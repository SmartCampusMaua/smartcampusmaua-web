"use client";

import Image from "next/image";
import { PowerIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { User } from "@/lib/userSession";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await User();
      setUser(userData);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    // await signOut({ callbackUrl: '/login' }); 
    await signOut(); 
    setLoading(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-neutral-300 bg-white">
      <div className="mx-auto flex h-14 md:h-16 items-center justify-between px-6 sm:px-8 lg:px-10">
        <div className="flex space-x-4 sm:space-x-6 items-center">
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2">
            <Image
              priority
              src="/assets/images/logo_maua.svg"
              height={100}
              width={100}
              alt="IMT - Instituto Mauá de Tecnologia"
              className="h-10 w-20"
            />
            <p className="font-outfit font-medium text-lg sm:text-xl lg:text-2xl">
              Smart<span className="dark:text-white">Campus Mauá</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user && (
            <div className="hidden font-bold sm:block">
              {user.name}
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">{loading ? "Saindo..." : "Sair"}</div>
          </button>
        </div>
      </div>
    </nav>
  );
}

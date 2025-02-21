"use client";

import * as Icons from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Dispositivos", href: "/dashboard/devices", icon: Icons.Squares2X2Icon },
  { name: "Evse", href: "/dashboard/evse", icon: Icons.BoltIcon },
  { name: "Alertas", href: "/dashboard/alerts", icon: Icons.BellAlertIcon },
  { name: "Comandos", href: "/dashboard/commands", icon: Icons.PlayIcon },
  { name: "Apps", href: "/dashboard/apps", icon: Icons.CubeIcon },
  { name: "Documentação", href: "https://iot.maua.br/docs", icon: Icons.DocumentIcon, external: true, blank: true },
  { name: "Configurações", href: "/dashboard/settings", icon: Icons.Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname() || "";

  return (
    <nav className={clsx("h-screen py-4 w-48 p-1 bg-white overflow-y-hidden")}> 
      <ul className="space-y-2 mt-4">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <li key={link.name}>
              {link.blank ? (
                <button
                  onClick={() => window.open(link.href, "_blank", "noopener,noreferrer")}
                  className={clsx(
                    "flex items-center gap-2 p-2 rounded-md hover:bg-gray-100",
                    pathname === link.href && "bg-gray-200"
                  )}
                >
                  <LinkIcon className="w-6 h-6" />
                  <span>{link.name}</span>
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-2 p-2 rounded-md hover:bg-gray-100",
                    pathname === link.href && "bg-gray-200"
                  )}
                >
                  <LinkIcon className="w-6 h-6" />
                  <span>{link.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


import { signOut } from '../../auth';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <nav className={`fixed top-0 z-50 w-full border-b border-neutral-300 bg-white`}>
      <div className="mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex space-x-8 items-center">
          <div className="flex items-center space-x-2">
            <div>
              <img className="h-10 dark:hidden" src="/images/logo_maua.svg" alt="IMT- Instituto Mauá de Tecnologia" />
              <img className="hidden h-10 dark:block" src="/images/logo_maua.svg" alt="IMT- Instituto Mauá de Tecnologia" />
            </div>
            <p className="font-outfit font-medium lg:text-2xl text-xl">
              Smart<span className="dark:text-white">Campus Mauá</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
        <form action={async () => {
          'use server';
          await signOut();
        }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
        </div>
      </div>
    </nav>
  );
};


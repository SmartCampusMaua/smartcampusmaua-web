import NavLinks from "./nav-links";

export default function Sidenav({ isOpen }: { isOpen: boolean }) {
  return (
    <nav
      className={`fixed top-14 w-60 overflow-y-auto overflow-y-hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="flex grow flex-row justify-between space-x-2 transition-transform duration-100 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
      </div>
    </nav>
  );
}


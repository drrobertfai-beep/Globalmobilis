import { Link } from "@tanstack/react-router";
import { LogoIcon } from "~/components/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/premium", label: "Premium" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo + Name */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <LogoIcon size={36} />
          <span className="text-lg font-bold tracking-tight text-[#0E4F8B]">
            Global Mobilis
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#0E4F8B]"
              activeProps={{ className: "text-[#0E4F8B] bg-gray-50" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:shadow-md"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-[#0E4F8B] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#1B7A9B] hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
import { Link } from "@tanstack/react-router";
import { LogoIcon } from "~/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#0A1F3F] text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={28} />
              <span className="text-lg font-bold text-white">
                Global Mobilis
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Your all-in-one platform for global migration, expat communities,
              and international networking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Navigate
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm transition-colors hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Get in Touch
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@globalmobilis.com"
                  className="transition-colors hover:text-white"
                >
                  hello@globalmobilis.com
                </a>
              </li>
              <li className="text-gray-500">Coming soon to iOS & Android</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Global Mobilis. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useQRFocus } from "@/lib/QRFocusContext";
import {
  registration,
  getRegistrationState,
  useToday,
} from "@/data/timeline";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
];

function RegisterButton({
  open,
  label,
  url,
  className,
  onClick,
}: {
  open: boolean;
  label: string;
  url: string;
  className: string;
  onClick?: () => void;
}) {
  const stateClasses = open
    ? ""
    : "opacity-40 grayscale cursor-not-allowed pointer-events-none";
  const classes = `bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold transition-all duration-300 ${className} ${stateClasses}`;

  if (!open) {
    return (
      <span aria-disabled="true" className={classes}>
        {label}
      </span>
    );
  }

  return (
    <a
      href={url}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {label}
    </a>
  );
}

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { qrFocused } = useQRFocus();

  // Hooks must run before the early return below.
  const today = useToday();
  const regState = getRegistrationState(today);
  const regOpen = regState === "open";
  const registerLabel =
    regState === "upcoming"
      ? `Opens ${registration.opensLabel}`
      : regState === "open"
      ? "Register Now"
      : "Registration Closed";

  if (qrFocused) return null;

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Full Navbar for large screens */}
      <nav className="hidden lg:block fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/20 bg-[#030615b3] backdrop-blur-lg shadow-md">
          <Link href="/">
            <img
              src="/codefestConly.svg"
              alt="Codefest Logo"
              className="h-8 w-auto"
            />
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#e7e5e4cc] font-medium text-sm px-3 py-1 rounded-md transition-colors hover:text-blue-500"
            >
              {link.label}
            </Link>
          ))}
          <RegisterButton
            open={regOpen}
            label={registerLabel}
            url={registration.url}
            className="px-4 py-2 rounded-lg"
          />
        </div>
      </nav>

      {/* Hamburger Menu for small screens */}
      <div className="lg:hidden">
        <button
          onClick={toggleDrawer}
          className="fixed top-6 left-6 z-50 bg-[#030615b3] backdrop-blur-lg p-3 rounded-xl border border-blue-500/20 shadow-md flex items-center justify-center text-stone-300 transition-all"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleDrawer}
        />

        {/* Drawer */}
        <nav
          className={`fixed top-0 left-0 h-screen w-[300px] bg-[#030615f2] backdrop-blur-lg z-50 pt-20 px-6 pb-6 flex flex-col gap-2 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Link href="/">
            <img
              src="/codefestConly.svg"
              alt="Codefest Logo"
              className="h-8 w-auto mb-6"
            />
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 text-base font-medium px-4 py-3 rounded-xl block w-full transition-colors hover:bg-white/10"
              onClick={toggleDrawer}
            >
              {link.label}
            </Link>
          ))}
          <RegisterButton
            open={regOpen}
            label={registerLabel}
            url={registration.url}
            className="mt-2 px-4 py-3 rounded-xl block w-full"
            onClick={toggleDrawer}
          />
        </nav>
      </div>
    </>
  );
}

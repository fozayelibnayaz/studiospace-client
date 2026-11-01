"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Aperture,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  CalendarCheck,
  Heart,
  LogOut,
  ChevronDown,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";

import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { serverBaseUrl } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const USER_MENU = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: FolderOpen },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/booking-requests", label: "Booking Requests", icon: Inbox },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    if (menuOpen) {
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }
  }, [menuOpen]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /** Challenge 1 companion: ask the Express API to clear its JWT cookie too. */
  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await fetch(`${serverBaseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* API may be down — still sign out of BetterAuth */
    }
    // Let the next account re-sync a fresh JWT cookie on login.
    try {
      sessionStorage.removeItem("ss-jwt-synced-email");
    } catch {
      /* non-blocking */
    }
    await authClient.signOut();
    toast.success("You have been logged out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300/60">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 md:h-[4.5rem] gap-3">
        {/* Left: logo + desktop links */}
        <div className="flex items-center gap-8 min-w-0">
          <Link href="/" className="font-heading flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-content transition-transform duration-300 rotate-0 hover:rotate-90">
              <Aperture size={20} strokeWidth={2.2} />
            </span>
            <span className="font-bold text-lg tracking-tight">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.href)
                      ? "text-neutral-content bg-primary"
                      : "text-base-content/75 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isPending ? (
            <div className="hidden sm:block skeleton h-9 w-24 rounded-lg" />
          ) : user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="btn btn-ghost btn-sm gap-2 px-2"
              >
                <span className="avatar avatar-placeholder">
                  <span className="w-8 rounded-full bg-primary/20 text-primary overflow-hidden">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                </span>
                <span className="hidden md:inline max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>
                <ChevronDown
                  size={15}
                  className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <ul className="absolute right-0 mt-2 w-60 bg-base-100 border border-base-300 rounded-xl shadow-xl py-2 z-50">
                  <li className="px-4 pb-2 border-b border-base-300/70">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-base-content/60 truncate">
                      {user.email}
                    </p>
                  </li>
                  {USER_MENU.map((m) => (
                    <li key={m.href}>
                      <Link
                        href={m.href}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          isActive(m.href)
                            ? "font-semibold text-primary"
                            : "hover:bg-base-200"
                        }`}
                      >
                        <m.icon size={16} /> {m.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-1 mt-1 border-t border-base-300/70">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden btn btn-ghost btn-sm btn-square border border-base-300"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-base-300/60 bg-base-100">
          <div className="px-4 py-3 space-y-3">
            <ul className="space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(l.href)
                        ? "bg-primary text-neutral-content"
                        : "hover:bg-base-200"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {user && (
              <>
                <ul className="pt-2 space-y-1 border-t border-base-300/60">
                  {USER_MENU.map((m) => (
                    <li key={m.href}>
                      <Link
                        href={m.href}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm ${
                          isActive(m.href) ? "font-semibold text-primary" : "hover:bg-base-200"
                        }`}
                      >
                        <m.icon size={16} /> {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-error hover:bg-error/10"
                >
                  <LogOut size={16} /> Logout ({user.name})
                </button>
              </>
            )}
            {!user && !isPending && (
              <div className="flex gap-2 pt-2 border-t border-base-300/60">
                <Link href="/login" className="btn btn-outline btn-sm flex-1">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm flex-1">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

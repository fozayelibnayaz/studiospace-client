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
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { serverBaseUrl } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Studios" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

const USER_MENU = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add a studio", icon: PlusCircle },
  { href: "/my-listings", label: "My listings", icon: FolderOpen },
  { href: "/my-bookings", label: "My bookings", icon: CalendarCheck },
  { href: "/booking-requests", label: "Booking requests", icon: Inbox },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    if (menuOpen) {
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /** Challenge 1 companion: ask the Express API to clear its JWT cookie too. */
  const handleLogout = async () => {
    setMenuOpen(false);
    setOpen(false);
    try {
      await fetch(`${serverBaseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* API may be down — still sign out of BetterAuth */
    }
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
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5 pointer-events-none">
      <div className="container-x flex justify-center">
        <nav
          aria-label="Primary"
          className={`pointer-events-auto w-full sm:w-auto flex items-center gap-1 rounded-full h-14 pl-2 pr-2 ${
            overHero ? "nav-pill nav-pill-over-hero" : "nav-pill"
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pl-1.5 pr-2 sm:pr-3 rounded-full shrink-0"
            aria-label="StudioSpace home"
          >
            <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-content">
              <Aperture size={19} strokeWidth={2.2} />
            </span>
            <span className="font-heading font-semibold text-[15px] tracking-tight">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  data-active={isActive(l.href)}
                  className="nav-link block"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <span
            className={`hidden lg:block w-px h-5 mx-1.5 ${
              overHero ? "bg-white/20" : "bg-base-content/15"
            }`}
          />

          <div className="ml-auto lg:ml-0 flex items-center gap-1.5">
            <ThemeToggle overlay={overHero} />

            {isPending ? (
              <span className="hidden sm:block skeleton h-9 w-24 rounded-full" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((v) => !v);
                  }}
                  className={`flex items-center gap-1.5 rounded-full h-9 pl-1 pr-2.5 transition-colors ${
                    overHero
                      ? "hover:bg-white/10"
                      : "hover:bg-base-content/5 border border-base-content/10"
                  }`}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <span className="avatar avatar-placeholder">
                    <span className="w-7 rounded-full bg-primary/20 text-primary overflow-hidden">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-xs font-semibold">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="hidden md:inline max-w-24 truncate text-[13px] font-medium">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {menuOpen && (
                  <ul
                    role="menu"
                    className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-base-content/10 bg-base-100 text-base-content shadow-2xl p-1.5 z-50"
                  >
                    <li className="px-3 py-2.5 border-b border-base-content/10 mb-1">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </li>
                    {USER_MENU.map((m) => (
                      <li key={m.href}>
                        <Link
                          href={m.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                            isActive(m.href)
                              ? "font-semibold text-primary bg-primary/10"
                              : "hover:bg-base-content/5"
                          }`}
                        >
                          <m.icon size={15} /> {m.label}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-1 mt-1 border-t border-base-content/10">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut size={15} /> Log out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-full text-[13px] font-medium hover:bg-base-content/5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/add-studio"
                  className={`hidden md:inline-flex items-center gap-1 rounded-full h-9 px-4 text-[13px] font-medium transition-colors ${
                    overHero
                      ? "bg-[#f7f3e9] text-[#141311] hover:bg-white"
                      : "bg-neutral text-neutral-content hover:opacity-90"
                  }`}
                >
                  List your space <ArrowUpRight size={14} />
                </Link>
              </div>
            )}

            {/* Mobile trigger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              className={`lg:hidden grid place-items-center w-9 h-9 rounded-full transition-colors ${
                overHero
                  ? "hover:bg-white/10"
                  : "border border-base-content/10 hover:bg-base-content/5"
              }`}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="container-x lg:hidden pointer-events-auto mt-3">
          <div className="rounded-3xl border border-base-content/10 bg-base-100 text-base-content shadow-2xl overflow-hidden max-h-[calc(100vh-7rem)] overflow-y-auto">
            <ul className="p-3 grid gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] ${
                      isActive(l.href)
                        ? "bg-base-content/[0.06] font-semibold"
                        : "hover:bg-base-content/[0.04]"
                    }`}
                  >
                    {l.label}
                    <ArrowUpRight size={15} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>

            {user && (
              <ul className="px-3 pb-3 grid gap-0.5 border-t border-base-content/10 pt-3">
                {USER_MENU.map((m) => (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm ${
                        isActive(m.href)
                          ? "font-semibold text-primary"
                          : "hover:bg-base-content/5"
                      }`}
                    >
                      <m.icon size={16} /> {m.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-error hover:bg-error/10"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </li>
              </ul>
            )}

            {!user && !isPending && (
              <div className="grid grid-cols-2 gap-2 p-3 pt-0 border-t border-base-content/10">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-base-content/20 text-[13px] font-medium transition-colors hover:bg-base-content/5"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-neutral text-[13px] font-medium text-neutral-content transition-opacity hover:opacity-90"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

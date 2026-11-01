"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Search, ShieldCheck, Star } from "lucide-react";

const AREAS = [
  "Gulshan","Banani","Dhanmondi","Uttara","Lalmatia",
  "Mohammadpur","Old Dhaka","Chattogram","Sylhet",
  "Cox's Bazar","Rajshahi","Khulshi",
];

export default function Hero() {
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const q = form.q?.value ? form.q.value.trim() : "";
    const area = form.area?.value ? form.area.value.trim() : "";
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    else if (area) params.set("search", area);
    router.push("/studios" + (params.toString() ? "?" + params.toString() : ""));
  };

  return (
    <section aria-label="Hero" className="relative w-full min-h-[100svh] bg-[#0d0d0b] overflow-hidden flex flex-col items-center text-center px-5 pt-28 pb-12">
      {/* Background image — dimmed + dark overlay */}
      <img
        src="/media/hero-poster.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.22]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0b]/80 via-[#0d0d0b]/70 to-[#0d0d0b]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0b]/60 via-transparent to-[#0d0d0b]/60" />

      {/* Diagonal amber streaks */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[2px] h-[140%] bg-gradient-to-b from-transparent via-[#e79b23]/60 to-transparent rotate-[22deg]" />
        <div className="absolute top-[-20%] left-[28%] w-[1.5px] h-[140%] bg-gradient-to-b from-transparent via-[#e79b23]/40 to-transparent rotate-[18deg]" />
        <div className="absolute top-[-20%] left-[50%] w-[2px] h-[140%] bg-gradient-to-b from-transparent via-[#e79b23]/50 to-transparent rotate-[25deg]" />
        <div className="absolute top-[-20%] left-[72%] w-[1.5px] h-[140%] bg-gradient-to-b from-transparent via-[#e79b23]/35 to-transparent rotate-[20deg]" />
        <div className="absolute top-[-20%] left-[88%] w-[2px] h-[140%] bg-gradient-to-b from-transparent via-[#e79b23]/45 to-transparent rotate-[22deg]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur px-4 py-1.5 text-xs font-medium text-amber-100 mb-6 shadow-lg shadow-amber-900/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Now booking across Bangladesh
        </p>

        <h1 className="text-[clamp(2rem,7vw,5rem)] sm:text-[clamp(3rem,10vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-white mb-6 drop-shadow-2xl break-words">
          Find the space.
          <br />
          <span className="italic font-serif text-amber-300">Make something extraordinary.</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-white/70 leading-relaxed mb-10">
          Photo studios, film stages, podcast lounges and music rooms from verified hosts in Dhaka, Chattogram, Sylhet and beyond.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} action="/studios" className="w-full max-w-2xl flex flex-col sm:flex-row gap-2 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-2 text-left shadow-[0_24px_60px_-24px_rgba(231,155,35,0.35)] mb-8">
          <label className="flex flex-1 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.05]">
            <Search size={18} className="text-amber-300 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-100/60">What are you making?</span>
              <input name="q" placeholder="Photo, film..." className="w-full bg-transparent text-sm outline-none text-white placeholder:text-white/40" />
            </div>
          </label>

          <span className="hidden sm:block w-px bg-white/10 self-stretch mx-1" />

          <label className="flex flex-1 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.05]">
            <MapPin size={18} className="text-amber-300 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-100/60">Where?</span>
              <input name="area" placeholder="City or neighbourhood" className="w-full bg-transparent text-sm outline-none text-white placeholder:text-white/40" />
            </div>
          </label>

          <button type="submit" className="h-12 px-6 rounded-full bg-amber-500 text-[#14120c] font-bold text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2">
            Search <ArrowRight size={16} />
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium mb-10">
          <Link href="/studios" className="text-white underline decoration-amber-500 decoration-2 underline-offset-4 hover:text-amber-100">Browse all studios</Link>
          <Link href="/add-studio" className="text-white/60 hover:text-white">Host your space</Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 mb-12">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-amber-300" /> Identity-verified hosts</span>
          <span className="inline-flex items-center gap-1.5"><Star size={13} className="fill-amber-400 text-amber-400" /> 4.9 from 300+ sessions</span>
        </div>

        {/* Marquee */}
        <div className="w-full overflow-hidden border-t border-white/10 pt-4">
          <div className="flex gap-6 whitespace-nowrap animate-[marquee_30s_linear_infinite] text-xs text-white/40 font-medium tracking-wide uppercase">
            {[...AREAS,...AREAS].map((a,i)=> <span key={i}>{a} <span className="mx-3 text-amber-400">•</span></span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: {
    default: "StudioSpace — Book Creative Workspaces & Production Studios",
    template: "%s | StudioSpace",
  },
  description:
    "A peer-to-peer marketplace for photo studios, film stages, podcast lounges, music suites and art workshops. Discover spaces, pick your hours, book instantly.",
  keywords: [
    "studio rental",
    "photo studio",
    "film stage",
    "podcast room",
    "music studio",
    "art workshop",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Challenge 3: apply the persisted theme BEFORE first paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('studiospace-theme');if(t==='studio'||t==='light'){document.documentElement.dataset.theme=t}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='studio'}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

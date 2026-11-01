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
    default: "StudioSpace — Book Photo Studios, Film Stages & Music Rooms in Bangladesh",
    template: "%s | StudioSpace",
  },
  description:
    "Bangladesh's peer-to-peer marketplace for creative space. Rent photo studios, film stages, podcast lounges, music suites and art workshops in Dhaka, Chattogram, Sylhet and beyond — priced in taka, booked by the hour.",
  keywords: [
    "studio rental Bangladesh",
    "photo studio Dhaka",
    "film stage Dhaka",
    "podcast studio Dhaka",
    "music studio Chattogram",
    "art workshop Sylhet",
    "creative space rental BDT",
  ],
  applicationName: "StudioSpace",
  authors: [{ name: "StudioSpace" }],
  openGraph: {
    title: "StudioSpace — Creative studios across Bangladesh",
    description:
      "Photo floors, film stages, podcast lounges, music suites and art workshops. Verified hosts, taka pricing, instant hourly booking.",
    locale: "en_BD",
    type: "website",
    siteName: "StudioSpace",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf9f4" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
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

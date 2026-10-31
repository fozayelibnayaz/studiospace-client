"use client";

import { Toaster } from "react-hot-toast";
import JwtCookieSync from "./JwtCookieSync";

export default function Providers({ children }) {
  return (
    <>
      <JwtCookieSync />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
            borderRadius: "10px",
            fontSize: "0.9rem",
          },
          success: { iconTheme: { primary: "#f59e0b", secondary: "#fff" } },
        }}
      />
    </>
  );
}

import { serverBaseUrl } from "./constants";
import { toast } from "react-hot-toast";

/**
 * Thin wrapper over fetch that always sends the httpOnly JWT cookie.
 * GET/HEAD requests never need the token body; all mutating requests
 * require `credentials: "include"` so verifyToken can read the cookie.
 */
export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  const res = await fetch(`${serverBaseUrl}${path}`, {
    method,
    credentials: "include", // send the httpOnly "token" cookie (Challenge 1)
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  });

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data.trim() ? data.trim() : `Request failed (${res.status})`);
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

/** Uploads an image file to imgbb, returns a hosted URL. */
export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) {
    throw new Error("Image upload is not configured (missing NEXT_PUBLIC_IMGBB_API_KEY). Paste an image URL instead.");
  }
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(String(reader.result).split(",").pop()); // strip data: prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const formData = new FormData();
  formData.append("image", base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data?.data?.display_url) {
    throw new Error(data?.error?.message || "imgbb upload failed");
  }
  return data.data.display_url;
}

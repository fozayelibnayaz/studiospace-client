import { apiRequest } from "@/lib/api";
import { notFound } from "next/navigation";

import StudioDetailsClient from "@/components/StudioDetailsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!/^[0-9a-f]{24}$/i.test(id)) return { title: "Studio not found" };
  try {
    const studio = await apiRequest(`/studios/${id}`);
    return { title: studio.title, description: studio.overview?.slice(0, 150) };
  } catch {
    return { title: "Studio not found" };
  }
}

export default async function StudioDetailsPage({ params }) {
  const { id } = await params;

  // Bad ids (random strings) → the branded 404, like a deleted listing.
  if (!/^[0-9a-f]{24}$/i.test(id)) notFound();

  let studio;
  try {
    studio = await apiRequest(`/studios/${id}`);
  } catch (err) {
    if (err.status === 404) notFound();
    throw err; // caught by app error.jsx
  }

  return <StudioDetailsClient studio={studio} />;
}

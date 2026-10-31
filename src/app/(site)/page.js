import HeroSlider from "@/components/HeroSlider";
import FeaturedStudios from "@/components/FeaturedStudios";
import CategoryCards from "@/components/CategoryCards";
import HowBookingWorks from "@/components/HowBookingWorks";
import HostGuarantee from "@/components/HostGuarantee";

export default function HomePage() {
  return (
    <>
      {/* Hero slider */}
      <div className="border-b border-base-300/40">
        <HeroSlider />
      </div>

      {/* Featured studios (live data, skeleton loading) */}
      <FeaturedStudios />

      {/* Categories */}
      <CategoryCards />

      {/* How booking works */}
      <HowBookingWorks />

      {/* Host guarantee */}
      <HostGuarantee />
    </>
  );
}

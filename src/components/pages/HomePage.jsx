import HeroSection from "@/components/organisms/HeroSection";
import FeaturedHotels from "@/components/organisms/FeaturedHotels";
import TestimonialsSection from "@/components/organisms/TestimonialsSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedHotels />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
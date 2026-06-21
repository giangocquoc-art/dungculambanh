import { Navbar } from "@/components/mindloop/navbar";
import { Hero } from "@/components/mindloop/hero";
import { SearchChanged } from "@/components/mindloop/search-changed";
import { Mission } from "@/components/mindloop/mission";
import { Solution } from "@/components/mindloop/solution";
import { CTA } from "@/components/mindloop/cta";
import { Footer } from "@/components/mindloop/footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SearchChanged />
        <Mission />
        <Solution />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

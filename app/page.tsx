
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import DashboardPreview from "../components/landing/DashboardPreview";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <DashboardPreview />
                <HowItWorks />
                <Features />
                <Footer />
            </div>
        </main>
    );
}

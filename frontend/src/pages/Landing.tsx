import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";

export function Landing(){
    return <div>
        <Navbar />
        <Hero />
        <Features />
        <Footer />
    </div>
}
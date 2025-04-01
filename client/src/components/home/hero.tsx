import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import bramhollowComplex from "@/assets/bramhollow-complex.svg";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative bg-gradient-to-b from-primary to-primary-dark overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to<br />Bramhollow Condominium Association
            </h1>
            <p className="text-sm text-white mt-2">Est. 1985</p>
            <p className="text-xl text-white mt-6 opacity-90">
              A peaceful and well-maintained community where neighbors become friends and every residence feels like home.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={user ? "/dashboard" : "/auth"}>
                <Button className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-md transition-colors">
                  Resident Login
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="bg-white hover:bg-gray-100 text-primary font-semibold px-6 py-3 rounded-md transition-colors">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <img
              src={bramhollowComplex}
              alt="Bramhollow Condominiums"
              className="w-full max-w-xl rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

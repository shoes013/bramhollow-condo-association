import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative bg-primary overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Bramhollow Condominiums"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
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
      </div>
    </section>
  );
};

export default Hero;

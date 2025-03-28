const boardMembers = [
  { name: "Jennifer Harmon", position: "President" },
  { name: "Michael Chen", position: "Vice President" },
  { name: "Sarah Johnson", position: "Treasurer" },
  { name: "Robert Williams", position: "Secretary" }
];

const AboutSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">About Bramhollow</h2>
            <p className="text-gray-700 mb-4">
              Established in 1985, Bramhollow Condominium Association is a premier residential community located in New Jersey. 
              Our 120-unit property spans across 15 acres of beautifully landscaped grounds, providing a serene environment 
              for all residents.
            </p>
            <p className="text-gray-700 mb-4">
              Our mission is to maintain and enhance property values while fostering a strong sense of community. 
              The association is governed by a dedicated board of trustees elected by homeowners, and managed by 
              a professional property management company.
            </p>
            <p className="text-gray-700 mb-6">
              Bramhollow prides itself on well-maintained common areas, responsive management, and a commitment to 
              transparent governance. We strictly adhere to the New Jersey Condominium Act (N.J.S.A. 46:8B-1 et. seq.) 
              in all our operations.
            </p>
            
            <h3 className="text-xl font-semibold text-primary-dark mt-8 mb-4">Board of Trustees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boardMembers.map((member, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                  <div className="font-semibold text-secondary-dark">{member.name}</div>
                  <div className="text-gray-600 text-sm">{member.position}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Bramhollow Condominiums" 
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-6">
                <div className="text-2xl font-semibold">Bramhollow Condominiums</div>
                <div className="text-sm opacity-90">Celebrating over 35 years of community</div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
              <div className="text-accent font-bold text-4xl">35+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

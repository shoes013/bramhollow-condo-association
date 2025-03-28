import { Link } from "wouter";

const features = [
  {
    icon: "fas fa-tree",
    title: "Landscaped Grounds",
    description: "Beautifully maintained common areas with seasonal plantings and professional landscaping year-round."
  },
  {
    icon: "fas fa-swimming-pool",
    title: "Community Pool",
    description: "Enjoy our heated pool during summer months with dedicated lap swimming hours and family fun zones."
  },
  {
    icon: "fas fa-shield-alt",
    title: "24/7 Security",
    description: "Round-the-clock security monitoring and controlled access for your peace of mind."
  }
];

const Features = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Community Features</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what makes Bramhollow Condominium Association the perfect place to call home.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-accent mb-4">
                <i className={`${feature.icon} text-3xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-secondary-dark mb-2">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/about">
            <a className="inline-block text-primary font-semibold hover:text-primary-dark transition-colors">
              Learn more about our community <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;

import { Link } from "wouter";

const portalFeatures = [
  {
    icon: "fas fa-credit-card",
    title: "Online Payments",
    description: "Pay monthly dues and special assessments securely online."
  },
  {
    icon: "fas fa-tools",
    title: "Maintenance Requests",
    description: "Submit and track maintenance requests electronically."
  },
  {
    icon: "fas fa-calendar-alt",
    title: "Community Calendar",
    description: "Stay updated on community events and important dates."
  },
  {
    icon: "fas fa-users",
    title: "Member Directory",
    description: "Connect with your neighbors in our private community directory."
  },
  {
    icon: "fas fa-file-alt",
    title: "Documents Access",
    description: "View and download important association documents."
  },
  {
    icon: "fas fa-clipboard-list",
    title: "Meeting Minutes",
    description: "Access past and upcoming board meeting minutes."
  }
];

const PortalFeatures = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-dark mb-6">Portal Features</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portalFeatures.map((feature, index) => (
          <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-accent mr-4">
              <i className={`${feature.icon} text-xl`}></i>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-dark">{feature.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="text-primary mr-3">
            <i className="fas fa-info-circle text-xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-primary-dark">Download Our Mobile App</h4>
            <p className="text-sm text-gray-700 mt-1">
              Access all portal features on-the-go with our dedicated mobile application.
              Available for iOS and Android devices.
            </p>
            <div className="mt-3 flex space-x-3">
              <a href="#" className="inline-flex items-center text-sm text-primary hover:text-primary-dark">
                <i className="fab fa-apple mr-1"></i> App Store
              </a>
              <a href="#" className="inline-flex items-center text-sm text-primary hover:text-primary-dark">
                <i className="fab fa-android mr-1"></i> Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalFeatures;

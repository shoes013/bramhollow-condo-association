const ContactInfo = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-dark mb-6">Contact Information</h3>
      
      <div className="bg-gray-50 rounded-lg p-6 shadow-md mb-6">
        <div className="flex items-start mb-4">
          <div className="text-accent mr-4">
            <i className="fas fa-building text-xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-dark">Management Office</h4>
            <p className="text-gray-600 mt-1">
              123 Bramhollow Drive<br />
              Anytown, NJ 07001
            </p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <div className="text-accent mr-4">
            <i className="fas fa-phone-alt text-xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-dark">Phone</h4>
            <p className="text-gray-600 mt-1">
              (201) 555-1234<br />
              <span className="text-sm text-gray-500">Monday-Friday, 9:00 AM - 5:00 PM</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <div className="text-accent mr-4">
            <i className="fas fa-envelope text-xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-dark">Email</h4>
            <p className="text-gray-600 mt-1">
              info@bramhollowcondo.org<br />
              <span className="text-sm text-gray-500">We respond within 24-48 hours</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="text-accent mr-4">
            <i className="fas fa-exclamation-circle text-xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-dark">Emergency Contact</h4>
            <p className="text-gray-600 mt-1">
              (201) 555-5678<br />
              <span className="text-sm text-gray-500">24/7 Emergency Maintenance</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
        <div className="bg-gray-200 h-64">
          {/* Google Maps Embed would go here in a production environment */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <i className="fas fa-map-marker-alt text-3xl mb-2"></i>
              <p>Map of Bramhollow Condominiums</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-secondary-dark">Our Location</h4>
          <p className="text-sm text-gray-600 mt-1">
            Conveniently located 10 minutes from downtown Anytown and 5 minutes from major highways.
          </p>
          <a 
            href="https://maps.google.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:text-primary-dark text-sm font-semibold mt-2 inline-block"
          >
            Get Directions <i className="fas fa-external-link-alt ml-1"></i>
          </a>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold text-secondary-dark mb-2">Office Hours</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Monday - Friday:</span>
            <span className="text-gray-600">9:00 AM - 5:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Saturday:</span>
            <span className="text-gray-600">10:00 AM - 2:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Sunday:</span>
            <span className="text-gray-600">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;

import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-secondary-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Bramhollow</h3>
            <p className="text-gray-300 text-sm">
              Established in 1985, Bramhollow Condominium Association is committed to creating a vibrant community for all residents.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-white transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <a className="text-gray-300 hover:text-white transition-colors">Residents Portal</a>
                </Link>
              </li>
              <li>
                <Link href="/documents">
                  <a className="text-gray-300 hover:text-white transition-colors">Documents</a>
                </Link>
              </li>
              <li>
                <Link href="/news">
                  <a className="text-gray-300 hover:text-white transition-colors">News & Events</a>
                </Link>
              </li>
              <li>
                <Link href="/gallery">
                  <a className="text-gray-300 hover:text-white transition-colors">Photo Gallery</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resident Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-300 hover:text-white transition-colors">Pay Association Dues</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-300 hover:text-white transition-colors">Submit Maintenance Request</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-300 hover:text-white transition-colors">Reserve Amenities</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-300 hover:text-white transition-colors">Community Calendar</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-300 hover:text-white transition-colors">Board Meeting Schedule</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-300 hover:text-white transition-colors">FAQ</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <div className="flex items-start mb-2">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-400"></i>
                <span className="text-gray-300">
                  123 Bramhollow Drive<br />
                  Anytown, NJ 07001
                </span>
              </div>
              <div className="flex items-start mb-2">
                <i className="fas fa-phone-alt mt-1 mr-3 text-gray-400"></i>
                <span className="text-gray-300">(201) 555-1234</span>
              </div>
              <div className="flex items-start mb-2">
                <i className="fas fa-envelope mt-1 mr-3 text-gray-400"></i>
                <span className="text-gray-300">info@bramhollowcondo.org</span>
              </div>
            </address>
            <div className="mt-4">
              <Link href="/contact">
                <a className="bg-primary hover:bg-primary-light text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors inline-block">
                  Contact Management
                </a>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Bramhollow Condominium Association. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

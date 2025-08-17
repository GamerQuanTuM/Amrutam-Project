import { Calendar, MapPin, Phone } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-4">Amrutam</h3>
            <p className="text-gray-300">
              Your trusted partner in authentic Ayurvedic healing and wellness.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Consultation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Panchakarma
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Herbal Medicine
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Wellness Programs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Mumbai, India
              </li>
              <li className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Mon-Sat: 9AM-6PM
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Amrutam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

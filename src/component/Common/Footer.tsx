import React from 'react';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-400 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-white transition duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition duration-300">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">VIEW WEBSITE IN</h4>
            <div className="flex items-center">
              <select
                className="bg-gray-800 text-gray-400 border-none rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                defaultValue="English"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">NEED HELP?</h4>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="hover:text-white transition duration-300">
                  Visit Help Center
                </a>
              </li>
              <li>
                <a href="/feedback" className="hover:text-white transition duration-300">
                  Share Feedback
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">CONNECT WITH US</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <p className="mb-2">© 2025 FILMBIT. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="/terms" className="hover:text-white transition duration-300">
              Terms of Use
            </a>
            <a href="/privacy" className="hover:text-white transition duration-300">
              Privacy Policy
            </a>
            <a href="/faq" className="hover:text-white transition duration-300">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <footer className={`bg-gray-800 text-white py-8 ${theme}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left section */}
          <motion.div
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold tracking-wide">BLOG</h1>
          </motion.div>

          {/* Middle section */}
          <motion.div
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <li>
                <motion.a
                  href="#home"
                  className="hover:text-yellow-400 transition-colors duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Home
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#about"
                  className="hover:text-yellow-400 transition-colors duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  About
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#services"
                  className="hover:text-yellow-400 transition-colors duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Services
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#contact"
                  className="hover:text-yellow-400 transition-colors duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Contact
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Right section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-right mb-6 md:mb-0"
          >
            <div className="flex justify-center md:justify-end mt-4 space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaFacebookF className="text-xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaLinkedinIn className="text-xl" />
              </a>
            </div>
            <p className="text-sm pt-2">
              &copy; 2024 BLOG. All rights reserved.
            </p>
            <p className="text-xs mt-2">Created by Raushan Gupta</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

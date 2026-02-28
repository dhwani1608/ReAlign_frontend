'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">ReAlign AI</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bridging Design Assumptions with Site Reality
            </p>
            <p className="text-xs text-gray-500 mt-4">
              AI-driven system for reconciling design assumptions with on-site construction reality.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/designer" className="hover:text-white transition">
                  Design Engineer
                </Link>
              </li>
              <li>
                <Link href="/site" className="hover:text-white transition">
                  Site Engineer
                </Link>
              </li>
              <li>
                <Link href="/designer/layouts" className="hover:text-white transition">
                  Layout Generation
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Bottom footer */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} ReAlign AI. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

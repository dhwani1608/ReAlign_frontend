'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.role === 'design_engineer') {
        router.push('/designer');
      } else if (user.role === 'site_engineer') {
        router.push('/site');
      }
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  // Show loading while checking authentication
  if (isLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show home page only if user is NOT authenticated
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="relative text-white py-20 md:py-32 overflow-hidden"
        style={{
          backgroundImage: 'url(/home.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-primary-900/90"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                ReAlign AI
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-6">
                Bridging Design Assumptions with Site Reality
              </p>
              <p className="text-lg text-primary-200 mb-8 leading-relaxed max-w-lg">
                Harness AI-powered generative design to reconcile construction plans with real-world site conditions. Reduce costs, minimize timeline slippage, and empower teams with adaptive solutions.
              </p>
              <div className="flex gap-4">
                <Link href="/register?role=design_engineer" className="btn btn-primary">
                  Start Free →
                </Link>
                <Link href="/login" className="btn bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Designed for Your Role</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're designing cutting-edge layouts or managing on-site execution, ReAlign AI adapts to your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-8">
              <div className="text-5xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Design Engineers</h3>
              <p className="text-gray-600 mb-6">
                Generate AI-powered layouts instantly. Simulate costs, timelines, and constraints without bounds.
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>✓ Real-time layout generation</li>
                <li>✓ Cost & timeline prediction</li>
                <li>✓ Multi-constraint optimization</li>
                <li>✓ Design approval workflows</li>
              </ul>
              <Link href="/register?role=design_engineer" className="btn btn-primary w-full mb-3">
                Get Started
              </Link>
              <Link href="/login" className="btn btn-secondary w-full">
                Sign In
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-8">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Site Engineers</h3>
              <p className="text-gray-600 mb-6">
                Monitor execution in real-time. Report issues and trigger adaptive recalibration instantly.
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>✓ Real-time monitoring dashboard</li>
                <li>✓ Issue reporting & tracking</li>
                <li>✓ Sensor integration</li>
                <li>✓ Adaptive recalibration</li>
              </ul>
              <Link href="/register?role=site_engineer" className="btn btn-primary w-full mb-3">
                Get Started
              </Link>
              <Link href="/login" className="btn btn-secondary w-full">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How ReAlign AI Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A seamless workflow that bridges the gap between design intent and site reality
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 md:gap-4">
            <div className="relative">
              <div className="bg-primary-100 rounded-lg p-8 text-center mb-4">
                <div className="text-4xl mb-2">1️⃣</div>
                <h3 className="font-bold text-gray-900">Create Project</h3>
              </div>
              <p className="text-gray-600 text-sm">Define constraints: budget, timeline, target area, and site conditions</p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-16 -right-3 w-6 h-0.5 bg-primary-300"></div>
            </div>

            <div className="relative">
              <div className="bg-primary-100 rounded-lg p-8 text-center mb-4">
                <div className="text-4xl mb-2">2️⃣</div>
                <h3 className="font-bold text-gray-900">Generate Design</h3>
              </div>
              <p className="text-gray-600 text-sm">AI generates optimized layouts that respect all constraints and site reality</p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-16 -right-3 w-6 h-0.5 bg-primary-300"></div>
            </div>

            <div className="relative">
              <div className="bg-primary-100 rounded-lg p-8 text-center mb-4">
                <div className="text-4xl mb-2">3️⃣</div>
                <h3 className="font-bold text-gray-900">Monitor Execution</h3>
              </div>
              <p className="text-gray-600 text-sm">Track real-time progress with IoT sensors and site team input</p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-16 -right-3 w-6 h-0.5 bg-primary-300"></div>
            </div>

            <div>
              <div className="bg-primary-100 rounded-lg p-8 text-center mb-4">
                <div className="text-4xl mb-2">4️⃣</div>
                <h3 className="font-bold text-gray-900">Recalibrate</h3>
              </div>
              <p className="text-gray-600 text-sm">When issues arise, adapt design automatically within new constraints</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to bridge design assumptions with site reality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Generation</h3>
              <p className="text-gray-600">
                Generative design algorithms create optimal layouts that satisfy multiple competing constraints simultaneously.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Analytics</h3>
              <p className="text-gray-600">
                Forecast costs, timelines, and resource requirements with ML-backed precision before construction begins.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Monitoring</h3>
              <p className="text-gray-600">
                Connect IoT sensors to track site conditions and construction progress in real-time with live dashboards.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Adaptive Recalibration</h3>
              <p className="text-gray-600">
                Automatically regenerate designs when site issues arise, maintaining feasibility and optimality within new constraints.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Issue Tracking</h3>
              <p className="text-gray-600">
                Structured issue reporting with automated impact analysis and recalibration recommendations.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600">
                Role-based access control, encrypted data, audit trails, and compliance with construction industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Teams Choose ReAlign AI</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Reduce Cost Overruns</h3>
                    <p className="text-gray-600 mt-1">Minimize expensive rework by catching design conflicts early and adapting proactively.</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Accelerate Timelines</h3>
                    <p className="text-gray-600 mt-1">Generate layouts in minutes instead of weeks. Adaptive designs reduce delays from site issues.</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Improve Quality</h3>
                    <p className="text-gray-600 mt-1">Real-time monitoring and rapid recalibration ensure designs remain optimal throughout execution.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Better Collaboration</h3>
                    <p className="text-gray-600 mt-1">Unified platform bridges design and site teams with shared visibility and instant communication.</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Scalable Insights</h3>
                    <p className="text-gray-600 mt-1">Learn from every project with AI that improves predictions and optimization over time.</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Risk Mitigation</h3>
                    <p className="text-gray-600 mt-1">Predictive analytics identify potential issues before they impact schedules and budgets.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-World Use Cases</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <div 
                className="h-40 relative"
                style={{
                  backgroundImage: 'url(/commercial.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Commercial Complexes</h3>
                <p className="text-gray-600 text-sm">
                  Multi-floor office buildings with complex mechanical/electrical routing. Generate layouts that optimize tenant flow while respecting structural constraints.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <div 
                className="h-40 relative"
                style={{
                  backgroundImage: 'url(/industrial.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Industrial Facilities</h3>
                <p className="text-gray-600 text-sm">
                  Manufacturing floors with equipment placement, safety zones, and workflow optimization. Adaptive recalibration when equipment specs change.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <div 
                className="h-40 relative"
                style={{
                  backgroundImage: 'url(/infrastructure.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Infrastructure Projects</h3>
                <p className="text-gray-600 text-sm">
                  Large-scale civil infrastructure with terrain analysis, environmental factors, and resource constraints. Handle dynamic site conditions seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Bridge Design & Reality?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join teams worldwide using ReAlign AI to create smarter, more adaptive construction designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=design_engineer" className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Start as Design Engineer →
            </Link>
            <Link href="/register?role=site_engineer" className="btn bg-white bg-opacity-20 hover:bg-opacity-30 border border-white">
              Start as Site Engineer →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { useBreadcrumbs } from '@/lib/auth-guard';
import { Icons, toast } from 'react-toastify';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const breadcrumbs = useBreadcrumbs();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      apiClient.clearToken();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Navigation items based on role
  const navItems =
    user?.role === 'design_engineer'
      ? [
          { label: 'Projects', href: '/designer' },
          { label: 'Layouts', href: '/designer/layouts'}
        ]
      : user?.role === 'site_engineer'
      ? [
          { label: 'Dashboard', href: '/site', icon: '📊' },
          { label: 'Issues', href: '/site/issues', icon: '🚨' },
        ]
      : [];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  if (!user) {
    return (
      <>
        <nav className="bg-white shadow-md sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary-600">BuildAI</span>
              </Link>

              {/* Auth Links */}
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Authenticated Navigation
  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>

              <Link href={user.role === 'design_engineer' ? '/designer' : '/site'} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary-600">BuildAI</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon} </span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4" ref={userMenuRef}>
              {/* User Info + Dropdown */}
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-gray-900">{user.full_name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold hover:bg-primary-200 transition"
                  title={user.full_name}
                >
                  {user.full_name.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b text-sm text-gray-600">
                      <div>Logged in as</div>
                      <div className="font-semibold text-gray-900">{user.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 text-sm font-medium rounded transition ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
              <div className="border-t mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && pathname !== '/' && pathname !== '/login' && pathname !== '/register' && (
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-3 text-sm overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-primary-600 hover:text-primary-700">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

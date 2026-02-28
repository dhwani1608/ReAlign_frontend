'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Input, Select, Card, Alert, Loading } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useAuthStore();
  
  const [role, setRole] = useState<string>(searchParams.get('role') || 'design_engineer');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.register(
        formData.email,
        formData.password,
        formData.full_name,
        role
      );

      // Log in automatically after registration
      const loginResponse = await apiClient.login(formData.email, formData.password);
      
      setUser(loginResponse.user);
      setToken(loginResponse.access_token);
      
      toast.success('Registration successful!');
      
      // Redirect based on role
      if (role === 'design_engineer') {
        router.push('/designer');
      } else {
        router.push('/site');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container max-w-md mx-auto py-12">
        <Card className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our construction platform</p>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Select Your Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'design_engineer', label: 'Design Engineer (Office)' },
                { value: 'site_engineer', label: 'Site Engineer (On-Site)' },
              ]}
            />

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              error={errors.full_name}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>

            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <RegisterPageContent />
    </Suspense>
  );
}

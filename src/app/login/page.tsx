'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Input, Card, Alert } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors({});
    
    if (!formData.email || !formData.password) {
      setErrors({ general: 'Email and password are required' });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.login(formData.email, formData.password);
      
      setUser(response.user);
      setToken(response.access_token);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (response.user.role === 'design_engineer') {
        router.push('/designer');
      } else {
        router.push('/site');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container max-w-md mx-auto py-12">
        <Card className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Create one
              </Link>
            </p>
          </form>
        </Card>

      </div>
    </div>
  );
}

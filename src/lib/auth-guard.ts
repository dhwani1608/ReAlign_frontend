/**
 * Authentication & Route Guard Utilities
 * Provides secure route protection and session management
 */

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { useEffect, useState } from 'react';
import { apiClient } from '@/utils/api';

/**
 * Hook for protecting routes that require authentication
 * Redirects to login if not authenticated
 */
export function useAuthProtection() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    setIsAuthorized(true);
  }, [isAuthenticated, user, router]);

  return isAuthorized;
}

/**
 * Hook for protecting role-specific routes
 * Redirects to appropriate dashboard if user lacks required role
 */
export function useRoleProtection(requiredRole: 'design_engineer' | 'site_engineer') {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (user.role !== requiredRole) {
      // Redirect to appropriate dashboard
      const dashboard = user.role === 'design_engineer' ? '/designer' : '/site';
      router.push(dashboard);
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, requiredRole, router]);

  return isAuthorized;
}

/**
 * Hook for verifying user session is still valid
 * Calls /auth/me to validate token and refresh user data
 */
export function useSessionValidation() {
  const { user, setUser, logout } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!user) {
        setIsValidating(false);
        return;
      }

      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Session invalid or token expired
        logout();
        apiClient.clearToken();
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, []);

  return isValidating;
}

/**
 * Hook for session timeout protection (auto-logout after inactivity)
 */
export function useSessionTimeout(timeoutMinutes: number = 30) {
  const { logout } = useAuthStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;
    let activityTimeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      clearTimeout(activityTimeoutId);

      timeoutId = setTimeout(() => {
        logout();
        apiClient.clearToken();
        window.location.href = '/login?reason=session-expired';
      }, timeoutMinutes * 60 * 1000);
    };

    // Reset on user activity
    const handleActivity = () => resetTimeout();

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(activityTimeoutId);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [user, logout, timeoutMinutes]);
}

/**
 * Hook for tracking current route and generating breadcrumbs
 */
export function useBreadcrumbs() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const breadcrumbs = (): Array<{ label: string; href: string }> => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: Array<{ label: string; href: string }> = [];

    if (segments.length === 0) {
      return [{ label: 'Home', href: '/' }];
    }

    // Home link
    const dashboard =
      user?.role === 'design_engineer'
        ? '/designer'
        : user?.role === 'site_engineer'
        ? '/site'
        : '/';

    crumbs.push({ label: 'Dashboard', href: dashboard });

    let href = '';
    segments.forEach((segment, index) => {
      href += `/${segment}`;

      // Skip numeric IDs in breadcrumbs
      if (/^\d+$/.test(segment)) return;

      const label = segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      crumbs.push({ label, href });
    });

    return crumbs;
  };

  return breadcrumbs();
}

/**
 * Verify secure password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let strength = 'weak';

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters');
  } else if (password.length >= 12) {
    strength = 'good';
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain an uppercase letter');
  } else {
    strength = 'good';
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain a lowercase letter');
  } else {
    strength = 'good';
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain a number');
  } else {
    strength = 'good';
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Password must contain a special character (!@#$%^&...)');
  } else if (strength === 'good') {
    strength = 'strong';
  }

  const isValid = feedback.length === 0;

  return {
    isValid,
    strength: isValid ? 'strong' : (strength as 'weak' | 'fair' | 'good'),
    feedback,
  };
}

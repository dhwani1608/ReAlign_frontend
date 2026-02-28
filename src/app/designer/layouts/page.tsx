'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Card, Badge, Loading } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

type LayoutItem = {
  id: number;
  project_id: number;
  area: number;
  cost: number;
  timeline_days: number;
  status: string;
  approval_status: string;
  created_at: string;
};

export default function DesignerLayoutsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [layouts, setLayouts] = useState<LayoutItem[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'design_engineer') {
      router.push('/site');
      return;
    }

    fetchLayouts();
  }, [user, router]);

  const fetchLayouts = async () => {
    setIsLoading(true);
    try {
      const projects = await apiClient.getProjects();
      const projectDetails = await Promise.all(
        projects.map((project: { id: number }) => apiClient.getProject(project.id))
      );

      const allLayouts = projectDetails
        .flatMap((project: { layouts?: LayoutItem[] }) => project.layouts || [])
        .sort(
          (a: LayoutItem, b: LayoutItem) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setLayouts(allLayouts);
    } catch (error) {
      toast.error('Failed to fetch layouts');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Layouts</h1>
          <p className="text-gray-600">Review layouts generated across your projects</p>
        </div>

        {layouts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No layouts found yet</p>
            <Link href="/designer" className="btn btn-primary">
              Go to Projects
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {layouts.map((layout) => (
              <Card key={layout.id} className="hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Layout #{layout.id}</h3>
                    <p className="text-sm text-gray-600">Project #{layout.project_id}</p>
                  </div>
                  <Badge variant={layout.status === 'sent_to_site' ? 'success' : 'gray'}>
                    {layout.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-gray-600">Area</span>
                    <div className="font-semibold">{layout.area.toLocaleString()} px</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost</span>
                    <div className="font-semibold">₹{layout.cost.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Timeline</span>
                    <div className="font-semibold">{layout.timeline_days} days</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Approval</span>
                    <div className="font-semibold capitalize">{layout.approval_status}</div>
                  </div>
                </div>

                <Link href={`/designer/layouts/${layout.id}`} className="btn btn-primary w-full">
                  View Layout
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

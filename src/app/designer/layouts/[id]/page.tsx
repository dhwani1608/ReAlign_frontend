'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Card, Badge, Loading } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

export default function LayoutDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const layoutId = params.id as string;
  
  const [layout, setLayout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const previewUrl = layout?.layout_data?.preview_image_url
    ? (layout.layout_data.preview_image_url.startsWith('http://') || layout.layout_data.preview_image_url.startsWith('https://')
        ? layout.layout_data.preview_image_url
        : `${apiBaseUrl}${layout.layout_data.preview_image_url}`)
    : null;

  useEffect(() => {
    if (!user || user.role !== 'design_engineer') {
      router.push('/login');
      return;
    }

    fetchLayout();
  }, [user, router, layoutId]);

  const fetchLayout = async () => {
    try {
      const data = await apiClient.getLayout(parseInt(layoutId));
      setLayout(data);
    } catch (error) {
      toast.error('Failed to fetch layout');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!layout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container py-12 text-center">
          <p className="text-gray-600">Layout not found</p>
          <Link href="/designer" className="btn btn-primary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container py-12">
        <Link href="/designer" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {layout.name || `Layout #${layout.id}`}
          </h1>
          <div className="flex gap-2">
            <Badge variant={layout.status === 'draft' ? 'warning' : 'success'}>
              {layout.status}
            </Badge>
            <Badge
              variant={
                layout.approval_status === 'approved'
                  ? 'success'
                  : layout.approval_status === 'rejected'
                  ? 'danger'
                  : 'warning'
              }
            >
              {layout.approval_status}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="text-sm text-gray-600 mb-1">Area</div>
            <div className="text-3xl font-bold text-primary-600">{layout.area.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">pixels</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Estimated Cost</div>
            <div className="text-3xl font-bold text-green-600">₹{layout.cost.toLocaleString()}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Timeline</div>
            <div className="text-3xl font-bold text-blue-600">{layout.timeline_days}</div>
            <div className="text-xs text-gray-500 mt-1">days</div>
          </Card>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Layout ID</span>
                <span className="font-semibold">{layout.layout_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Efficiency</span>
                <span className="font-semibold">{(layout.efficiency * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Material Factor</span>
                <span className="font-semibold">{(layout.material_factor * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold capitalize">{layout.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approval</span>
                <span className="font-semibold capitalize">{layout.approval_status}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Issues & Changes</h2>
            {layout.issues && layout.issues.length > 0 ? (
              <div className="space-y-4">
                {layout.issues.map((issue: any) => (
                  <div key={issue.id} className="border-l-4 border-orange-400 pl-4">
                    <div className="font-semibold text-gray-900">{issue.issue_type}</div>
                    <Badge variant="warning" className="text-xs mt-1">
                      {issue.severity}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">{issue.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Deviation: {issue.deviation_percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No issues reported</p>
            )}
          </Card>
        </div>

        {layout.description && (
          <Card className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600">{layout.description}</p>
          </Card>
        )}

        {(previewUrl || layout?.layout_data?.layout_plan) && (
          <Card className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Layout Plan</h2>

            {previewUrl && (
              <img
                src={previewUrl}
                alt={`Generated preview for layout ${layout.id}`}
                className="w-full max-h-[420px] object-contain rounded-lg border mb-4"
              />
            )}

            {layout?.layout_data?.layout_plan?.zones?.length > 0 && (
              <div className="mb-4">
                <div className="font-semibold text-gray-900 mb-2">Zones</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {layout.layout_data.layout_plan.zones.map((zone: string, index: number) => (
                    <li key={`${zone}-${index}`}>{zone}</li>
                  ))}
                </ul>
              </div>
            )}

            {layout?.layout_data?.layout_plan?.construction_sequence?.length > 0 && (
              <div>
                <div className="font-semibold text-gray-900 mb-2">Construction Sequence</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {layout.layout_data.layout_plan.construction_sequence.map((step: string, index: number) => (
                    <li key={`${step}-${index}`}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <div className="mt-8 flex gap-4">
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
          {layout.approval_status === 'pending' && (
            <>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await apiClient.approveLayout(layout.id, true);
                    toast.success('Layout approved!');
                    fetchLayout();
                  } catch (error) {
                    toast.error('Failed to approve layout');
                  }
                }}
              >
                Approve Layout
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    await apiClient.approveLayout(layout.id, false);
                    toast.success('Layout rejected');
                    fetchLayout();
                  } catch (error) {
                    toast.error('Failed to reject layout');
                  }
                }}
              >
                Reject Layout
              </Button>
            </>
          )}
          {layout.approval_status === 'approved' && layout.status === 'draft' && (
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await apiClient.sendToSite(layout.id);
                  toast.success('Layout sent to site!');
                  fetchLayout();
                } catch (error) {
                  toast.error('Failed to send layout to site');
                }
              }}
            >
              Send to Site
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

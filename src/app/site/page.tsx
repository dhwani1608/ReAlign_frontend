'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Card, Badge, Loading, Alert } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

export default function SiteDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'site_engineer') {
      router.push('/designer');
      return;
    }

    fetchDashboard();
  }, [user, router]);

  const fetchDashboard = async () => {
    try {
      const data = await apiClient.getSiteDashboard();
      setDashboard(data);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Site Dashboard</h1>
          <p className="text-gray-600">Monitor layouts, report issues, and trigger recalibration</p>
        </div>

        {dashboard && (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center">
                <div className="text-3xl font-bold text-primary-600">{dashboard.total_active_layouts}</div>
                <div className="text-gray-600">Active Layouts</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-warning-500">{dashboard.layouts_with_issues}</div>
                <div className="text-gray-600">With Issues</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-primary-600">{dashboard.pending_recalculations}</div>
                <div className="text-gray-600">Pending Recalc</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-success-500">{dashboard.sensor_status_summary?.normal}</div>
                <div className="text-gray-600">Sensors OK</div>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Events</h2>
                {dashboard.recent_events && dashboard.recent_events.length > 0 ? (
                  <div className="space-y-4">
                    {dashboard.recent_events.map((event: any, idx: number) => (
                      <Card key={idx} className="border-l-4 border-primary-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{event.event}</h3>
                            <p className="text-sm text-gray-600 mt-1">Layout #{event.layout_id}</p>
                          </div>
                          <Badge variant={event.severity === 'critical' ? 'danger' : 'warning'} className="text-xs">
                            {event.severity || 'normal'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-8">
                    <p className="text-gray-600">No recent events</p>
                  </Card>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sensor Status</h2>
                {dashboard.sensor_status_summary && (
                  <div className="space-y-3">
                    <Card>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Sensors</span>
                        <span className="font-semibold">{dashboard.sensor_status_summary.total_sensors}</span>
                      </div>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Normal</span>
                        <Badge variant="success">{dashboard.sensor_status_summary.normal}</Badge>
                      </div>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Warning</span>
                        <Badge variant="warning">{dashboard.sensor_status_summary.warning}</Badge>
                      </div>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Critical</span>
                        <Badge variant="danger">{dashboard.sensor_status_summary.critical}</Badge>
                      </div>
                    </Card>
                  </div>
                )}

                <Button variant="primary" className="w-full mt-6">
                  <Link href="/site/issues">View All Issues</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

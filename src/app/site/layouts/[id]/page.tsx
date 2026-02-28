'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Card, Badge, Loading, Alert, Input, Select, Textarea } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

export default function LayoutViewPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const layoutId = params.id as string;
  
  const [layout, setLayout] = useState<any>(null);
  const [sensorData, setSensorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showRecalibration, setShowRecalibration] = useState(false);
  const [recalibrating, setRecalibrating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issue_type: 'delay',
    severity: 'medium',
    description: '',
    affected_area: 0,
    deviation_percentage: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'site_engineer') {
      router.push('/login');
      return;
    }

    fetchData();
  }, [user, router, layoutId]);

  const fetchData = async () => {
    try {
      const [layoutData, sensorDataRes] = await Promise.all([
        apiClient.viewLayout(parseInt(layoutId)),
        apiClient.getSensorData(parseInt(layoutId)),
      ]);
      setLayout(layoutData);
      setSensorData(sensorDataRes);
    } catch (error) {
      toast.error('Failed to fetch layout details');
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.reportIssue({
        layout_id: parseInt(layoutId),
        ...formData,
      });
      toast.success('Issue reported successfully!');
      setShowIssueForm(false);
      setFormData({
        issue_type: 'delay',
        severity: 'medium',
        description: '',
        affected_area: 0,
        deviation_percentage: 0,
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to report issue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerRecalibration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecalibrating(true);
    try {
      const result = await apiClient.triggerRecalibration(
        parseInt(layoutId),
        {
          trigger_reason: 'Site condition deviation detected',
          sensor_data: sensorData?.sensors || {},
        }
      );
      toast.success('Layout recalibration triggered!');
      setShowRecalibration(false);
      // Show recalibration result
      alert(`Recalibration Complete!\n\nNew Area: ${result.new_area.toLocaleString()} px\nNew Cost: ₹${result.new_cost.toLocaleString()}\nNew Timeline: ${result.new_timeline_days} days\nConfidence: ${(result.confidence_score * 100).toFixed(1)}%`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to trigger recalibration');
    } finally {
      setRecalibrating(false);
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
          <Link href="/site" className="btn btn-primary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const anomalySensors = sensorData?.sensors?.filter((s: any) => s.status !== 'normal') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container py-12">
        <Link href="/site" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
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
            <Badge variant="gray">{layout.layout_id}</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

        {anomalySensors.length > 0 && (
          <Alert variant="warning">
            <strong>{anomalySensors.length} sensor anomaly detected!</strong> Your layout may require recalibration.
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-Time Sensor Data</h2>
            {sensorData?.sensors && sensorData.sensors.length > 0 ? (
              <div className="space-y-3 mb-8">
                {sensorData.sensors.map((sensor: any, idx: number) => (
                  <Card
                    key={idx}
                    className={`${
                      sensor.status === 'critical'
                        ? 'border-l-4 border-red-500 bg-red-50'
                        : sensor.status === 'warning'
                        ? 'border-l-4 border-yellow-500 bg-yellow-50'
                        : 'border-l-4 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900">{sensor.sensor_type.replace('_', ' ')}</div>
                        <div className="text-sm text-gray-600 mt-1">Zone {sensor.zone} • {sensor.sensor_id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {sensor.value.toFixed(1)} {sensor.unit}
                        </div>
                        <Badge variant={sensor.status === 'normal' ? 'success' : sensor.status === 'warning' ? 'warning' : 'danger'} className="text-xs mt-2">
                          {sensor.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8 mb-8">
                <p className="text-gray-600">No sensor data available</p>
              </Card>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layout Issues</h2>
            {layout.issues && layout.issues.length > 0 ? (
              <div className="space-y-4 mb-8">
                {layout.issues.map((issue: any) => (
                  <Card key={issue.id} className="border-l-4 border-orange-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">
                          {issue.issue_type.replace('_', ' ')}
                        </div>
                        <p className="text-gray-600 mt-1">{issue.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="warning" className="text-xs capitalize">
                            {issue.severity}
                          </Badge>
                          <Badge variant="gray" className="text-xs">
                            Deviation: {issue.deviation_percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8 mb-8">
                <p className="text-gray-600">No issues reported for this layout</p>
              </Card>
            )}
          </div>

          <div>
            <div className="space-y-4 sticky top-4">
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => setShowIssueForm(!showIssueForm)}
                  >
                    {showIssueForm ? 'Cancel' : '🚨 Report Issue'}
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => setShowRecalibration(!showRecalibration)}
                  >
                    {showRecalibration ? 'Cancel' : '🔄 Trigger Recalibration'}
                  </Button>
                  <Link href="/site/issues" className="btn btn-secondary w-full">
                    View All Issues
                  </Link>
                </div>
              </Card>

              {showIssueForm && (
                <Card className="border-blue-300 bg-blue-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Report Issue</h3>
                  <form onSubmit={handleReportIssue} className="space-y-3 text-sm">
                    <Select
                      label="Type"
                      value={formData.issue_type}
                      onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
                      options={[
                        { value: 'delay', label: 'Delay' },
                        { value: 'deviation', label: 'Deviation' },
                        { value: 'resource_shortage', label: 'Resource Shortage' },
                        { value: 'safety_concern', label: 'Safety Concern' },
                      ]}
                    />

                    <Select
                      label="Severity"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'critical', label: 'Critical' },
                      ]}
                    />

                    <Textarea
                      label="Description"
                      placeholder="Describe the issue..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                    />

                    <Input
                      label="Deviation %"
                      type="number"
                      step="0.1"
                      value={formData.deviation_percentage}
                      onChange={(e) => setFormData({ ...formData, deviation_percentage: Number(e.target.value) })}
                    />

                    <Button variant="primary" type="submit" loading={submitting} className="w-full">
                      Submit
                    </Button>
                  </form>
                </Card>
              )}

              {showRecalibration && (
                <Card className="border-blue-300 bg-blue-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Trigger Recalibration</h3>
                  <form onSubmit={handleTriggerRecalibration}>
                    <p className="text-sm text-gray-600 mb-4">
                      This will trigger adaptive optimization to recalibrate the layout based on current site conditions and sensor data.
                    </p>
                    <Button
                      variant="primary"
                      type="submit"
                      loading={recalibrating}
                      className="w-full"
                    >
                      Recalibrate Now
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

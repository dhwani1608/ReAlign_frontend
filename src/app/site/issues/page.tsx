'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Card, Badge, Loading, Input, Select, Textarea } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

export default function IssuesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<any[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportingLayout, setReportingLayout] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    issue_type: 'delay',
    severity: 'medium',
    description: '',
    affected_area: 0,
    deviation_percentage: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'site_engineer') {
      router.push('/login');
      return;
    }

    fetchIssues();
  }, [user, router]);

  const fetchIssues = async () => {
    try {
      const data = await apiClient.getIssues();
      setIssues(data);
    } catch (error) {
      toast.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingLayout) {
      toast.error('Please select a layout');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.reportIssue({
        layout_id: reportingLayout,
        ...formData,
      });
      toast.success('Issue reported successfully!');
      setShowReportForm(false);
      setReportingLayout(null);
      setFormData({
        issue_type: 'delay',
        severity: 'medium',
        description: '',
        affected_area: 0,
        deviation_percentage: 0,
      });
      fetchIssues();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to report issue');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Loading />
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'medium':
        return 'warning';
      default:
        return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Issue Management</h1>
            <p className="text-gray-600">Report and track construction issues</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowReportForm(!showReportForm)}
          >
            {showReportForm ? 'Cancel' : '+ Report Issue'}
          </Button>
        </div>

        {showReportForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Report New Issue</h2>
            <form onSubmit={handleReportIssue} className="space-y-4">
              <Input
                label="Layout ID"
                type="number"
                placeholder="Enter layout ID"
                value={reportingLayout || ''}
                onChange={(e) => setReportingLayout(Number(e.target.value) || null)}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Issue Type"
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
              </div>

              <Textarea
                label="Description"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Affected Area (pixels)"
                  type="number"
                  value={formData.affected_area}
                  onChange={(e) => setFormData({ ...formData, affected_area: Number(e.target.value) })}
                />

                <Input
                  label="Deviation Percentage (%)"
                  type="number"
                  step="0.1"
                  value={formData.deviation_percentage}
                  onChange={(e) => setFormData({ ...formData, deviation_percentage: Number(e.target.value) })}
                />
              </div>

              <Button variant="primary" type="submit" loading={submitting} className="w-full">
                Submit Report
              </Button>
            </form>
          </Card>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Issues</h2>
        {issues.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No issues reported</p>
            <Button variant="primary" onClick={() => setShowReportForm(true)}>
              Report First Issue
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 capitalize">
                      {issue.issue_type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Layout #{issue.layout_id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getSeverityColor(issue.severity)} className="capitalize">
                      {issue.severity}
                    </Badge>
                    <Badge
                      variant={
                        issue.status === 'resolved'
                          ? 'success'
                          : issue.status === 'in_progress'
                          ? 'warning'
                          : 'gray'
                      }
                      className="capitalize"
                    >
                      {issue.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{issue.description}</p>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4 pb-4 border-b">
                  <div>
                    <span className="text-gray-600">Affected Area</span>
                    <div className="font-semibold">{issue.affected_area.toLocaleString()} px</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Deviation</span>
                    <div className="font-semibold">{issue.deviation_percentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Reported</span>
                    <div className="font-semibold text-xs">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {issue.recalculation_triggered && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                    <p className="text-sm text-blue-700 font-semibold">✓ Recalibration triggered</p>
                  </div>
                )}

                <Link
                  href={`/site/layouts/${issue.layout_id}`}
                  className="btn btn-primary btn-sm"
                >
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

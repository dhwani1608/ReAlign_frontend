'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Card, Badge, Loading, Input } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingLayout, setGeneratingLayout] = useState(false);
  const [layoutForm, setLayoutForm] = useState({
    name: '',
    area: 100000,
    efficiency: 1.0,
    material_factor: 1.0,
  });
  const [costPrediction, setCostPrediction] = useState<any>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const getPreviewUrl = (layout: any) => {
    const rawUrl = layout?.layout_data?.preview_image_url;
    if (!rawUrl) return null;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    return `${apiBaseUrl}${rawUrl}`;
  };

  useEffect(() => {
    if (!user || user.role !== 'design_engineer') {
      router.push('/login');
      return;
    }

    fetchProject();
  }, [user, router, projectId]);

  const fetchProject = async () => {
    try {
      const data = await apiClient.getProject(parseInt(projectId));
      setProject(data);
    } catch (error) {
      toast.error('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handlePredictCost = async () => {
    try {
      const prediction = await apiClient.predictCost(
        layoutForm.area,
        layoutForm.efficiency,
        layoutForm.material_factor
      );
      setCostPrediction(prediction);
    } catch (error) {
      toast.error('Failed to predict cost');
    }
  };

  const handleGenerateLayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingLayout(true);
    try {
      await apiClient.generateLayout(
        {
          area: layoutForm.area,
          efficiency: layoutForm.efficiency,
          material_factor: layoutForm.material_factor,
          name: layoutForm.name,
        },
        parseInt(projectId)
      );
      toast.success('Layout generated successfully!');
      setLayoutForm({ name: '', area: 100000, efficiency: 1.0, material_factor: 1.0 });
      setCostPrediction(null);
      fetchProject();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate layout');
    } finally {
      setGeneratingLayout(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container py-12 text-center">
          <p className="text-gray-600">Project not found</p>
          <Link href="/designer" className="btn btn-primary mt-4">
            Back to Projects
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
          ← Back to Projects
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-sm text-gray-600 mb-1">Budget</div>
            <div className="text-2xl font-bold text-gray-900">₹{project.max_budget.toLocaleString()}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Timeline</div>
            <div className="text-2xl font-bold text-gray-900">{project.max_timeline_days} days</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Layouts</div>
            <div className="text-2xl font-bold text-gray-900">{project.layouts?.length || 0}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <Badge variant={project.status === 'active' ? 'success' : 'gray'} className="text-xs">
              {project.status}
            </Badge>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Layout</h2>
              <form onSubmit={handleGenerateLayout} className="space-y-4">
                <Input
                  label="Layout Name"
                  type="text"
                  placeholder="e.g., Design v1"
                  value={layoutForm.name}
                  onChange={(e) => setLayoutForm({ ...layoutForm, name: e.target.value })}
                />

                <Input
                  label="Area (pixels)"
                  type="number"
                  value={layoutForm.area}
                  onChange={(e) => setLayoutForm({ ...layoutForm, area: Number(e.target.value) })}
                />

                <Input
                  label="Efficiency"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="1.5"
                  value={layoutForm.efficiency}
                  onChange={(e) => setLayoutForm({ ...layoutForm, efficiency: Number(e.target.value) })}
                />

                <Input
                  label="Material Factor"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="1.5"
                  value={layoutForm.material_factor}
                  onChange={(e) => setLayoutForm({ ...layoutForm, material_factor: Number(e.target.value) })}
                />

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handlePredictCost}
                >
                  Predict Cost & Timeline
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  loading={generatingLayout}
                  className="w-full"
                >
                  Generate Layout
                </Button>
              </form>

              {costPrediction && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Cost Prediction</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost</span>
                      <span className="font-semibold">₹{costPrediction.estimated_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline</span>
                      <span className="font-semibold">{costPrediction.timeline_days} days</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-4 pt-4 border-t">
                      <span>Base</span>
                      <span>₹{costPrediction.breakdown.base_construction.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Material</span>
                      <span>₹{costPrediction.breakdown.material_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Labor</span>
                      <span>₹{costPrediction.breakdown.labor_cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layouts</h2>
            {project.layouts && project.layouts.length > 0 ? (
              <div className="space-y-4">
                {project.layouts.map((layout: any) => (
                  <Card key={layout.id} className="hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {layout.name || `Layout #${layout.id}`}
                        </h3>
                        <div className="flex gap-2 mt-2">
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
                        <span className="text-gray-600">Efficiency</span>
                        <div className="font-semibold">{(layout.efficiency * 100).toFixed(0)}%</div>
                      </div>
                    </div>

                    {layout.description && (
                      <p className="text-gray-600 text-sm mb-4">{layout.description}</p>
                    )}

                    {getPreviewUrl(layout) && (
                      <div className="mb-4">
                        <img
                          src={getPreviewUrl(layout) as string}
                          alt={`Layout preview ${layout.id}`}
                          className="w-full h-44 object-cover rounded-lg border"
                        />
                      </div>
                    )}

                    {layout.layout_data?.layout_plan?.construction_sequence?.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-semibold text-gray-800 mb-1">Layout Plan</div>
                        <p className="text-xs text-gray-600">
                          {layout.layout_data.layout_plan.construction_sequence[0]}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/designer/layouts/${layout.id}`} className="btn btn-secondary btn-sm flex-1">
                        View Details
                      </Link>
                      {layout.approval_status === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={async () => {
                              try {
                                await apiClient.approveLayout(layout.id, true);
                                toast.success('Layout approved!');
                                fetchProject();
                              } catch (error) {
                                toast.error('Failed to approve layout');
                              }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="flex-1"
                            onClick={async () => {
                              try {
                                await apiClient.approveLayout(layout.id, false);
                                toast.success('Layout rejected');
                                fetchProject();
                              } catch (error) {
                                toast.error('Failed to reject layout');
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {layout.approval_status === 'approved' && layout.status === 'draft' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={async () => {
                            try {
                              await apiClient.sendToSite(layout.id);
                              toast.success('Layout sent to site!');
                              fetchProject();
                            } catch (error) {
                              toast.error('Failed to send layout to site');
                            }
                          }}
                        >
                          Send to Site
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">No layouts yet</p>
                <p className="text-sm text-gray-500">Generate your first layout using the form on the left</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

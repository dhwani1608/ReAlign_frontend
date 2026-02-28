'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Button, Card, Badge, Loading, Alert } from '@/components/ui';
import { useAuthStore, useProjectStore } from '@/stores';
import { apiClient } from '@/utils/api';
import { toast } from 'react-toastify';

export default function DesignerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { projects, setProjects, isLoading, setLoading } = useProjectStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    max_budget: 1000000,
    max_timeline_days: 60,
    target_area: 100000,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'design_engineer') {
      router.push('/site');
      return;
    }

    fetchProjects();
  }, [user, router]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getProjects();
      setProjects(data);
    } catch (error: any) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createProject(newProjectData);
      toast.success('Project created!');
      setShowNewProject(false);
      setNewProjectData({
        name: '',
        description: '',
        max_budget: 1000000,
        max_timeline_days: 60,
        target_area: 100000,
      });
      fetchProjects();
    } catch (error: any) {
      toast.error('Failed to create project');
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Design Engineer Dashboard</h1>
          <p className="text-gray-600">Create layouts, predict costs, and approve designs</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-600">{projects.length}</div>
            <div className="text-gray-600">Total Projects</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-success-500">
              {projects.filter((p) => p.status === 'active').length}
            </div>
            <div className="text-gray-600">Active Projects</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {projects.reduce((sum, p) => sum + (p.layouts?.length || 0), 0)}
            </div>
            <div className="text-gray-600">Total Layouts</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-warning-500">3</div>
            <div className="text-gray-600">Pending Review</div>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <Button
            variant="primary"
            onClick={() => setShowNewProject(!showNewProject)}
          >
            {showNewProject ? 'Cancel' : '+ New Project'}
          </Button>
        </div>

        {showNewProject && (
          <Card className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="input-field"
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Max Budget (₹)"
                  className="input-field"
                  value={newProjectData.max_budget}
                  onChange={(e) => setNewProjectData({ ...newProjectData, max_budget: Number(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Timeline (days)"
                  className="input-field"
                  value={newProjectData.max_timeline_days}
                  onChange={(e) => setNewProjectData({ ...newProjectData, max_timeline_days: Number(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Target Area (pixels)"
                  className="input-field"
                  value={newProjectData.target_area}
                  onChange={(e) => setNewProjectData({ ...newProjectData, target_area: Number(e.target.value) })}
                />
              </div>
              <textarea
                placeholder="Project Description"
                className="input-field resize-none"
                rows={3}
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
              />
              <Button variant="primary" type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </Card>
        )}

        {isLoading ? (
          <Loading />
        ) : projects.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No projects yet</p>
            <Button variant="primary" onClick={() => setShowNewProject(true)}>
              Create Your First Project
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <Badge variant={project.status === 'active' ? 'success' : 'gray'}>
                      {project.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-gray-600">Budget</span>
                    <div className="font-semibold">₹{project.max_budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Timeline</span>
                    <div className="font-semibold">{project.max_timeline_days} days</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Target Area</span>
                    <div className="font-semibold">{project.target_area.toLocaleString()} px</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Layouts</span>
                    <div className="font-semibold">{project.layouts?.length || 0}</div>
                  </div>
                </div>

                <Link href={`/designer/projects/${project.id}`} className="btn btn-primary w-full">
                  View Project
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

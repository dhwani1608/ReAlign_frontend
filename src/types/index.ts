export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'design_engineer' | 'site_engineer' | 'admin';
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  design_engineer_id: number;
  max_budget: number;
  max_timeline_days: number;
  target_area: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Layout {
  id: number;
  project_id: number;
  design_engineer_id: number;
  area: number;
  cost: number;
  timeline_days: number;
  efficiency: number;
  material_factor: number;
  layout_id: string;
  status: string;
  approval_status: string;
  name?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: number;
  layout_id: number;
  site_engineer_id: number;
  issue_type: string;
  severity: string;
  description: string;
  affected_area: number;
  deviation_percentage: number;
  status: string;
  created_at: string;
}

export interface SensorData {
  sensor_id: string;
  sensor_type: string;
  value: number;
  unit: string;
  zone: string;
  status: string;
}

export interface CostPrediction {
  area: number;
  estimated_cost: number;
  timeline_days: number;
  efficiency: number;
  material_factor: number;
  breakdown: {
    base_construction: number;
    material_cost: number;
    labor_cost: number;
    contingency: number;
  };
}

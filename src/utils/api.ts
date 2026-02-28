import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async register(email: string, password: string, fullName: string, role: string) {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      full_name: fullName,
      role,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Designer endpoints
  async createProject(projectData: any) {
    const response = await this.client.post('/designer/projects', projectData);
    return response.data;
  }

  async getProjects() {
    const response = await this.client.get('/designer/projects');
    return response.data;
  }

  async getProject(projectId: number) {
    const response = await this.client.get(`/designer/projects/${projectId}`);
    return response.data;
  }

  async generateLayout(layoutData: any, projectId: number) {
    const response = await this.client.post(
      `/designer/layouts/generate?project_id=${projectId}`,
      layoutData
    );
    return response.data;
  }

  async getLayout(layoutId: number) {
    const response = await this.client.get(`/designer/layouts/${layoutId}`);
    return response.data;
  }

  async approveLayout(layoutId: number, approved: boolean, comments?: string) {
    const response = await this.client.post(
      `/designer/layouts/${layoutId}/approve`,
      { layout_id: layoutId, approved, comments }
    );
    return response.data;
  }

  async sendToSite(layoutId: number) {
    const response = await this.client.post(
      `/designer/layouts/${layoutId}/send-to-site`
    );
    return response.data;
  }

  async predictCost(area: number, efficiency?: number, materialFactor?: number) {
    const response = await this.client.post('/designer/predict-cost', {
      area,
      efficiency: efficiency || 1.0,
      material_factor: materialFactor || 1.0,
    });
    return response.data;
  }

  // Site engineer endpoints
  async viewLayout(layoutId: number) {
    const response = await this.client.get(`/site/layouts/${layoutId}`);
    return response.data;
  }

  async reportIssue(issueData: any) {
    const response = await this.client.post('/site/issues/report', issueData);
    return response.data;
  }

  async getIssues(layoutId?: number) {
    const params = layoutId ? `?layout_id=${layoutId}` : '';
    const response = await this.client.get(`/site/issues${params}`);
    return response.data;
  }

  async triggerRecalibration(layoutId: number, recalibrationData: any) {
    const response = await this.client.post(
      `/site/layouts/${layoutId}/trigger-recalibration`,
      recalibrationData
    );
    return response.data;
  }

  async getSensorData(layoutId: number) {
    const response = await this.client.get(`/site/sensor-data/${layoutId}`);
    return response.data;
  }

  async getSiteDashboard() {
    const response = await this.client.get('/site/dashboard');
    return response.data;
  }
}

export const apiClient = new APIClient();

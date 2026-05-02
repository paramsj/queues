export const API_URL = 'http://localhost:3000/api/v1'; // Assuming backend runs on 3000

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json().catch(() => ({ message: 'Server error: unexpected response format' }));
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    },
    register: async (userData) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json().catch(() => ({ message: 'Server error: unexpected response format' }));
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    }
  },
  jobs: {
    getMyJobs: async () => {
      const res = await fetch(`${API_URL}/jobs/`, { headers: getHeaders() });
      const data = await res.json().catch(() => ({ message: 'Server error: unexpected response format' }));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
      return data;
    },
    createJob: async (jobData) => {
      const res = await fetch(`${API_URL}/jobs/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobData)
      });
      const data = await res.json().catch(() => ({ message: 'Server error: unexpected response format' }));
      if (!res.ok) throw new Error(data.message || 'Failed to create job');
      return data;
    },
    getJobById: async (id) => {
      const res = await fetch(`${API_URL}/jobs/${id}`, { headers: getHeaders() });
      const data = await res.json().catch(() => ({ message: 'Server error: unexpected response format' }));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch job details');
      return data;
    }
  },
  admin: {
    getAllJobs: async () => {
      const res = await fetch(`${API_URL}/admin/jobs`, { headers: getHeaders() });
      const data = await res.json().catch(() => ({ message: 'Server error: unexpected response format' }));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch all jobs');
      return data;
    },
    getJobById: async (id) => {
      const res = await fetch(`${API_URL}/admin/jobs/${id}`, { headers: getHeaders() });
      const data = await res.json().catch(() => ({ message: 'Server error: unexpected response format' }));
      if (!res.ok) throw new Error(data.message || 'Failed to fetch job details');
      return data;
    }
  }
};

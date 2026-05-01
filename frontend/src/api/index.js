const API_URL = 'http://localhost:3000/api/v1'; // Assuming backend runs on 8000

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
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      return res.json();
    },
    register: async (userData) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      return res.json();
    }
  },
  jobs: {
    getMyJobs: async () => {
      const res = await fetch(`${API_URL}/jobs/`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      return res.json();
    },
    createJob: async (jobData) => {
      const res = await fetch(`${API_URL}/jobs/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobData)
      });
      if (!res.ok) throw new Error('Failed to create job');
      return res.json();
    },
    getJobById: async (id) => {
      const res = await fetch(`${API_URL}/jobs/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch job details');
      return res.json();
    }
  },
  admin: {
    getAllJobs: async () => {
      const res = await fetch(`${API_URL}/admin/jobs`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch all jobs');
      return res.json();
    },
    getJobById: async (id) => {
      const res = await fetch(`${API_URL}/admin/jobs/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch job details');
      return res.json();
    }
  }
};

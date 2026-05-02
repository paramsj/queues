import { useState, useEffect } from 'react';
import { api, API_URL } from '../api';
import { Shield, RefreshCw, Eye, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../pages/Dashboard.css';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getAllJobs();
      setJobs(res.data || res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();

    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${API_URL}/admin/jobs/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.data && Array.isArray(data.data)) {
          setJobs(data.data);
        }
      } catch (err) {}
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle2 size={18} />;
      case 'FAILED': return <XCircle size={18} />;
      case 'PROCESSING': return <RefreshCw size={18} className="animate-spin" />;
      case 'PENDING':
      case 'QUEUED': return <Clock size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    return (
      <span className={`badge badge-${statusLower}`}>
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield className="text-warning" /> System Jobs Monitor
          </h1>
          <p className="text-muted">Administrator view of all system background tasks</p>
        </div>
      </div>

      {error && <div className="error-message glass-panel">{error}</div>}

      <div className="jobs-container glass-panel">
        <div className="jobs-list-header">
          <h2>All System Jobs</h2>
          <button onClick={fetchAllJobs} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="loading-state">
            <RefreshCw size={32} className="animate-spin text-muted" />
            <p>Loading system jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <p className="text-muted">No jobs exist in the system yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job ID / User ID</th>
                  <th>Job Type</th>
                  <th>Status</th>
                  <th>Attempts</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.id.substring(0,8)}...</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>User: {job.user_id.substring(0,8)}...</div>
                    </td>
                    <td className="font-medium">{job.job_type}</td>
                    <td>{getStatusBadge(job.status)}</td>
                    <td>{job.attempts} / {job.max_attempts}</td>
                    <td className="text-muted">{new Date(job.created_at).toLocaleString()}</td>
                    <td>
                      <Link to={`/admin/jobs/${job.id}`} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

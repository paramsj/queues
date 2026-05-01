import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.jobs.getMyJobs();
      setJobs(res.data || res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
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
          <h1 className="page-title">My Jobs</h1>
          <p className="text-muted">Manage and monitor your background tasks</p>
        </div>
        <Link to="/jobs/create" className="btn btn-primary">
          <Plus size={18} /> Create New Job
        </Link>
      </div>

      {error && <div className="error-message glass-panel">{error}</div>}

      <div className="stats-grid grid-cols-3 mb-8">
        <div className="stat-card glass-panel">
          <div className="stat-icon info-bg"><BarChart2 size={24} /></div>
          <div className="stat-details">
            <h3>Total Jobs</h3>
            <p>{jobs.length}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon success-bg"><CheckCircle2 size={24} /></div>
          <div className="stat-details">
            <h3>Completed</h3>
            <p>{jobs.filter(j => j.status === 'COMPLETED').length}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon danger-bg"><XCircle size={24} /></div>
          <div className="stat-details">
            <h3>Failed</h3>
            <p>{jobs.filter(j => j.status === 'FAILED').length}</p>
          </div>
        </div>
      </div>

      <div className="jobs-container glass-panel">
        <div className="jobs-list-header">
          <h2>Recent Jobs</h2>
          <button onClick={fetchJobs} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="loading-state">
            <RefreshCw size={32} className="animate-spin text-muted" />
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <Plus size={32} className="text-muted" />
            </div>
            <h3>No jobs found</h3>
            <p className="text-muted">You haven't created any jobs yet.</p>
            <Link to="/jobs/create" className="btn btn-primary mt-4">Create your first job</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Type</th>
                  <th>Status</th>
                  <th>Queue</th>
                  <th>Created</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="font-medium">{job.job_type}</td>
                    <td>{getStatusBadge(job.status)}</td>
                    <td><span className="queue-tag">{job.queue_name}</span></td>
                    <td className="text-muted">{new Date(job.created_at).toLocaleString()}</td>
                    <td>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${job.progress || 0}%` }}></div>
                        <span className="progress-text">{job.progress || 0}%</span>
                      </div>
                    </td>
                    <td>
                      <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                        View Result
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

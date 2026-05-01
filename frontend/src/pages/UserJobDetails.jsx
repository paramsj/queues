import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import './JobDetails.css'; // Reuse styles

export default function UserJobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await api.jobs.getJobById(id);
      setJob(res.data || res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    
    // Simple polling for real-time updates while job is processing
    let intervalId;
    if (job && !['COMPLETED', 'FAILED', 'CANCELLED'].includes(job.status)) {
      intervalId = setInterval(fetchJobDetails, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, job?.status]); // Re-evaluate polling if status changes

  if (loading && !job) {
    return <div className="loading-state glass-panel"><RefreshCw size={32} className="animate-spin text-muted" /><p>Loading job details...</p></div>;
  }

  if (error && !job) {
    return <div className="error-message glass-panel">{error || 'Job not found'}</div>;
  }

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    return <span className={`badge badge-${statusLower}`}>{status}</span>;
  };

  return (
    <div className="job-details-container">
      <div className="mb-4">
        <Link to="/dashboard" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel">
        <div className="job-details-header">
          <div className="header-info">
            <h2>Job Results</h2>
            <div className="job-id-badge">ID: {job.id}</div>
          </div>
          <button onClick={fetchJobDetails} className="btn btn-secondary">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="grid-cols-2 details-grid mt-8">
          <div className="detail-group">
            <label>Status</label>
            <div>{getStatusBadge(job.status)}</div>
          </div>
          <div className="detail-group">
            <label>Job Type</label>
            <div className="font-medium">{job.job_type}</div>
          </div>
          <div className="detail-group">
            <label>Progress</label>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar" style={{ width: `${job.progress || 0}%` }}></div>
              <span className="progress-text">{job.progress || 0}%</span>
            </div>
          </div>
          <div className="detail-group">
            <label>Queue Time</label>
            <div>{new Date(job.created_at).toLocaleString()}</div>
          </div>
        </div>

        {job.result && (
          <div className="mt-8">
            <label className="section-label">Result Payload</label>
            <pre className="json-block result-block">{JSON.stringify(job.result, null, 2)}</pre>
          </div>
        )}

        {job.error_message && (
          <div className="mt-8">
            <label className="section-label text-danger">Error Information</label>
            <div className="error-block">
              <strong>{job.error_message}</strong>
              {job.error_stack && <pre className="mt-2 text-xs">{job.error_stack}</pre>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

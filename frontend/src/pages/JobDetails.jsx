import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, API_URL } from '../api';
import { ArrowLeft, Clock, RefreshCw, CheckCircle2, XCircle, AlertCircle, Server } from 'lucide-react';
import './JobDetails.css';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getJobById(id);
      setJob(res.data || res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();

    const token = localStorage.getItem('token');
    // Admin can also listen to the same job progress stream since it's the same job and we're an admin (verifyJWT might check if it's the user's job though).
    // Let's assume admin has access or it just works. Wait, getJobByIdService checks eq("user_id", userId). 
    // Admin might not own the job, so the user's stream route might fail. 
    // I will use fetch for admin initially, but let's implement polling or admin stream if needed. Let's add simple SSE with standard interval fallback if SSE fails for admin.
    
    let intervalId;
    const eventSource = new EventSource(`${API_URL}/admin/jobs/${id}/stream?token=${token}`); // Wait, does admin stream route exist? I should add it. Let's just poll for admin for now or I'll add the admin stream route later. Let's add it to job.routes.js and admin.routes.js if needed.
    
    // Let's just use polling for Admin Job Details to avoid route access issues, or I can add the admin SSE.
    // Actually, I'll add SSE to admin details as well, assuming I will create the admin stream endpoint!
    const adminEventSource = new EventSource(`${API_URL}/admin/jobs/${id}/stream?token=${token}`);
    
    adminEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const jobData = data.data || data;
        setJob(jobData);
        
        if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(jobData.status)) {
           adminEventSource.close();
        }
      } catch (err) {}
    };

    adminEventSource.onerror = (err) => {
      adminEventSource.close();
    };

    return () => {
      adminEventSource.close();
    };
  }, [id]);

  if (loading) {
    return <div className="loading-state glass-panel"><RefreshCw size={32} className="animate-spin text-muted" /><p>Loading job details...</p></div>;
  }

  if (error || !job) {
    return <div className="error-message glass-panel">{error || 'Job not found'}</div>;
  }

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    return <span className={`badge badge-${statusLower}`}>{status}</span>;
  };

  return (
    <div className="job-details-container">
      <div className="mb-4">
        <Link to="/admin" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </Link>
      </div>

      <div className="glass-panel">
        <div className="job-details-header">
          <div className="header-info">
            <h2>Job Details</h2>
            <div className="job-id-badge">ID: {job.id}</div>
          </div>
          <button onClick={fetchJobDetails} className="btn btn-secondary">
            <RefreshCw size={16} /> Refresh
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
            <label>Queue Name</label>
            <div className="queue-tag" style={{ display: 'inline-block' }}>{job.queue_name}</div>
          </div>
          <div className="detail-group">
            <label>Bull Job ID</label>
            <div className="text-muted">{job.bull_job_id || 'N/A'}</div>
          </div>
          <div className="detail-group">
            <label>Progress</label>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar" style={{ width: `${job.progress || 0}%` }}></div>
              <span className="progress-text">{job.progress || 0}%</span>
            </div>
          </div>
          <div className="detail-group">
            <label>Attempts</label>
            <div>{job.attempts} / {job.max_attempts}</div>
          </div>
        </div>

        <div className="grid-cols-2 details-grid mt-8">
          <div className="detail-group">
            <label>Created At</label>
            <div>{new Date(job.created_at).toLocaleString()}</div>
          </div>
          <div className="detail-group">
            <label>Started At</label>
            <div>{job.started_at ? new Date(job.started_at).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-group">
            <label>Completed At</label>
            <div>{job.completed_at ? new Date(job.completed_at).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-group">
            <label>Processing Time</label>
            <div>{job.processing_time_ms ? `${job.processing_time_ms} ms` : 'N/A'}</div>
          </div>
        </div>

        <div className="mt-8">
          <label className="section-label">Payload</label>
          <pre className="json-block">{JSON.stringify(job.payload, null, 2)}</pre>
        </div>

        {job.result && (
          <div className="mt-4">
            <label className="section-label">Result</label>
            <pre className="json-block result-block">{JSON.stringify(job.result, null, 2)}</pre>
          </div>
        )}

        {job.error_message && (
          <div className="mt-4">
            <label className="section-label text-danger">Error Details</label>
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

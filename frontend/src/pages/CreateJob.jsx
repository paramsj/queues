import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { Briefcase, ArrowLeft, Send } from 'lucide-react';
import './CreateJob.css';

export default function CreateJob() {
  const [jobType, setJobType] = useState('EMAIL_SENDER');
  const [queueName, setQueueName] = useState('default');
  const [payloadStr, setPayloadStr] = useState('{\n  "to": "user@example.com",\n  "subject": "Hello",\n  "body": "World"\n}');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    let payload;
    try {
      payload = JSON.parse(payloadStr);
    } catch (err) {
      setError('Invalid JSON payload');
      setLoading(false);
      return;
    }

    try {
      await api.jobs.createJob({ job_type: jobType, queue_name: queueName, payload });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-container">
      <div className="mb-4">
        <Link to="/dashboard" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel max-w-2xl mx-auto">
        <div className="form-header">
          <div className="form-icon-wrapper">
            <Briefcase size={28} className="text-primary" />
          </div>
          <div>
            <h2>Create New Job</h2>
            <p className="text-muted">Dispatch a new task to the background queue</p>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid-cols-2">
            <div className="input-group">
              <label>Job Type</label>
              <input 
                type="text" 
                value={jobType} 
                onChange={(e) => setJobType(e.target.value)}
                placeholder="e.g., PROCESS_VIDEO"
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Queue Name</label>
              <input 
                type="text" 
                value={queueName} 
                onChange={(e) => setQueueName(e.target.value)}
                placeholder="default"
                required 
              />
            </div>
          </div>

          <div className="input-group mt-4">
            <label>JSON Payload</label>
            <textarea 
              value={payloadStr}
              onChange={(e) => setPayloadStr(e.target.value)}
              rows="8"
              className="code-font"
              required
            ></textarea>
            <p className="helper-text">Data passed to your background worker</p>
          </div>

          <div className="form-actions mt-8">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="animate-spin">⌛</span> : <><Send size={16} /> Dispatch Job</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

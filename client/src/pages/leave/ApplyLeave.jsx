import React, { useState } from 'react';
import { requestLeave } from '../../api/leaveApi';
import { Calendar, FileText, Send, AlertCircle, CheckCircle } from 'lucide-react';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    type: 'Casual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const leaveTypes = ['Sick', 'Casual', 'Maternity', 'Paternity', 'Unpaid'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic date validation
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date cannot be after end date.');
      setLoading(false);
      return;
    }

    try {
      await requestLeave(formData);
      setSuccess('Leave request submitted successfully!');
      setFormData({
        type: 'Casual',
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }} className="animate-slide">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }} className="text-gradient">Apply for Leave</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Submit a new leave request for approval</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {success && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '16px', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid var(--success)', 
            borderRadius: 'var(--radius-md)', 
            color: 'var(--success)',
            marginBottom: '24px'
          }}>
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '16px', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error)', 
            borderRadius: 'var(--radius-md)', 
            color: 'var(--error)',
            marginBottom: '24px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="form-label">Leave Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
              style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}
              required
            >
              {leaveTypes.map((type) => (
                <option key={type} value={type} style={{ background: 'var(--bg-secondary)' }}>
                  {type} Leave
                </option>
              ))}
            </select>
          </div>

          <div className="grid-responsive-2">
            <div>
              <label className="form-label">Start Date</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">End Date</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Reason / Comments</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="form-input"
              rows="4"
              placeholder="Provide context or reason for your leave request..."
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ minWidth: '150px' }}
            >
              <Send size={18} />
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;

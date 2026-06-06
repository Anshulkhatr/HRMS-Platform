import React, { useState, useEffect } from 'react';
import { getAllLeaves, approveLeave, rejectLeave } from '../../api/leaveApi';
import { ShieldAlert, Check, X, User, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const LeaveApproval = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [actionLoading, setActionLoading] = useState(null); // stores leave id being acted upon
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('Pending');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      // Pass the filter to the API
      const statusParam = filter === 'All' ? undefined : filter;
      const data = await getAllLeaves(statusParam);
      setLeaves(data);
    } catch (err) {
      setError('Failed to fetch leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    setError(null);
    setSuccess(null);
    try {
      if (action === 'approve') {
        await approveLeave(id);
        setSuccess('Leave request approved successfully!');
      } else {
        await rejectLeave(id);
        setSuccess('Leave request rejected.');
      }
      // Reload leaves list
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} leave request.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ padding: '24px' }} className="animate-slide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }} className="text-gradient">Leave Approvals</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review and manage employee leave requests</p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                background: filter === status ? 'var(--primary)' : 'transparent',
                color: filter === status ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-smooth)'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div className="animate-float" style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading leave requests...</div>
        </div>
      ) : leaves.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>No leave requests found for status "{filter}".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {leaves.map((leave) => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const duration = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
            const employeeName = leave.employeeId 
              ? `${leave.employeeId.firstName} ${leave.employeeId.lastName}` 
              : 'Unknown Employee';

            return (
              <div key={leave._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600 }}>{employeeName}</span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: leave.type === 'Sick' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    color: leave.type === 'Sick' ? 'var(--error)' : 'var(--primary)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {leave.type}
                  </span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} />
                    <span>{start.toLocaleDateString()} - {end.toLocaleDateString()}</span>
                  </div>
                  <div>Duration: <strong>{duration} {duration === 1 ? 'day' : 'days'}</strong></div>
                </div>

                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '12px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}>
                  <FileText size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ wordBreak: 'break-word' }}>{leave.reason || 'No reason specified'}</span>
                </div>

                {leave.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '12px' }}>
                    <button
                      onClick={() => handleAction(leave._id, 'reject')}
                      disabled={actionLoading === leave._id}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '10px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      <X size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(leave._id, 'approve')}
                      disabled={actionLoading === leave._id}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px' }}
                    >
                      <Check size={16} />
                      {actionLoading === leave._id ? 'Working...' : 'Approve'}
                    </button>
                  </div>
                )}

                {leave.status !== 'Pending' && (
                  <div style={{ 
                    marginTop: 'auto', 
                    paddingTop: '12px', 
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: leave.status === 'Approved' ? 'var(--success)' : 'var(--error)'
                  }}>
                    {leave.status}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;

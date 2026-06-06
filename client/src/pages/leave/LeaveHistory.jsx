import React, { useState, useEffect } from 'react';
import { getMyLeaves } from '../../api/leaveApi';
import { ShieldAlert, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const LeaveHistory = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await getMyLeaves();
      setLeaves(data);
    } catch (err) {
      setError('Failed to load leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filteredLeaves = filter === 'All' 
    ? leaves 
    : leaves.filter(leave => leave.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
      case 'Rejected':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' };
      default:
        return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 size={16} />;
      case 'Rejected':
        return <AlertTriangle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div style={{ padding: '24px' }} className="animate-slide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }} className="text-gradient">Leave History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View details of all your submitted leave requests</p>
        </div>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div className="animate-float" style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading leave history...</div>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--error)' }}>
          <ShieldAlert size={48} style={{ marginBottom: '12px' }} />
          <p>{error}</p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>No leave requests found matching your filter selection.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <th style={{ padding: '16px' }}>Leave Type</th>
                <th style={{ padding: '16px' }}>Start Date</th>
                <th style={{ padding: '16px' }}>End Date</th>
                <th style={{ padding: '16px' }}>Duration</th>
                <th style={{ padding: '16px' }}>Reason</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                const duration = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
                const statusStyle = getStatusStyle(leave.status);

                return (
                  <tr key={leave._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-smooth)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{leave.type} Leave</td>
                    <td style={{ padding: '16px' }}>{start.toLocaleDateString()}</td>
                    <td style={{ padding: '16px' }}>{end.toLocaleDateString()}</td>
                    <td style={{ padding: '16px' }}>{duration} {duration === 1 ? 'day' : 'days'}</td>
                    <td style={{ padding: '16px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {leave.reason || 'N/A'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: statusStyle.border
                      }}>
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;

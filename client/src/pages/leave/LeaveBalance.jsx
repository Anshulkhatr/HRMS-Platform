import React, { useState, useEffect } from 'react';
import { getMyLeaves } from '../../api/leaveApi';
import { ShieldAlert, Award, Calendar, RefreshCw, BarChart2 } from 'lucide-react';

const LeaveBalance = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);

  // Quotas definition
  const quotas = {
    Sick: 10,
    Casual: 15,
    Maternity: 90,
    Paternity: 15,
    Unpaid: 999 // Representing unlimited, we'll display differently
  };

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const data = await getMyLeaves();
      setLeaves(data);
    } catch (err) {
      setError('Failed to fetch leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  // Calculate used leave days by type
  const calculateUsedLeaves = () => {
    const used = {
      Sick: 0,
      Casual: 0,
      Maternity: 0,
      Paternity: 0,
      Unpaid: 0
    };

    leaves.forEach(leave => {
      if (leave.status === 'Approved') {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const timeDiff = Math.abs(end - start);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // inclusive
        
        if (used[leave.type] !== undefined) {
          used[leave.type] += daysDiff;
        }
      }
    });

    return used;
  };

  const usedLeaves = calculateUsedLeaves();

  return (
    <div style={{ padding: '24px' }} className="animate-slide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }} className="text-gradient">Leave Balance</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your available and used leaves for this year</p>
        </div>
        <button 
          onClick={fetchBalances} 
          className="btn btn-secondary" 
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div className="animate-float" style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading balances...</div>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--error)' }}>
          <ShieldAlert size={48} style={{ marginBottom: '12px' }} />
          <p>{error}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {Object.keys(quotas).map((type) => {
            const limit = quotas[type];
            const used = usedLeaves[type] || 0;
            const remaining = limit === 999 ? 'N/A' : Math.max(0, limit - used);
            const percentage = limit === 999 ? 0 : Math.min(100, (used / limit) * 100);

            return (
              <div key={type} className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{type} Leave</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Annual Allowance: {limit === 999 ? 'Unlimited' : limit} days</p>
                  </div>
                  <Award size={24} style={{ color: 'var(--secondary)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {remaining}
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                      days left
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                      {used} Used
                    </span>
                  </div>
                </div>

                {limit !== 999 && (
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.8s ease-out'
                    }} />
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

export default LeaveBalance;

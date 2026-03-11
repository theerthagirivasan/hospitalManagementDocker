import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/appointments-per-doctor');
      setReports(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <div className="page-wrapper container"><h2>Loading...</h2></div>;

  return (
    <div className="page-wrapper container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
            <h1>Admin Panel</h1>
            <p style={{ color: 'var(--text-muted)' }}>Hospital Management Analytics & Reports</p>
        </div>
      </div>

      {error && <div style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

      <div className="glass" style={{ padding: '2rem' }}>
        <h3>Appointments Per Doctor (Aggregation)</h3>
        <hr style={{ borderColor: 'var(--surface-border)', margin: '1rem 0 2rem 0' }} />
        
        {reports.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '3rem 0' }}>
            No data available for reports.
          </p>
        ) : (
          <div className="grid-cards">
            {reports.map((report, idx) => (
              <div key={idx} className="glass" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dr. {report.doctorName}
                </h4>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>
                  {report.appointmentCount}
                </div>
                <div style={{ color: 'var(--text)', fontSize: '0.9rem' }}>
                  Total Appointments
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

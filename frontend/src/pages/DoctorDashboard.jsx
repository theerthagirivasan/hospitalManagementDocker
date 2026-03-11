import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  
  const { user } = useContext(AuthContext);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments/doctor');
      
      // Sort to show closest appointments first
      const sorted = res.data.sort((a, b) => {
          const dateA = new Date(a.appointmentDate + 'T' + a.startTime);
          const dateB = new Date(b.appointmentDate + 'T' + b.startTime);
          return dateA - dateB;
      });
      setAppointments(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async (id) => {
    setActionError('');
    try {
      await api.put(`/appointments/${id}/confirm`);
      fetchAppointments();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error confirming appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return <span className="badge badge-green">Confirmed</span>;
      case 'CANCELLED': return <span className="badge badge-red">Cancelled</span>;
      case 'COMPLETED': return <span className="badge badge-purple">Completed</span>;
      default: return <span className="badge badge-blue">Pending</span>; // BOOKED
    }
  };

  if (loading) return <div className="page-wrapper container"><h2>Loading...</h2></div>;

  return (
    <div className="page-wrapper container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
            <h1>Doctor Schedule</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your daily appointments and availability.</p>
        </div>
      </div>

      {actionError && <div style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{actionError}</div>}

      <div className="glass" style={{ padding: '2rem' }}>
        <h3>Upcoming Appointments</h3>
        <hr style={{ borderColor: 'var(--surface-border)', margin: '1rem 0 2rem 0' }} />
        
        {appointments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '3rem 0' }}>
            No appointments scheduled.
          </p>
        ) : (
          <div className="grid-cards">
            {appointments.map(appt => (
              <div key={appt.id} className="glass" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Patient #{appt.patientId.substring(0, 8)}</span>
                  {getStatusBadge(appt.status)}
                </div>
                
                <div style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📅 <span style={{ color: 'var(--text-muted)' }}>{new Date(appt.appointmentDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🕒 <span style={{ color: 'var(--text-muted)' }}>{appt.startTime} - {appt.endTime}</span>
                  </div>
                </div>
                
                {appt.status === 'BOOKED' && (
                  <button onClick={() => handleConfirm(appt.id)} className="btn btn-success" style={{ width: '100%' }}>
                    Confirm Appointment
                  </button>
                )}
                
                 {appt.status === 'CONFIRMED' && (
                  <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                    Scheduled
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

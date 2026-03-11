import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsRes, apptsRes] = await Promise.all([
        api.get('/users/doctors'),
        api.get('/appointments/patient')
      ]);
      setDoctors(doctorsRes.data);
      setAppointments(apptsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookError('');
    setBookSuccess('');
    
    // Simple validation
    if(startTime >= endTime) {
        setBookError("End time must be after start time");
        return;
    }

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor,
        appointmentDate: date,
        startTime: startTime,
        endTime: endTime
      });
      setBookSuccess('Appointment booked successfully!');
      
      // Reset form
      setSelectedDoctor('');
      setDate('');
      setStartTime('');
      setEndTime('');
      
      // Refresh list
      fetchData();
    } catch (err) {
      setBookError(err.response?.data?.message || 'Error booking appointment');
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

  const { user } = useContext(AuthContext);

  if (loading) return <div className="page-wrapper container"><h2>Loading...</h2></div>;

  return (
    <div className="page-wrapper container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Patient Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Welcome back, <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{user?.name || 'Patient'}</span>
          </p>
        </div>
        <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>System Online</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Booking Form */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3>Book New Appointment</h3>
          <hr style={{ borderColor: 'var(--surface-border)', margin: '1rem 0' }} />
          
          {bookError && <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>{bookError}</div>}
          {bookSuccess && <div style={{ color: '#34d399', marginBottom: '1rem', fontSize: '0.9rem' }}>{bookSuccess}</div>}
          
          <form onSubmit={handleBookAppointment}>
            <div className="form-group">
              <label className="form-label">Select Doctor</label>
              <select 
                className="form-input" 
                value={selectedDoctor} 
                onChange={(e) => setSelectedDoctor(e.target.value)} 
                required
              >
                <option value="">-- Choose a Specialist --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.specialization})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input type="time" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input type="time" className="form-input" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Confirm Booking
            </button>
          </form>
        </div>

        {/* My Appointments List */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3>My Appointments</h3>
          <hr style={{ borderColor: 'var(--surface-border)', margin: '1rem 0' }} />
          
          {appointments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
              You don't have any appointments yet.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => {
                    const doctor = doctors.find(d => d.id === appt.doctorId);
                    const docName = doctor ? `Dr. ${doctor.name}` : 'Unknown';
                    
                    return (
                      <tr key={appt.id}>
                        <td style={{ fontWeight: 500 }}>{docName}</td>
                        <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                        <td>{appt.startTime} - {appt.endTime}</td>
                        <td>{getStatusBadge(appt.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

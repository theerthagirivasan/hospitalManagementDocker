import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    specialization: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join CareBridge today</p>
        </div>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input id="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="form-input" value={formData.password} onChange={handleChange} required placeholder="••••••••" minLength="6" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">I am a...</label>
            <select id="role" className="form-input" value={formData.role} onChange={handleChange}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          {formData.role === 'DOCTOR' && (
            <div className="form-group animate-fade-in">
              <label className="form-label" htmlFor="specialization">Medical Specialization</label>
              <input id="specialization" type="text" className="form-input" value={formData.specialization} onChange={handleChange} required placeholder="e.g. Cardiologist" />
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

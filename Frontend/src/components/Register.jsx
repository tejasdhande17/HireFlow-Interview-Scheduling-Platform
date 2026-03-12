import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg(''); setLoading(true);
    try {
      await authAPI.register(formData);
      setMsg('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data) {
        if (typeof err.response.data === 'string') setError(err.response.data);
        else if (err.response.data.message) setError(err.response.data.message);
        else setError(JSON.stringify(err.response.data));
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container p-0">
      <div className="auth-card">
        {/* Left Side: Illustration / Image */}
        <div className="auth-left"></div>
        
        {/* Right Side: Registration Form */}
        <div className="auth-right">
          <h3 className="auth-title">Register</h3>

          {error && <div className="alert alert-danger p-2 text-center small rounded">{error}</div>}
          {msg && <div className="alert alert-success p-2 text-center small rounded">{msg}</div>}
          
          <form onSubmit={handleSubmit} className="px-md-4">
            <div className="auth-input-group">
              <i className="bi bi-person"></i>
              <input type="text" required className="auth-control" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="auth-input-group">
              <i className="bi bi-envelope"></i>
              <input type="email" required className="auth-control" placeholder="Email " value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="auth-input-group">
              <i className="bi bi-lock"></i>
              <input type="password" required className="auth-control" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="auth-input-group mb-4">
              <i className="bi bi-briefcase"></i>
              <select className="auth-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{paddingLeft: '35px'}}>
                <option value="STUDENT">Student / Candidate</option>
                <option value="HR">HR / Recruiter</option>
              </select>
            </div>
            
            <div className="d-flex align-items-start mb-4 small text-muted">
              <input type="checkbox" id="terms" className="me-2 mt-1" style={{accentColor: '#5cb85c', width: '16px', height: '16px'}} required />
              <label htmlFor="terms" style={{ lineHeight: '1.4' }}>I agree to the Terms, Privacy Policy and Guidelines.</label>
            </div>
            
            <button className="btn-auth-submit w-100 mt-2 mb-4" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <div className="text-center text-muted small pb-2">
              Registration implies agreement to <Link to="/login" className="text-dark fw-bold text-decoration-none">Sign in</Link> policy
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

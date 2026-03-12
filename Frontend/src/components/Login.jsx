import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await authAPI.login({ email, password });
      onLogin(resp.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container p-0">
      <div className="auth-card">
        
        {/* Left Side: Image */}
        <div className="auth-left"></div>

        {/* Right Side: Login Form */}
        <div className="auth-right">
          <h3 className="auth-title mb-5">Welcome Back</h3>

          {error && <div className="alert alert-danger p-2 text-center small string-bold rounded">{error}</div>}
          
          <form onSubmit={handleSubmit} className="px-md-4">
            <div className="auth-input-group">
              <i className="bi bi-envelope"></i>
              <input type="email" required className="auth-control" placeholder="Email " value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="auth-input-group position-relative mb-2">
              <i className="bi bi-lock"></i>
              <input type="password" required className="auth-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-5 small">
              <div className="d-flex align-items-center">
                <input type="checkbox" id="remember" className="me-2" style={{accentColor: '#5cb85c'}} />
                <label htmlFor="remember" className="text-muted">Remember me</label>
              </div>
              <a href="#" className="text-muted text-decoration-none">Forgot password?</a>
            </div>

            <button className="btn-auth-submit w-100 mt-2 mb-4" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            <div className="text-center text-muted small pb-2">
              Don't have an account? <Link to="/register" className="text-dark fw-bold text-decoration-none">Register here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

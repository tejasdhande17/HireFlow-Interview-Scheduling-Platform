import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="main-landing d-flex" style={{ backgroundColor: '#ffffff' }}>
      {/* Background graphic to give it an advanced feel */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '40vw', height: '100vh', background: 'linear-gradient(to bottom left, rgba(121, 176, 98, 0.1), transparent)', zIndex: 0 }} />

      <div className="container" style={{ zIndex: 1 }}>
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 text-start pe-lg-5">
            <span className="badge rounded-pill mb-3 pb-2 text-success fw-bold" style={{ backgroundColor: '#eaf4e7', padding: '8px 16px', letterSpacing: '1px' }}>🚀 THE FUTURE OF RECRUITMENT</span>
            <h1 className="display-4 fw-bolder mb-4" style={{ color: '#1f2937', letterSpacing: '-1px' }}>
              Hire Flow <br /> <span style={{ color: '#4d8360' }}>Interview Scheduling Platform</span>
            </h1>
            <p className="text-muted fs-5 mb-5 pe-lg-5" style={{ lineHeight: '1.6' }}>
             A modern platform that connects students and HR professionals to manage interviews, track applications, and simplify the hiring process.
            </p>

            <div className="d-flex gap-3">
              <button
                className="btn-auth-submit"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => navigate('/login')}
              >
                <i className="bi bi-person-fill"></i> Sign in to Account
              </button>
              <button
                className="btn btn-outline-dark fw-bold"
                style={{ borderRadius: '30px', padding: '14px 28px', border: '2px solid #e5e7eb', color: '#4b5563' }}
                onClick={() => navigate('/register')}
              >
                Create account
              </button>
            </div>

            <div className="mt-5 d-flex gap-4 opacity-75">
              <div>
                <h3 className="fw-bolder mb-0 text-dark">500+</h3>
                <span className="small text-muted fw-semibold">Companies trust us</span>
              </div>
              <div style={{ width: '2px', backgroundColor: '#e5e7eb' }}></div>
              <div>
                <h3 className="fw-bolder mb-0 text-dark">99%</h3>
                <span className="small text-muted fw-semibold">Match rate</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block position-relative">
            {/* Advanced UI floating dashboard graphic */}
            <div className="glass-panel p-2 shadow-lg" style={{ borderRadius: '24px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)' }}>
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" className="img-fluid rounded-4" alt="Dashboard preview" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </div>

            {/* Floating elements */}
            <div className="position-absolute glass-panel p-3 d-flex align-items-center gap-3 shadow" style={{ bottom: '10%', left: '-10%', borderRadius: '16px', background: 'white' }}>
              <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="bi bi-check-lg"></i></div>
              <div>
                <p className="mb-0 fw-bold small">Interview Scheduled</p>
                <span className="text-muted" style={{ fontSize: '11px' }}>Software Engineer Role</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

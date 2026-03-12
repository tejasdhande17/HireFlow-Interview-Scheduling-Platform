import React, { useState, useEffect } from 'react';
import api from '../api';

function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'interviews') fetchInterviews();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'jobs') {
      const delayDebounce = setTimeout(() => {
        fetchJobs();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs', { params: { search: searchTerm } });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/interviews/student');
      setInterviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post('/applications', { jobId });
      setMsg({ type: 'success', text: 'Succesfully applied for the job!' });
      window.scrollTo(0,0);
      fetchJobs();
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to apply' });
      window.scrollTo(0,0);
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    }
  };

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student' };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="info">
            <h5>{user.name}</h5>
            <span>CANDIDATE</span>
          </div>
        </div>

        <ul className="sidebar-nav flex-grow-1">
          <li>
            <button 
              className={`sidebar-link ${activeTab === 'jobs' ? 'active' : ''}`} 
              onClick={() => setActiveTab('jobs')}>
              <i className="bi bi-briefcase me-3"></i>Available Jobs
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${activeTab === 'interviews' ? 'active' : ''}`} 
              onClick={() => setActiveTab('interviews')}>
              <i className="bi bi-list-task me-3"></i>My Interviews
            </button>
          </li>
        </ul>

        <button className="sidebar-logout" onClick={onLogout}>
          <i className="bi bi-box-arrow-right me-3"></i>Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {msg.text && (
          <div className={`alert alert-${msg.type} d-flex align-items-center bg-white border border-${msg.type} text-${msg.type} rounded shadow-sm mb-4`}>
            {msg.text}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">Latest Opportunities</h3>
              <div className="w-50 d-flex justify-content-end">
                <input 
                  type="text" 
                  className="form-control px-4 w-75" 
                  placeholder="Search job by name..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="glass-panel overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Posted By</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Vacancies</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, idx) => (
                      <tr key={job.id}>
                        <td>{idx + 1}</td>
                        <td className="fw-bold">{job.companyName}</td>
                        <td className="text-dark">{job.title}</td>
                        <td>{job.hrName}</td>
                        <td>{job.location}</td>
                        <td className="fw-semibold">{job.salary.toLocaleString()}</td>
                        <td><span className="badge bg-secondary">{job.vacancies}</span></td>
                        <td className="text-end">
                          <button 
                            onClick={() => handleApply(job.id)} 
                            className={`btn btn-sm px-4 ${job.applied ? 'btn-secondary disabled' : 'btn-outline-success'}`}
                            disabled={job.applied}
                          >
                            {job.applied ? 'Applied' : 'Apply'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {jobs.length === 0 && <tr><td colSpan="8" className="text-center text-muted p-4">No jobs found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="animate__animated animate__fadeIn">
            <h3 className="fw-bold mb-4">My Interview Schedules</h3>
            <div className="glass-panel overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Job Title</th>
                      <th>Interviewer</th>
                      <th>Date & Time</th>
                      <th>Mode</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((inv, idx) => (
                      <tr key={inv.id}>
                        <td>{idx + 1}</td>
                        <td className="fw-bold text-dark">{inv.jobTitle}</td>
                        <td>{inv.hrName}</td>
                        <td>{inv.interviewDate} @ {inv.interviewTime}</td>
                        <td><span className="badge bg-secondary">{inv.mode}</span></td>
                        <td>
                          <span className={`badge ${inv.result === 'PASSED' ? 'bg-success' : inv.result === 'FAILED' ? 'bg-danger' : 'bg-warning'}`}>
                            {inv.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {interviews.length === 0 && <tr><td colSpan="6" className="text-center text-muted p-4">No interviews scheduled yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;

import React, { useState, useEffect } from 'react';
import api from '../api';

function HRDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // New Job Form State
  const [jobData, setJobData] = useState({ title: '', description: '', companyName: '', location: '', salary: '', vacancies: '' });
  const [editingJobId, setEditingJobId] = useState(null);

  // Search Filter States
  const [appSearch, setAppSearch] = useState({ studentName: '', jobTitle: '', status: '' });
  const [invSearch, setInvSearch] = useState({ candidateName: '', mode: '', status: '' });

  // New Interview Form State
  const [interviewData, setInterviewData] = useState({ applicationId: '', interviewDate: '', interviewTime: '', mode: '' });

  useEffect(() => {
    fetchInterviews();
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchInterviews = async (searchParams = invSearch) => {
    try {
      const params = new URLSearchParams();
      if (searchParams.candidateName) params.append('candidateName', searchParams.candidateName);
      if (searchParams.mode) params.append('mode', searchParams.mode);
      if (searchParams.status) params.append('status', searchParams.status);
      
      const res = await api.get('/interviews', { params });
      setInterviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/hr');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setMsg({ type: 'success', text: 'Job deleted successfully' });
      fetchJobs();
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Delete failed' });
    }
  };

  const fetchApplications = async (searchParams = appSearch) => {
    try {
      const params = new URLSearchParams();
      if (searchParams.studentName) params.append('studentName', searchParams.studentName);
      if (searchParams.jobTitle) params.append('jobTitle', searchParams.jobTitle);
      if (searchParams.status) params.append('status', searchParams.status);

      const res = await api.get('/applications/hr', { params });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateResult = async (id, newResult) => {
    try {
      await api.put(`/interviews/${id}/result`, { result: newResult });
      setMsg({ type: 'success', text: `Status updated to ${newResult}` });
      fetchInterviews();
      if (newResult === 'PASSED') {
        fetchJobs();
      }
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, jobData);
        setMsg({ type: 'success', text: 'Job updated successfully!' });
        setEditingJobId(null);
      } else {
        await api.post('/jobs', jobData);
        setMsg({ type: 'success', text: 'Job posted successfully!' });
      }
      setJobData({ title: '', description: '', companyName: '', location: '', salary: '', vacancies: '' });
      fetchJobs();
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to save job' });
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    setJobData({
      title: job.title,
      description: job.description,
      companyName: job.companyName,
      location: job.location,
      salary: job.salary,
      vacancies: job.vacancies
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setJobData({ title: '', description: '', companyName: '', location: '', salary: '', vacancies: '' });
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/interviews', interviewData);
      setMsg({ type: 'success', text: 'Interview scheduled successfully!' });
      setInterviewData({ applicationId: '', interviewDate: '', interviewTime: '', mode: '' });
      fetchInterviews();
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to schedule interview' });
    }
  };

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'HR Manager' };

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
            <span>RECRUITER</span>
          </div>
        </div>

        <ul className="sidebar-nav flex-grow-1">
          <li>
            <button 
              className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}>
              <i className="bi bi-grid me-3"></i>Overview
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${activeTab === 'jobs' ? 'active' : ''}`} 
              onClick={() => setActiveTab('jobs')}>
              <i className="bi bi-briefcase me-3"></i>Postings
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${activeTab === 'applications' ? 'active' : ''}`} 
              onClick={() => setActiveTab('applications')}>
              <i className="bi bi-file-earmark-person me-3"></i>Applications
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${activeTab === 'schedule' ? 'active' : ''}`} 
              onClick={() => setActiveTab('schedule')}>
              <i className="bi bi-calendar-event me-3"></i>Schedule
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-link ${activeTab === 'interviews' ? 'active' : ''}`} 
              onClick={() => setActiveTab('interviews')}>
              <i className="bi bi-list-task me-3"></i>Interviews
            </button>
          </li>
        </ul>

        <button className="sidebar-logout" onClick={onLogout}>
          <i className="bi bi-box-arrow-right me-3"></i>Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {msg.text && (
          <div className={`alert alert-${msg.type} d-flex align-items-center bg-white text-${msg.type} border border-${msg.type} shadow-sm rounded mb-4`}>
            {msg.text}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="animate__animated animate__fadeIn">
            <h3 className="fw-bold mb-4">Overview</h3>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="glass-panel p-4" style={{borderLeft: '4px solid #10b981'}}>
                  <div className="text-muted small fw-bold mb-1">TOTAL POSTINGS</div>
                  <h2 className="fw-bold text-dark">{jobs.length}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="glass-panel p-4" style={{borderLeft: '4px solid #3b82f6'}}>
                  <div className="text-muted small fw-bold mb-1">SCHEDULED INTERVIEWS</div>
                  <h2 className="fw-bold text-dark">{interviews.length}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="glass-panel p-4" style={{borderLeft: '4px solid #f59e0b'}}>
                  <div className="text-muted small fw-bold mb-1">PENDING DECISIONS</div>
                  <h2 className="fw-bold text-dark">{interviews.filter(i => i.result === 'PENDING').length}</h2>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-4 mt-4 bg-white border">
              <h5 className="fw-bold mb-4">Interview Results Overview</h5>
              <div className="w-100 mt-2">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary fw-semibold">Passed</span>
                  <span>{interviews.filter(i => i.result === 'PASSED').length}</span>
                </div>
                <div className="progress mb-4" style={{height: '24px'}}>
                  <div className="progress-bar bg-success" role="progressbar" style={{width: `${(interviews.filter(i => i.result === 'PASSED').length / (interviews.length || 1)) * 100}%`}}></div>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary fw-semibold">Failed</span>
                  <span>{interviews.filter(i => i.result === 'FAILED').length}</span>
                </div>
                <div className="progress mb-4" style={{height: '24px'}}>
                  <div className="progress-bar bg-danger" role="progressbar" style={{width: `${(interviews.filter(i => i.result === 'FAILED').length / (interviews.length || 1)) * 100}%`}}></div>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary fw-semibold">Pending</span>
                  <span>{interviews.filter(i => i.result === 'PENDING').length}</span>
                </div>
                <div className="progress" style={{height: '24px'}}>
                  <div className="progress-bar bg-warning" role="progressbar" style={{width: `${(interviews.filter(i => i.result === 'PENDING').length / (interviews.length || 1)) * 100}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-4 text-center text-muted mt-4">
              Select a tab from the sidebar to manage your jobs and interviews.
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h3 className="fw-bold mb-0">Job Postings</h3>
            </div>
            <div className="glass-panel p-4 mb-4 bg-white border">
              <h5 className="fw-bold mb-3">{editingJobId ? 'Update Job Posting' : 'Create New Job Posting'}</h5>
              <form onSubmit={handleSubmitJob}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Job Title" required value={jobData.title} onChange={e => setJobData({...jobData, title: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Company Name" required value={jobData.companyName} onChange={e => setJobData({...jobData, companyName: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Location" required value={jobData.location} onChange={e => setJobData({...jobData, location: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <textarea className="form-control py-2" placeholder="Job Description" rows="3" required value={jobData.description} onChange={e => setJobData({...jobData, description: e.target.value})}></textarea>
                  </div>
                  <div className="col-md-4">
                    <input type="number" className="form-control" placeholder="Salary ($)" required value={jobData.salary} onChange={e => setJobData({...jobData, salary: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <input type="number" className="form-control" placeholder="Vacancies" required value={jobData.vacancies} onChange={e => setJobData({...jobData, vacancies: e.target.value})} />
                  </div>
                  <div className="col-md-4 text-end d-flex gap-2">
                    {editingJobId && (
                      <button type="button" onClick={cancelEdit} className="btn btn-outline-secondary w-50 h-100">Cancel</button>
                    )}
                    <button type="submit" className={`btn btn-dark ${editingJobId ? 'w-50' : 'px-5 w-100'} h-100`}>
                      {editingJobId ? 'Update Job' : 'Publish Job'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="glass-panel overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Vacancies</th>
                      <th>Date Posted</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, index) => (
                      <tr key={job.id}>
                        <td>{index + 1}</td>
                        <td className="fw-bold">{job.companyName}</td>
                        <td className="text-dark">{job.title}</td>
                        <td>{job.location}</td>
                        <td>${job.salary.toLocaleString()}</td>
                        <td><span className="badge bg-secondary">{job.vacancies}</span></td>
                        <td>{new Date(job.createdDate).toLocaleDateString()}</td>
                        <td className="text-end text-nowrap">
                          <button onClick={() => handleEditClick(job)} className="btn btn-outline-primary btn-sm px-3 me-2"><i className="bi bi-pencil"></i> Edit</button>
                          <button onClick={() => handleDeleteJob(job.id)} className="btn btn-outline-danger btn-sm px-3"><i className="bi bi-trash"></i> Delete</button>
                        </td>
                      </tr>
                    ))}
                    {jobs.length === 0 && <tr><td colSpan="7" className="text-center text-muted p-4">No jobs posted yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="animate__animated animate__fadeIn">
            <h3 className="fw-bold mb-4">Student Applications</h3>
            
            <div className="glass-panel p-3 mb-4 bg-light border">
              <div className="row g-2 align-items-end">
                <div className="col-md-3">
                  <label className="small fw-semibold text-muted">Candidate Name</label>
                  <input type="text" className="form-control" value={appSearch.studentName} onChange={e => setAppSearch({...appSearch, studentName: e.target.value})} placeholder="e.g. John" />
                </div>
                <div className="col-md-3">
                  <label className="small fw-semibold text-muted">Job Title</label>
                  <input type="text" className="form-control" value={appSearch.jobTitle} onChange={e => setAppSearch({...appSearch, jobTitle: e.target.value})} placeholder="e.g. Developer" />
                </div>
                <div className="col-md-3">
                  <label className="small fw-semibold text-muted">Status</label>
                  <select className="form-select" value={appSearch.status} onChange={e => setAppSearch({...appSearch, status: e.target.value})}>
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex gap-2">
                  <button className="btn btn-dark w-50" onClick={() => fetchApplications(appSearch)}>Search</button>
                  <button className="btn btn-outline-secondary w-50" onClick={() => { setAppSearch({studentName:'', jobTitle:'', status:''}); fetchApplications({studentName:'', jobTitle:'', status:''}); }}>Reset</button>
                </div>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Applied Job</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, idx) => (
                      <tr key={app.id}>
                        <td>{idx + 1}</td>
                        <td className="fw-bold text-dark">{app.studentName}</td>
                        <td>{app.jobTitle}</td>
                        <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${app.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-info'}`}>{app.status}</span>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && <tr><td colSpan="5" className="text-center text-muted p-4">No applications received yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="animate__animated animate__fadeIn">
             <h3 className="fw-bold mb-4">Schedule Candidate Interview</h3>
             <div className="glass-panel p-4 bg-white border">
              <form onSubmit={handleScheduleInterview}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <select className="form-select" required value={interviewData.applicationId} onChange={e => setInterviewData({...interviewData, applicationId: e.target.value})}>
                      <option value="" disabled>Select Candidate / Application</option>
                      {applications.filter(app => app.status === 'PENDING').map(app => (
                        <option key={app.id} value={app.id}>{app.studentName} - {app.jobTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <select className="form-select" required value={interviewData.mode} onChange={e => setInterviewData({...interviewData, mode: e.target.value})}>
                      <option value="" disabled>Select Mode</option>
                      <option value="ONLINE">Online Video Call</option>
                      <option value="OFFLINE">In-Person Office</option>
                      <option value="PHONE">Phone Call</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="date" className="form-control" required value={interviewData.interviewDate} onChange={e => setInterviewData({...interviewData, interviewDate: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input type="time" className="form-control" required value={interviewData.interviewTime} onChange={e => setInterviewData({...interviewData, interviewTime: e.target.value})} />
                  </div>
                  <div className="col-12 mt-4 text-end">
                    <button type="submit" className="btn btn-dark px-5 w-100">Confirm Schedule</button>
                  </div>
                </div>
              </form>
             </div>
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="animate__animated animate__fadeIn">
            <h3 className="fw-bold mb-4">Scheduled Interviews</h3>

            <div className="glass-panel p-3 mb-4 bg-light border">
              <div className="row g-2 align-items-end">
                <div className="col-md-3">
                  <label className="small fw-semibold text-muted">Candidate Name</label>
                  <input type="text" className="form-control" value={invSearch.candidateName} onChange={e => setInvSearch({...invSearch, candidateName: e.target.value})} placeholder="e.g. John" />
                </div>
                <div className="col-md-3">
                  <label className="small fw-semibold text-muted">Mode</label>
                  <select className="form-select" value={invSearch.mode} onChange={e => setInvSearch({...invSearch, mode: e.target.value})}>
                    <option value="">All Modes</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">In-Person</option>
                    <option value="PHONE">Phone Call</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="small fw-semibold text-muted">Status</label>
                  <select className="form-select" value={invSearch.status} onChange={e => setInvSearch({...invSearch, status: e.target.value})}>
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="PASSED">Passed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex gap-2">
                  <button className="btn btn-dark w-50" onClick={() => fetchInterviews(invSearch)}>Search</button>
                  <button className="btn btn-outline-secondary w-50" onClick={() => { setInvSearch({candidateName:'', mode:'', status:''}); fetchInterviews({candidateName:'', mode:'', status:''}); }}>Reset</button>
                </div>
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Candidate</th>
                      <th>Job Title</th>
                      <th>Date & Time</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th className="text-end border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((inv, idx) => (
                      <tr key={inv.id}>
                        <td>{idx + 1}</td>
                        <td className="fw-bold text-dark">{inv.candidateName}</td>
                        <td>{inv.jobTitle}</td>
                        <td>{inv.interviewDate} {inv.interviewTime}</td>
                        <td><span className="badge bg-secondary">{inv.mode}</span></td>
                        <td>
                          <span className={`badge ${inv.result === 'PASSED' ? 'bg-success' : inv.result === 'FAILED' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {inv.result}
                          </span>
                        </td>
                        <td className="text-end">
                          {inv.result === 'PENDING' && (
                            <div className="btn-group btn-group-sm">
                              <button onClick={() => handleUpdateResult(inv.id, 'PASSED')} className="btn btn-outline-success border-end-0">Pass</button>
                              <button onClick={() => handleUpdateResult(inv.id, 'FAILED')} className="btn btn-outline-danger">Fail</button>
                            </div>
                          )}
                          {inv.result !== 'PENDING' && <span className="text-muted small">Completed</span>}
                        </td>
                      </tr>
                    ))}
                    {interviews.length === 0 && <tr><td colSpan="7" className="text-center text-muted p-4">No interviews scheduled yet.</td></tr>}
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

export default HRDashboard;

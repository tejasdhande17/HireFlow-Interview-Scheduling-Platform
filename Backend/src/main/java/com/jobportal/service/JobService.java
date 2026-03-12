package com.jobportal.service;

import com.jobportal.dto.JobRequestDTO;
import com.jobportal.dto.JobResponseDTO;

import java.util.List;

public interface JobService {
    JobResponseDTO addJob(JobRequestDTO jobRequestDTO, Long hrId);
    List<JobResponseDTO> getAllJobs(String search, Long studentId);
    List<JobResponseDTO> getJobsByHr(Long hrId);
    void deleteJob(Long jobId, Long hrId);
    JobResponseDTO updateJob(Long jobId, JobRequestDTO jobRequestDTO, Long hrId);
}

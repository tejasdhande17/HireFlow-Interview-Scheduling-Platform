package com.jobportal.serviceImpl;

import com.jobportal.dto.JobRequestDTO;
import com.jobportal.dto.JobResponseDTO;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final ModelMapper modelMapper;

    @Override
    public JobResponseDTO addJob(JobRequestDTO jobRequestDTO, Long hrId) {
        User hr = userRepository.findByIdAndDeletedFalse(hrId)
                .orElseThrow(() -> new ResourceNotFoundException("HR not found"));

        if (!com.jobportal.entity.Role.HR.equals(hr.getRole())) {
            throw new RuntimeException("Only HR can add jobs");
        }

        Job job = modelMapper.map(jobRequestDTO, Job.class);
        job.setCreatedDate(LocalDateTime.now());
        job.setHr(hr);

        Job savedJob = jobRepository.save(job);

        JobResponseDTO response = modelMapper.map(savedJob, JobResponseDTO.class);
        response.setHrId(hr.getId());
        response.setHrName(hr.getName());
        return response;
    }

    @Override
    public List<JobResponseDTO> getAllJobs(String search, Long studentId) {
        List<Job> jobs;
        if (search != null && !search.trim().isEmpty()) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseAndDeletedFalse(search);
        } else {
            jobs = jobRepository.findAllByDeletedFalse();
        }
        return jobs.stream().map(job -> {
            JobResponseDTO dto = modelMapper.map(job, JobResponseDTO.class);
            dto.setHrId(job.getHr().getId());
            dto.setHrName(job.getHr().getName());
            boolean applied = applicationRepository.existsByStudentIdAndJobIdAndDeletedFalse(studentId, job.getId());
            dto.setApplied(applied);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<JobResponseDTO> getJobsByHr(Long hrId) {
        List<Job> jobs = jobRepository.findByHrIdAndDeletedFalse(hrId);
        return jobs.stream().map(job -> {
            JobResponseDTO dto = modelMapper.map(job, JobResponseDTO.class);
            dto.setHrId(job.getHr().getId());
            dto.setHrName(job.getHr().getName());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteJob(Long jobId, Long hrId) {
        Job job = jobRepository.findByIdAndDeletedFalse(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getHr().getId().equals(hrId)) {
            throw new RuntimeException("You are not authorized to delete this job");
        }

        job.setDeleted(true);
        jobRepository.save(job);
    }

    @Override
    public JobResponseDTO updateJob(Long jobId, JobRequestDTO jobRequestDTO, Long hrId) {
        Job job = jobRepository.findByIdAndDeletedFalse(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getHr().getId().equals(hrId)) {
            throw new RuntimeException("You are not authorized to update this job");
        }

        job.setTitle(jobRequestDTO.getTitle());
        job.setDescription(jobRequestDTO.getDescription());
        job.setCompanyName(jobRequestDTO.getCompanyName());
        job.setLocation(jobRequestDTO.getLocation());
        job.setSalary(jobRequestDTO.getSalary());
        job.setVacancies(jobRequestDTO.getVacancies());

        Job updatedJob = jobRepository.save(job);
        JobResponseDTO response = modelMapper.map(updatedJob, JobResponseDTO.class);
        response.setHrId(job.getHr().getId());
        response.setHrName(job.getHr().getName());
        return response;
    }
}

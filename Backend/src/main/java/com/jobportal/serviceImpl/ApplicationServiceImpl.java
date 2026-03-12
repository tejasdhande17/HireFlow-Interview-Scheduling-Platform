package com.jobportal.serviceImpl;

import com.jobportal.dto.ApplicationRequestDTO;
import com.jobportal.dto.ApplicationResponseDTO;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceAlreadyExistsException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ApplicationResponseDTO applyForJob(ApplicationRequestDTO applicationRequestDTO, Long studentId) {
        User student = userRepository.findByIdAndDeletedFalse(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (!com.jobportal.entity.Role.STUDENT.equals(student.getRole())) {
            throw new RuntimeException("Only STUDENT can apply for jobs");
        }

        Job job = jobRepository.findByIdAndDeletedFalse(applicationRequestDTO.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (applicationRepository.existsByStudentIdAndJobIdAndDeletedFalse(studentId, job.getId())) {
            throw new ResourceAlreadyExistsException("You have already applied for this job");
        }

        Application application = Application.builder()
                .applicationDate(LocalDateTime.now())
                .status("PENDING")
                .student(student)
                .job(job)
                .build();

        Application savedApplication = applicationRepository.save(application);

        ApplicationResponseDTO response = modelMapper.map(savedApplication, ApplicationResponseDTO.class);
        response.setStudentId(student.getId());
        response.setStudentName(student.getName());
        response.setJobId(job.getId());
        response.setJobTitle(job.getTitle());
        return response;
    }

    @Override
    public java.util.List<ApplicationResponseDTO> getApplicationsForHr(Long hrId, String studentName, String jobTitle, String status) {
        String queryName = studentName == null ? "" : studentName.trim();
        String queryJob = jobTitle == null ? "" : jobTitle.trim();
        String queryStatus = status == null ? "" : status.trim();
        
        java.util.List<Application> applications = applicationRepository.findByHrIdAndFilters(hrId, queryName, queryJob, queryStatus);
        return applications.stream().map(app -> {
            ApplicationResponseDTO dto = modelMapper.map(app, ApplicationResponseDTO.class);
            dto.setStudentId(app.getStudent().getId());
            dto.setStudentName(app.getStudent().getName());
            dto.setJobId(app.getJob().getId());
            dto.setJobTitle(app.getJob().getTitle());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }
}

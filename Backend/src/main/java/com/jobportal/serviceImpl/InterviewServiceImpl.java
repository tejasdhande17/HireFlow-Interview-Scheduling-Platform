package com.jobportal.serviceImpl;

import com.jobportal.dto.InterviewRequestDTO;
import com.jobportal.dto.InterviewResponseDTO;
import com.jobportal.entity.Application;
import com.jobportal.entity.Interview;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.InterviewRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public InterviewResponseDTO scheduleInterview(InterviewRequestDTO interviewRequestDTO, Long hrId) {
        User hr = userRepository.findByIdAndDeletedFalse(hrId)
                .orElseThrow(() -> new ResourceNotFoundException("HR not found"));

        if (!com.jobportal.entity.Role.HR.equals(hr.getRole())) {
            throw new RuntimeException("Only HR can schedule interviews");
        }

        Application application = applicationRepository.findByIdAndDeletedFalse(interviewRequestDTO.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getJob().getHr().getId().equals(hrId)) {
            throw new RuntimeException("This application is for a job posted by another HR");
        }

        application.setStatus("INTERVIEW_SCHEDULED");
        applicationRepository.save(application);

        Interview interview = modelMapper.map(interviewRequestDTO, Interview.class);
        interview.setApplication(application);
        interview.setHr(hr);

        if (interview.getResult() == null || interview.getResult().isEmpty()) {
            interview.setResult("PENDING");
        }

        Interview savedInterview = interviewRepository.save(interview);

        return mapToResponseDTO(savedInterview);
    }

    @Override
    public List<InterviewResponseDTO> getAllInterviewsByHr(Long hrId, String candidateName, String mode, String status) {
        String queryName = candidateName == null ? "" : candidateName.trim();
        String queryMode = mode == null ? "" : mode.trim();
        String queryStatus = status == null ? "" : status.trim();

        List<Interview> interviews = interviewRepository.findByHrIdAndFilters(hrId, queryName, queryMode, queryStatus);
        return interviews.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<InterviewResponseDTO> getAllInterviewsByStudent(Long studentId) {
        List<Interview> interviews = interviewRepository.findByApplicationStudentIdAndDeletedFalse(studentId);
        return interviews.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public InterviewResponseDTO updateInterviewResult(Long interviewId, String result, Long hrId) {
        Interview interview = interviewRepository.findByIdAndDeletedFalse(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        if (!interview.getHr().getId().equals(hrId)) {
            throw new RuntimeException("You are not authorized to update this interview");
        }

        boolean isNewlyPassed = "PASSED".equalsIgnoreCase(result) && !"PASSED".equalsIgnoreCase(interview.getResult());

        interview.setResult(result);
        Interview savedInterview = interviewRepository.save(interview);

        if (isNewlyPassed) {
            com.jobportal.entity.Job job = interview.getApplication().getJob();
            if (job.getVacancies() != null && job.getVacancies() > 0) {
                job.setVacancies(job.getVacancies() - 1);
                if (job.getVacancies() == 0) {
                    job.setDeleted(true);
                }
                jobRepository.save(job);
            }
        }
        return mapToResponseDTO(savedInterview);
    }

    private InterviewResponseDTO mapToResponseDTO(Interview interview) {
        InterviewResponseDTO dto = modelMapper.map(interview, InterviewResponseDTO.class);
        dto.setCandidateName(interview.getApplication().getStudent().getName());
        dto.setHrName(interview.getHr().getName());
        dto.setJobTitle(interview.getApplication().getJob().getTitle());
        return dto;
    }
}

package com.jobportal.service;

import com.jobportal.dto.InterviewRequestDTO;
import com.jobportal.dto.InterviewResponseDTO;

import java.util.List;

public interface InterviewService {
    InterviewResponseDTO scheduleInterview(InterviewRequestDTO interviewRequestDTO, Long hrId);
    List<InterviewResponseDTO> getAllInterviewsByHr(Long hrId, String candidateName, String mode, String status);
    List<InterviewResponseDTO> getAllInterviewsByStudent(Long studentId);
    InterviewResponseDTO updateInterviewResult(Long interviewId, String result, Long hrId);
}

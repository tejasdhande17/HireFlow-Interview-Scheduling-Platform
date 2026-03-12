package com.jobportal.service;

import com.jobportal.dto.ApplicationRequestDTO;
import com.jobportal.dto.ApplicationResponseDTO;

import java.util.List;

public interface ApplicationService {
    ApplicationResponseDTO applyForJob(ApplicationRequestDTO applicationRequestDTO, Long studentId);
    List<ApplicationResponseDTO> getApplicationsForHr(Long hrId, String studentName, String jobTitle, String status);
}

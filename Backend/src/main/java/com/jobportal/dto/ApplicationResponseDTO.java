package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponseDTO {
    private Long id;
    private LocalDateTime applicationDate;
    private String status;
    private Long studentId;
    private String studentName;
    private Long jobId;
    private String jobTitle;
}

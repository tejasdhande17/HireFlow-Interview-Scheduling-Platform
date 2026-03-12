package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponseDTO {
    private Long id;
    private LocalDate interviewDate;
    private LocalTime interviewTime;
    private String mode;
    private String result;
    private String candidateName;
    private String hrName;
    private String jobTitle;
}

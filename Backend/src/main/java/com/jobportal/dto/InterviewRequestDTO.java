package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class InterviewRequestDTO {

    @NotNull(message = "Application ID cannot be null")
    private Long applicationId;

    @NotNull(message = "Interview date cannot be null")
    private LocalDate interviewDate;

    @NotNull(message = "Interview time cannot be null")
    private LocalTime interviewTime;

    @NotBlank(message = "Mode is required")
    private String mode;
    
    private String result;
}

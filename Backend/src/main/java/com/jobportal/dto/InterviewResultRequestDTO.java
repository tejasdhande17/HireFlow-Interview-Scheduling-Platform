package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InterviewResultRequestDTO {
    @NotBlank(message = "Result cannot be empty")
    private String result;
}

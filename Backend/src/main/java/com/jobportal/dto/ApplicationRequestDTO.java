package com.jobportal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequestDTO {
    @NotNull(message = "Job ID cannot be null")
    private Long jobId;
}

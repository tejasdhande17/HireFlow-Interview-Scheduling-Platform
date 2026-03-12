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
public class JobResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private Double salary;
    private Integer vacancies;
    private LocalDateTime createdDate;
    private Long hrId;
    private String hrName;
    @Builder.Default
    private boolean applied = false;
}

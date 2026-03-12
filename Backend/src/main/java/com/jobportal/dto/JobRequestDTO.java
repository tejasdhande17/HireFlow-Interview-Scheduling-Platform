package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequestDTO {

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotBlank(message = "Company Name cannot be blank")
    private String companyName;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    @NotNull(message = "Salary cannot be null")
    @Positive(message = "Salary must be positive")
    private Double salary;

    @NotNull(message = "Vacancies cannot be null")
    @Positive(message = "Vacancies must be a positive number")
    private Integer vacancies;
}

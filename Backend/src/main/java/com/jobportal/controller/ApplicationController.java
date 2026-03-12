package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequestDTO;
import com.jobportal.dto.ApplicationResponseDTO;
import com.jobportal.dto.UserResponseDTO;
import com.jobportal.service.ApplicationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> applyForJob(
            @Valid @RequestBody ApplicationRequestDTO applicationRequestDTO, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        ApplicationResponseDTO response = applicationService.applyForJob(applicationRequestDTO, user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/hr")
    public ResponseEntity<java.util.List<ApplicationResponseDTO>> getApplicationsForHr(
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String jobTitle,
            @RequestParam(required = false) String status,
            HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null || !"HR".equals(user.getRole().name())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        java.util.List<ApplicationResponseDTO> response = applicationService.getApplicationsForHr(user.getId(), studentName, jobTitle, status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
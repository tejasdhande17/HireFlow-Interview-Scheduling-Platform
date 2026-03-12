package com.jobportal.controller;

import com.jobportal.dto.InterviewRequestDTO;
import com.jobportal.dto.InterviewResponseDTO;
import com.jobportal.dto.UserResponseDTO;
import com.jobportal.service.InterviewService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<InterviewResponseDTO> scheduleInterview(
            @Valid @RequestBody InterviewRequestDTO interviewRequestDTO, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        InterviewResponseDTO response = interviewService.scheduleInterview(interviewRequestDTO, user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponseDTO>> getAllInterviewsCreatedByHr(
            @RequestParam(required = false) String candidateName,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String status,
            HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<InterviewResponseDTO> interviews = interviewService.getAllInterviewsByHr(user.getId(), candidateName, mode, status);
        return new ResponseEntity<>(interviews, HttpStatus.OK);
    }

    @GetMapping("/student")
    public ResponseEntity<List<InterviewResponseDTO>> getInterviewResultsForStudent(HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<InterviewResponseDTO> interviews = interviewService.getAllInterviewsByStudent(user.getId());
        return new ResponseEntity<>(interviews, HttpStatus.OK);
    }

    @PutMapping("/{id}/result")
    public ResponseEntity<InterviewResponseDTO> updateInterviewResult(@PathVariable Long id, @Valid @RequestBody com.jobportal.dto.InterviewResultRequestDTO request, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null || !"HR".equals(user.getRole().name())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        InterviewResponseDTO response = interviewService.updateInterviewResult(id, request.getResult(), user.getId());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

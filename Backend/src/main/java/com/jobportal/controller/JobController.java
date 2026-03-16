package com.jobportal.controller;

import com.jobportal.dto.JobRequestDTO;
import com.jobportal.dto.JobResponseDTO;
import com.jobportal.dto.UserResponseDTO;
import com.jobportal.service.JobService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobResponseDTO> addJob(@Valid @RequestBody JobRequestDTO jobRequestDTO, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        JobResponseDTO response = jobService.addJob(jobRequestDTO, user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobResponseDTO>> getAllJobs(@RequestParam(required = false) String search, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<JobResponseDTO> jobs = jobService.getAllJobs(search, user.getId());
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/hr")
    public ResponseEntity<List<JobResponseDTO>> getHrJobs(HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null || !"HR".equals(user.getRole().name())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<JobResponseDTO> jobs = jobService.getJobsByHr(user.getId());
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null || !"HR".equals(user.getRole().name())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        jobService.deleteJob(id, user.getId());
        return new ResponseEntity<>("Job deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponseDTO> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequestDTO jobRequestDTO, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("user");
        if (user == null || !"HR".equals(user.getRole().name())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        JobResponseDTO response = jobService.updateJob(id, jobRequestDTO, user.getId());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

package com.jobportal.controller;

import com.jobportal.dto.UserLoginDTO;
import com.jobportal.dto.UserRegisterDTO;
import com.jobportal.dto.UserResponseDTO;
import com.jobportal.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRegisterDTO userRegisterDTO) {
        UserResponseDTO response = userService.register(userRegisterDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody UserLoginDTO userLoginDTO, HttpSession session) {
        UserResponseDTO userResponse = userService.login(userLoginDTO);
        session.setAttribute("user", userResponse);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
    }
}

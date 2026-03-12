package com.jobportal.serviceImpl;

import com.jobportal.dto.UserLoginDTO;
import com.jobportal.dto.UserRegisterDTO;
import com.jobportal.dto.UserResponseDTO;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceAlreadyExistsException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public UserResponseDTO register(UserRegisterDTO userRegisterDTO) {
        if (userRepository.existsByEmail(userRegisterDTO.getEmail())) {
            throw new ResourceAlreadyExistsException("User already exists with email: " + userRegisterDTO.getEmail());
        }

        User user = modelMapper.map(userRegisterDTO, User.class);
        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser, UserResponseDTO.class);
    }

    @Override
    public UserResponseDTO login(UserLoginDTO userLoginDTO) {
        User user = userRepository.findByEmailAndDeletedFalse(userLoginDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found or deleted"));

        if (!user.getPassword().equals(userLoginDTO.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return modelMapper.map(user, UserResponseDTO.class);
    }
}

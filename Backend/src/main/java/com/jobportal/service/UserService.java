package com.jobportal.service;

import com.jobportal.dto.UserLoginDTO;
import com.jobportal.dto.UserRegisterDTO;
import com.jobportal.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO register(UserRegisterDTO userRegisterDTO);
    UserResponseDTO login(UserLoginDTO userLoginDTO);
}

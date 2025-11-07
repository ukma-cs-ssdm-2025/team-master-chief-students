package com.example.expensetracker.service;

import com.example.expensetracker.dto.UserDto;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface UserService {
    UserDto getCurrentUser(Authentication auth);
    UserDto getUserById(Long id);
    List<UserDto> getAllUsers();
    UserDto updateUser(Long id, UserDto dto);

    void deleteUser(Long id);
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}

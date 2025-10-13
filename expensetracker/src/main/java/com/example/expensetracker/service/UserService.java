package com.example.expensetracker.service;

import com.example.expensetracker.dto.UserDto;
import com.example.expensetracker.entity.UserEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDto getCurrentUser(Authentication auth);
    UserDto getUserById(Long id);
    List<UserDto> getAllUsers();
    UserDto updateUser(Long id, UserDto dto);

    void deleteUser(Long id);
    Optional<UserEntity> findByEmail(String email);
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}

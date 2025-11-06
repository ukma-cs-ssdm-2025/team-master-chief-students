package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.UserDto;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.SecurityUser;
import com.example.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.UnauthorizedException;
import com.example.expensetracker.mapper.UserMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserDto getCurrentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        String email = auth.getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return userMapper.toDto(user);
    }

    @Override
    public UserDto getUserById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return userMapper.toDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    @Override
    public UserDto updateUser(Long id, UserDto dto) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        userMapper.updateEntityFromDto(dto, user);
        UserEntity updated = userRepository.save(user);

        return userMapper.toDto(updated);
    }

    @Override
    public void deleteUser(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        userRepository.delete(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new SecurityUser(user);
    }
}
package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.UserDto;
import com.example.expensetracker.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        return UserDto.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .active(entity.isActive())
                .build();
    }

    public UserEntity toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }

        return UserEntity.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .active(dto.isActive())
                .build();
    }

    public void updateEntityFromDto(UserDto dto, UserEntity entity) {
        if (dto == null || entity == null) return;

        if (dto.getUsername() != null) {
            entity.setUsername(dto.getUsername());
        }

        if (dto.getEmail() != null) {
            entity.setEmail(dto.getEmail());
        }

        entity.setActive(dto.isActive());
    }
}


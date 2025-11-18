package com.example.expensetracker.mapper;

import com.example.expensetracker.dto.UserDto;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("UserMapper Tests")
public class UserMapperTest {

    private final UserMapper mapper = new UserMapper();

    @Test
    @DisplayName("Should map UserEntity to UserDto correctly")
    void shouldMapUserEntityToDto() {
        UserEntity user = TestDataFactory.createUser(1L);

        // When
        UserDto dto = mapper.toDto(user);

        // Then
        assert dto.getId().equals(1L);
        assert dto.getUsername().equals(user.getUsername());
        assert dto.getEmail().equals(user.getEmail());
    }

    @Test
    @DisplayName("Should map UserDto to UserEntity correctly")
    void shouldMapUserDtoToEntity() {
        UserDto dto = UserDto.builder()
                .id(1L)
                .username("testuser")
                .email("mail@mail.com")
                .build();

        // When
        UserEntity entity = mapper.toEntity(dto);

        // Then
        assert entity.getId().equals(1L);
        assert entity.getUsername().equals("testuser");
        assert entity.getEmail().equals("mail@mail.com");
    }
}

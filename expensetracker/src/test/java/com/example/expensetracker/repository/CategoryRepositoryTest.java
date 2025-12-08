package com.example.expensetracker.repository;

import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.testutil.factory.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DisplayName("CategoryRepository Tests")
class CategoryRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("expense_tracker_test")
            .withUsername("test")
            .withPassword("test")
            .withReuse(true);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    }

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private UserEntity user1;
    private UserEntity user2;

    @BeforeEach
    void setUp() {
        user1 = TestDataFactory.createUser();
        user1 = entityManager.persistAndFlush(user1);

        user2 = TestDataFactory.createUser();
        user2 = entityManager.persistAndFlush(user2);
    }

    @Test
    @DisplayName("Should find categories by user ID")
    void shouldFindCategoriesByUserId() {
        // Given
        CategoryEntity category1 = TestDataFactory.createCategory(user1);
        category1.setName("Groceries");


        CategoryEntity category3 = TestDataFactory.createCategory(user2);
        category3.setName("Entertainment");


        entityManager.clear();

        // When
        List<CategoryEntity> user1Categories = categoryRepository.findByUserId(user1.getId());
        List<CategoryEntity> user2Categories = categoryRepository.findByUserId(user2.getId());

        // Then
        assertThat(user1Categories).hasSize(2);
        assertThat(user1Categories).extracting(CategoryEntity::getName)
                .containsExactlyInAnyOrder("Groceries", "Transport");

        assertThat(user2Categories).hasSize(1);
        assertThat(user2Categories.get(0).getName()).isEqualTo("Entertainment");
    }

    @Test
    @DisplayName("Should return empty list when user has no categories")
    void shouldReturnEmptyListWhenUserHasNoCategories() {
        // When
        List<CategoryEntity> categories = categoryRepository.findByUserId(user1.getId());

        // Then
        assertThat(categories).isEmpty();
    }

    @Test
    @DisplayName("Should find category by ID and user ID")
    void shouldFindCategoryByIdAndUserId() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(user1);
        category.setName("Groceries");
        category = entityManager.persistAndFlush(category);

        entityManager.clear();

        // When
        Optional<CategoryEntity> found = categoryRepository.findByIdAndUserId(category.getId(), user1.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(category.getId());
        assertThat(found.get().getName()).isEqualTo("Groceries");
        assertThat(found.get().getUser().getId()).isEqualTo(user1.getId());
    }

    @Test
    @DisplayName("Should return empty when category belongs to different user")
    void shouldReturnEmptyWhenCategoryBelongsToDifferentUser() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(user1);
        category = entityManager.persistAndFlush(category);

        entityManager.clear();

        // When
        Optional<CategoryEntity> found = categoryRepository.findByIdAndUserId(category.getId(), user2.getId());

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should return empty when category ID does not exist")
    void shouldReturnEmptyWhenCategoryIdDoesNotExist() {
        // When
        Optional<CategoryEntity> found = categoryRepository.findByIdAndUserId(999L, user1.getId());

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should check if category exists by name and user ID")
    void shouldCheckIfCategoryExistsByNameAndUserId() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(user1);
        category.setName("Groceries");

        entityManager.clear();

        // When
        boolean exists = categoryRepository.existsByNameAndUserId("Groceries", user1.getId());
        boolean notExists = categoryRepository.existsByNameAndUserId("Transport", user1.getId());
        boolean existsForOtherUser = categoryRepository.existsByNameAndUserId("Groceries", user2.getId());

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
        assertThat(existsForOtherUser).isFalse();
    }

    @Test
    @DisplayName("Should be case-sensitive when checking existence by name")
    void shouldBeCaseSensitiveWhenCheckingExistenceByName() {

        entityManager.clear();

        // When
        boolean existsExact = categoryRepository.existsByNameAndUserId("Groceries", user1.getId());
        boolean existsLowercase = categoryRepository.existsByNameAndUserId("groceries", user1.getId());
        boolean existsUppercase = categoryRepository.existsByNameAndUserId("GROCERIES", user1.getId());

        // Then
        assertThat(existsExact).isTrue();
        // Note: The actual behavior depends on database collation settings
        // PostgreSQL by default is case-sensitive, so these should be false
        assertThat(existsLowercase).isFalse();
        assertThat(existsUppercase).isFalse();
    }

    @Test
    @DisplayName("Should find multiple categories for same user")
    void shouldFindMultipleCategoriesForSameUser() {
        // Given
        CategoryEntity category1 = TestDataFactory.createCategory(user1);
        category1.setName("Category 1");

        CategoryEntity category2 = TestDataFactory.createCategory(user1);
        category2.setName("Category 2");

        CategoryEntity category3 = TestDataFactory.createCategory(user1);
        category3.setName("Category 3");

        entityManager.clear();

        // When
        List<CategoryEntity> categories = categoryRepository.findByUserId(user1.getId());

        // Then
        assertThat(categories).hasSize(3);
        assertThat(categories).extracting(CategoryEntity::getName)
                .containsExactlyInAnyOrder("Category 1", "Category 2", "Category 3");
    }

    @Test
    @DisplayName("Should persist and retrieve category with user relationship")
    void shouldPersistAndRetrieveCategoryWithUserRelationship() {
        // Given
        CategoryEntity category = TestDataFactory.createCategory(user1);
        category.setName("Test Category");
        category = entityManager.persistAndFlush(category);
        entityManager.clear();

        // When
        Optional<CategoryEntity> found = categoryRepository.findByIdAndUserId(category.getId(), user1.getId());

        // Then
        assertThat(found).isPresent();
        CategoryEntity retrieved = found.get();
        assertThat(retrieved.getUser()).isNotNull();
        assertThat(retrieved.getUser().getId()).isEqualTo(user1.getId());
        assertThat(retrieved.getUser().getEmail()).isEqualTo(user1.getEmail());
    }
}


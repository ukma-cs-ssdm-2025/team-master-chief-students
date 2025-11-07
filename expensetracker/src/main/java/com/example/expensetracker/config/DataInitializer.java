package com.example.expensetracker.config;

import com.example.expensetracker.entity.*;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private static final Logger logger = LogManager.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ExpenseRepository expenseRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initTestData() {
        return args -> {
            if (userRepository.count() > 0) {
                logger.info("Database already contains data, skipping initialization");
                return;
            }

            logger.info("Initializing test data...");
            initializeData();
            logger.info("Test data initialization completed");
        };
    }

    @Transactional
    public void initializeData() {

        UserEntity alice = createUser("alice@example.com", "Alice", "password123");
        UserEntity bob = createUser("bob@example.com", "Bob", "password123");
        UserEntity charlie = createUser("charlie@example.com", "Charlie", "password123");
        UserEntity diana = createUser("diana@example.com", "Diana", "password123");

        CategoryEntity foodAlice = createCategory("Food", alice);
        CategoryEntity transportAlice = createCategory("Transport", alice);
        CategoryEntity foodBob = createCategory("Food", bob);
        CategoryEntity transportBob = createCategory("Transport", bob);
        CategoryEntity foodCharlie = createCategory("Food", charlie);
        CategoryEntity transportCharlie = createCategory("Transport", charlie);
        CategoryEntity foodDiana = createCategory("Food", diana);
        CategoryEntity transportDiana = createCategory("Transport", diana);

        TeamEntity team1 = createTeam("Development Team", alice);
        TeamEntity team2 = createTeam("Marketing Team", bob);

        addTeamMember(team1, alice, TeamRole.OWNER);
        addTeamMember(team1, bob, TeamRole.ADMIN);
        addTeamMember(team1, charlie, TeamRole.MEMBER);
        addTeamMember(team1, diana, TeamRole.VIEWER);

        addTeamMember(team2, bob, TeamRole.OWNER);
        addTeamMember(team2, alice, TeamRole.MEMBER);
        addTeamMember(team2, charlie, TeamRole.MEMBER);

        createPersonalExpense(alice, foodAlice, "Lunch", new BigDecimal("15.50"), 
                LocalDate.now().minusDays(5), Instant.now().minusSeconds(432000));
        createPersonalExpense(alice, transportAlice, "Taxi", new BigDecimal("25.00"), 
                LocalDate.now().minusDays(3), Instant.now().minusSeconds(259200));
        createPersonalExpense(bob, foodBob, "Coffee", new BigDecimal("5.00"), 
                LocalDate.now().minusDays(2), Instant.now().minusSeconds(172800));
        createPersonalExpense(charlie, foodCharlie, "Dinner", new BigDecimal("30.00"), 
                LocalDate.now().minusDays(1), Instant.now().minusSeconds(86400));


        createTeamExpense(alice, team1, foodAlice, "Team lunch", new BigDecimal("150.50"), 
                LocalDate.now().minusDays(10), Instant.now().minusSeconds(864000));
        createTeamExpense(bob, team1, transportBob, "Team taxi", new BigDecimal("75.00"), 
                LocalDate.now().minusDays(9), Instant.now().minusSeconds(777600));
        createTeamExpense(charlie, team1, foodCharlie, "Team dinner", new BigDecimal("200.00"), 
                LocalDate.now().minusDays(8), Instant.now().minusSeconds(691200));
        createTeamExpense(alice, team1, foodAlice, "Team breakfast", new BigDecimal("80.00"), 
                LocalDate.now().minusDays(7), Instant.now().minusSeconds(604800));
        createTeamExpense(bob, team1, transportBob, "Team bus", new BigDecimal("40.00"), 
                LocalDate.now().minusDays(6), Instant.now().minusSeconds(518400));
        createTeamExpense(charlie, team1, foodCharlie, "Team snack", new BigDecimal("20.00"), 
                LocalDate.now().minusDays(5), Instant.now().minusSeconds(432000));
        createTeamExpense(alice, team1, foodAlice, "Team pizza", new BigDecimal("120.00"), 
                LocalDate.now().minusDays(4), Instant.now().minusSeconds(345600));
        createTeamExpense(bob, team1, transportBob, "Team train", new BigDecimal("60.00"), 
                LocalDate.now().minusDays(3), Instant.now().minusSeconds(259200));
        createTeamExpense(charlie, team1, foodCharlie, "Team drinks", new BigDecimal("90.00"), 
                LocalDate.now().minusDays(2), Instant.now().minusSeconds(172800));
        createTeamExpense(alice, team1, foodAlice, "Team meeting", new BigDecimal("100.00"), 
                LocalDate.now().minusDays(1), Instant.now().minusSeconds(86400));


        createTeamExpense(bob, team2, foodBob, "Marketing lunch", new BigDecimal("180.00"), 
                LocalDate.now().minusDays(5), Instant.now().minusSeconds(432000));
        createTeamExpense(alice, team2, foodAlice, "Marketing coffee", new BigDecimal("45.00"), 
                LocalDate.now().minusDays(3), Instant.now().minusSeconds(259200));
        createTeamExpense(charlie, team2, foodCharlie, "Marketing dinner", new BigDecimal("220.00"), 
                LocalDate.now().minusDays(1), Instant.now().minusSeconds(86400));

        logger.info("Created test data:");
        logger.info("- Users: {} (alice, bob, charlie, diana)", userRepository.count());
        logger.info("- Teams: {} (Development Team, Marketing Team)", teamRepository.count());
        logger.info("- Team members: {}", teamMemberRepository.count());
        logger.info("- Categories: {}", categoryRepository.count());
        logger.info("- Expenses: {} (personal + team)", expenseRepository.count());
    }

    private UserEntity createUser(String email, String username, String password) {
        UserEntity user = UserEntity.builder()
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .active(true)
                .build();
        return userRepository.save(user);
    }

    private CategoryEntity createCategory(String name, UserEntity user) {
        CategoryEntity category = CategoryEntity.builder()
                .name(name)
                .user(user)
                .build();
        return categoryRepository.save(category);
    }

    private TeamEntity createTeam(String name, UserEntity owner) {
        TeamEntity team = TeamEntity.builder()
                .name(name)
                .owner(owner)
                .build();
        return teamRepository.save(team);
    }

    private TeamMemberEntity addTeamMember(TeamEntity team, UserEntity user, TeamRole role) {
        TeamMemberEntity member = TeamMemberEntity.builder()
                .team(team)
                .user(user)
                .role(role)
                .build();
        return teamMemberRepository.save(member);
    }

    private ExpenseEntity createPersonalExpense(UserEntity user, CategoryEntity category, 
                                                 String description, BigDecimal amount, 
                                                 LocalDate date, Instant createdAt) {
        ExpenseEntity expense = ExpenseEntity.builder()
                .user(user)
                .category(category)
                .team(null)
                .amount(amount)
                .description(description)
                .date(date)
                .createdAt(createdAt)
                .build();
        return expenseRepository.save(expense);
    }

    private ExpenseEntity createTeamExpense(UserEntity user, TeamEntity team, CategoryEntity category,
                                            String description, BigDecimal amount,
                                            LocalDate date, Instant createdAt) {
        ExpenseEntity expense = ExpenseEntity.builder()
                .user(user)
                .category(category)
                .team(team)
                .amount(amount)
                .description(description)
                .date(date)
                .createdAt(createdAt)
                .build();
        return expenseRepository.save(expense);
    }
}


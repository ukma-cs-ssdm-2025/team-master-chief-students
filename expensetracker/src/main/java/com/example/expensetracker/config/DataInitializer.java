package com.example.expensetracker.config;

import com.example.expensetracker.entity.*;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ExpenseRepository expenseRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    
    private final Random random = new Random(42);

    @Bean
    public CommandLineRunner initTestData() {
        return args -> {
            if (userRepository.count() > 0) {
                log.info("Database already contains data, skipping initialization");
                return;
            }

            log.info("Initializing test data...");
            initializeData();
            log.info("Test data initialization completed");
        };
    }

    @Transactional
    public void initializeData() {
        // Create 5 users
        UserEntity alice = createUser("alice@example.com", "Alice", "password123");
        UserEntity bob = createUser("bob@example.com", "Bob", "password123");
        UserEntity charlie = createUser("charlie@example.com", "Charlie", "password123");
        UserEntity diana = createUser("diana@example.com", "Diana", "password123");
        UserEntity eve = createUser("eve@example.com", "Eve", "password123");

        // Create unique categories for each user (4-10 categories per user)
        List<CategoryEntity> aliceCategories = createUserCategories(alice, List.of(
            "Food & Dining", "Transportation", "Shopping", "Entertainment", 
            "Bills & Utilities", "Healthcare", "Education", "Travel"
        ));
        List<CategoryEntity> bobCategories = createUserCategories(bob, List.of(
            "Groceries", "Gas & Fuel", "Restaurants", "Movies", 
            "Phone Bill", "Gym Membership", "Books"
        ));
        List<CategoryEntity> charlieCategories = createUserCategories(charlie, List.of(
            "Fast Food", "Public Transport", "Clothing", "Games", 
            "Internet", "Medical", "Courses", "Hotels", "Car Rental"
        ));
        List<CategoryEntity> dianaCategories = createUserCategories(diana, List.of(
            "Supermarket", "Taxi", "Fashion", "Concerts", 
            "Electricity", "Pharmacy", "Online Learning"
        ));
        List<CategoryEntity> eveCategories = createUserCategories(eve, List.of(
            "Restaurant", "Bus", "Electronics", "Theater", 
            "Water Bill", "Dentist", "Workshops", "Flights", "Rent a Car"
        ));

        // Create teams: Team 1 (alice, bob, charlie), Team 2 (diana, eve)
        TeamEntity team1 = createTeam("Development Team", alice);
        TeamEntity team2 = createTeam("Marketing Team", diana);

        // Add members to Team 1
        addTeamMember(team1, alice, TeamRole.OWNER);
        addTeamMember(team1, bob, TeamRole.ADMIN);
        addTeamMember(team1, charlie, TeamRole.MEMBER);

        // Add members to Team 2
        addTeamMember(team2, diana, TeamRole.OWNER);
        addTeamMember(team2, eve, TeamRole.ADMIN);

        // Create 100+ personal expenses for each user
        createPersonalExpenses(alice, aliceCategories, 120);
        createPersonalExpenses(bob, bobCategories, 110);
        createPersonalExpenses(charlie, charlieCategories, 105);
        createPersonalExpenses(diana, dianaCategories, 115);
        createPersonalExpenses(eve, eveCategories, 125);

        // Create 300 team expenses for Team 1 (distributed among alice, bob, charlie)
        createTeamExpenses(team1, List.of(alice, bob, charlie), 
                          List.of(aliceCategories, bobCategories, charlieCategories), 300);

        // Create 300 team expenses for Team 2 (distributed among diana, eve)
        createTeamExpenses(team2, List.of(diana, eve), 
                          List.of(dianaCategories, eveCategories), 300);

        long totalExpenses = expenseRepository.count();
        // Count personal expenses (team is null) and team expenses separately
        long personalExpenses = expenseRepository.findAll().stream()
                .filter(e -> e.getTeam() == null)
                .count();
        long teamExpenses = totalExpenses - personalExpenses;
        
        log.info("Created test data:");
        log.info("- Users: {} (alice, bob, charlie, diana, eve)", userRepository.count());
        log.info("- Teams: {} (Development Team, Marketing Team)", teamRepository.count());
        log.info("- Team members: {}", teamMemberRepository.count());
        log.info("- Categories: {}", categoryRepository.count());
        log.info("- Personal expenses: {}", personalExpenses);
        log.info("- Team expenses: {}", teamExpenses);
        log.info("- Total expenses: {}", totalExpenses);
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

    private List<CategoryEntity> createUserCategories(UserEntity user, List<String> categoryNames) {
        List<CategoryEntity> categories = new ArrayList<>();
        for (String name : categoryNames) {
            categories.add(createCategory(name, user));
        }
        return categories;
    }

    private void createPersonalExpenses(UserEntity user, List<CategoryEntity> categories, int count) {
        LocalDate startDate = LocalDate.now().minusDays(365);
        Instant startInstant = Instant.now().minusSeconds(31536000); // 365 days ago
        
        String[] descriptions = {
            "Daily expense", "Weekly purchase", "Monthly bill", "Regular payment",
            "Shopping trip", "Service fee", "Subscription", "One-time purchase",
            "Regular expense", "Special purchase", "Utility payment", "Food order"
        };
        
        for (int i = 0; i < count; i++) {
            CategoryEntity category = categories.get(random.nextInt(categories.size()));
            String description = descriptions[random.nextInt(descriptions.length)] + " #" + (i + 1);
            BigDecimal amount = BigDecimal.valueOf(5.0 + random.nextDouble() * 495.0)
                    .setScale(2, java.math.RoundingMode.HALF_UP);
            
            LocalDate date = startDate.plusDays(random.nextInt(365));
            Instant createdAt = startInstant.plusSeconds(random.nextInt(31536000));
            
            createPersonalExpense(user, category, description, amount, date, createdAt);
        }
    }

    private void createTeamExpenses(TeamEntity team, List<UserEntity> users, 
                                    List<List<CategoryEntity>> userCategories, int count) {
        LocalDate startDate = LocalDate.now().minusDays(365);
        Instant startInstant = Instant.now().minusSeconds(31536000);
        
        String[] descriptions = {
            "Team lunch", "Team meeting", "Team event", "Team travel",
            "Team equipment", "Team training", "Team conference", "Team dinner",
            "Team activity", "Team project expense", "Team supplies", "Team service"
        };
        
        for (int i = 0; i < count; i++) {
            int userIndex = random.nextInt(users.size());
            UserEntity user = users.get(userIndex);
            List<CategoryEntity> categories = userCategories.get(userIndex);
            CategoryEntity category = categories.get(random.nextInt(categories.size()));
            
            String description = descriptions[random.nextInt(descriptions.length)] + " #" + (i + 1);
            BigDecimal amount = BigDecimal.valueOf(10.0 + random.nextDouble() * 990.0)
                    .setScale(2, java.math.RoundingMode.HALF_UP);
            
            LocalDate date = startDate.plusDays(random.nextInt(365));
            Instant createdAt = startInstant.plusSeconds(random.nextInt(31536000));
            
            createTeamExpense(user, team, category, description, amount, date, createdAt);
        }
    }
}


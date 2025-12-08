package com.example.expensetracker.repository;

import com.example.expensetracker.entity.TeamEntity;
import com.example.expensetracker.entity.TeamMemberEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.enums.TeamRole;
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

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DisplayName("TeamMemberRepository Tests")
public class TeamMemberRepositoryTest {

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
    private TeamMemberRepository teamMemberRepository;

    private UserEntity user;

    private TeamEntity team;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.createUser();
        entityManager.persistAndFlush(user);

        team = TestDataFactory.createTeam(user);
        entityManager.persistAndFlush(team);
    }

    @Test
    @DisplayName("Test create and retrieve team member")
    void testCreateAndRetrieveTeamMember() {
        TeamMemberEntity teamMember = TestDataFactory.createTeamMember(team, user, TeamRole.MEMBER);
        entityManager.persistAndFlush(teamMember);

        Optional<TeamMemberEntity> retrieved = teamMemberRepository.findByTeamIdAndUserId(team.getId(), user.getId());
        assertThat(retrieved).isPresent();
        assertThat(retrieved.get().getId()).isEqualTo(teamMember.getId());
    }

    @Test
    @DisplayName("Test exists by team id and user id")
    void testExistsByTeamIdAndUserId() {
        TeamMemberEntity teamMember = TestDataFactory.createTeamMember(team, user, TeamRole.MEMBER);
        entityManager.persistAndFlush(teamMember);

        boolean exists = teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId());
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Test count by team id and role")
    void testCountByTeamIdAndRole() {
        TeamMemberEntity teamMember1 = TestDataFactory.createTeamMember(team, user, TeamRole.MEMBER);
        entityManager.persistAndFlush(teamMember1);

        UserEntity anotherUser = TestDataFactory.createUser();
        entityManager.persistAndFlush(anotherUser);

        TeamMemberEntity teamMember2 = TestDataFactory.createTeamMember(team, anotherUser, TeamRole.ADMIN);
        entityManager.persistAndFlush(teamMember2);

        long memberCount = teamMemberRepository.countByTeamIdAndRole(team.getId(), TeamRole.MEMBER);
        long adminCount = teamMemberRepository.countByTeamIdAndRole(team.getId(), TeamRole.ADMIN);

        assertThat(memberCount).isEqualTo(1);
        assertThat(adminCount).isEqualTo(1);
    }

    @Test
    @DisplayName("Test find all by user id")
    void testFindAllByUserId() {
        TeamMemberEntity teamMember = TestDataFactory.createTeamMember(team, user, TeamRole.MEMBER);
        entityManager.persistAndFlush(teamMember);

        List<TeamMemberEntity> members = teamMemberRepository.findAllByUserId(user.getId());
        assertThat(members.toArray().length).isEqualTo(1);
        assertThat(members.get(0).getId()).isEqualTo(teamMember.getId());
    }

    @Test
    @DisplayName("Test find all by team id")
    void testFindAllByTeamId() {
        TeamMemberEntity teamMember = TestDataFactory.createTeamMember(team, user, TeamRole.MEMBER);
        entityManager.persistAndFlush(teamMember);

        List<TeamMemberEntity> members = teamMemberRepository.findAllByTeamId(team.getId());
        assertThat(members.toArray().length).isEqualTo(1);
        assertThat(members.get(0).getId()).isEqualTo(teamMember.getId());
    }

    @Test
    @DisplayName("Test unique constraint on team_id and user_id")
    void testUniqueConstraintOnTeamIdAndUserId() {
        TeamMemberEntity teamMember1 = TestDataFactory.createTeamMember(team, user, TeamRole.MEMBER);
        entityManager.persistAndFlush(teamMember1);

        TeamMemberEntity teamMember2 = TestDataFactory.createTeamMember(team, user, TeamRole.ADMIN);
        try {
            entityManager.persistAndFlush(teamMember2);
        } catch (Exception e) {
            assertThat(e.getCause()).isNotNull();
            assertThat(e.getCause().getMessage()).contains("uk_team_members_team_user");
        }
    }
}

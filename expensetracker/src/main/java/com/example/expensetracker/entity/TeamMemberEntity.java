package com.example.expensetracker.entity;

import com.example.expensetracker.enums.TeamRole;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "team_members", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_team_members_team_user", columnNames = {"team_id", "user_id"})
    },
    indexes = {
        @Index(name = "idx_team_members_user_id", columnList = "user_id")
    }
)
public class TeamMemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false, foreignKey = @ForeignKey(name = "fk_team_members_team"))
    private TeamEntity team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_team_members_user"))
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeamRole role;
}


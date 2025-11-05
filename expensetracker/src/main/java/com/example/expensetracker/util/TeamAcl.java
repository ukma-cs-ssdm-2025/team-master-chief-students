package com.example.expensetracker.util;

import com.example.expensetracker.entity.TeamMemberEntity;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.exception.ForbiddenException;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.repository.TeamMemberRepository;
import com.example.expensetracker.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Component
@RequiredArgsConstructor
public class TeamAcl {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    public TeamMemberEntity requireMembership(Long userId, Long teamId, TeamRole... allowedRoles) {
        if (!teamRepository.existsById(teamId)) {
            throw new NotFoundException("Team not found");
        }

        TeamMemberEntity member = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> new ForbiddenException("User is not a member of the team"));

        if (allowedRoles.length > 0) {
            Set<TeamRole> allowedRolesSet = Set.of(allowedRoles);
            if (!allowedRolesSet.contains(member.getRole())) {
                throw new ForbiddenException("Insufficient permissions. Required roles: " + 
                        Set.of(allowedRoles));
            }
        }

        return member;
    }

    public List<Long> listMyTeamIds(Long userId) {
        return teamMemberRepository.findAllByUserId(userId)
                .stream()
                .map(member -> member.getTeam().getId())
                .collect(Collectors.toList());
    }

    public boolean isMember(Long userId, Long teamId) {
        return teamMemberRepository.existsByTeamIdAndUserId(teamId, userId);
    }

    public TeamRole getUserRole(Long userId, Long teamId) {
        return teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .map(TeamMemberEntity::getRole)
                .orElse(null);
    }
}


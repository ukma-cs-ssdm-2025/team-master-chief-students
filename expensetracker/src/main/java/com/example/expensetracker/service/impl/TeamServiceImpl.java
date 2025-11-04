package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.TeamEntity;
import com.example.expensetracker.entity.TeamMemberEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.exception.ForbiddenException;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.repository.TeamMemberRepository;
import com.example.expensetracker.repository.TeamRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.TeamService;
import com.example.expensetracker.util.TeamAcl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeamServiceImpl extends BaseService implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final TeamAcl teamAcl;

    @Override
    @Transactional
    public TeamDto createTeam(Long me, CreateTeamDto dto) {
        log.info("Creating team '{}' for user {}", dto.getName(), me);
        
        UserEntity owner = userRepository.findById(me)
                .orElseThrow(() -> new NotFoundException("User not found"));

        TeamEntity team = TeamEntity.builder()
                .name(dto.getName())
                .owner(owner)
                .build();
        
        team = teamRepository.save(team);

        TeamMemberEntity ownerMember = TeamMemberEntity.builder()
                .team(team)
                .user(owner)
                .role(TeamRole.OWNER)
                .build();
        
        teamMemberRepository.save(ownerMember);
        
        log.info("Team '{}' created with id {}", team.getName(), team.getId());
        
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamDto> listMyTeams(Long me) {
        log.debug("Listing teams for user {}", me);
        
        return teamMemberRepository.findAllByUserId(me)
                .stream()
                .map(member -> TeamDto.builder()
                        .id(member.getTeam().getId())
                        .name(member.getTeam().getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeamDetailsDto getTeam(Long me, Long teamId) {
        log.debug("Getting team {} for user {}", teamId, me);
        
        teamAcl.requireMembership(me, teamId);
        
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));

        List<TeamMemberDto> members = teamMemberRepository.findAllByTeamId(teamId)
                .stream()
                .map(member -> TeamMemberDto.builder()
                        .userId(member.getUser().getId())
                        .email(member.getUser().getEmail())
                        .role(member.getRole())
                        .build())
                .collect(Collectors.toList());

        return TeamDetailsDto.builder()
                .id(team.getId())
                .name(team.getName())
                .members(members)
                .build();
    }

    @Override
    @Transactional
    public void addMember(Long me, Long teamId, AddMemberDto dto) {
        log.info("Adding user {} to team {} with role {} by user {}", dto.getUserId(), teamId, dto.getRole(), me);
        
        teamAcl.requireMembership(me, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        
        if (teamMemberRepository.existsByTeamIdAndUserId(teamId, dto.getUserId())) {
            throw new ValidationException("User is already a member of the team");
        }

        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));
        
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        TeamMemberEntity member = TeamMemberEntity.builder()
                .team(team)
                .user(user)
                .role(dto.getRole())
                .build();
        
        teamMemberRepository.save(member);
        
        log.info("User {} added to team {} with role {}", dto.getUserId(), teamId, dto.getRole());
    }

    @Override
    @Transactional
    public void changeRole(Long me, Long teamId, Long memberUserId, TeamRole role) {
        log.info("Changing role of user {} in team {} to {} by user {}", memberUserId, teamId, role, me);
        
        teamAcl.requireMembership(me, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        
        TeamMemberEntity member = teamMemberRepository.findByTeamIdAndUserId(teamId, memberUserId)
                .orElseThrow(() -> new NotFoundException("Team member not found"));

        if (member.getRole() == TeamRole.OWNER && role != TeamRole.OWNER) {
            long ownerCount = teamMemberRepository.countByTeamIdAndRole(teamId, TeamRole.OWNER);
            if (ownerCount <= 1) {
                throw new ValidationException("Cannot change role of the last owner");
            }
        }

        if (role == TeamRole.OWNER && member.getRole() != TeamRole.OWNER) {
            TeamMemberEntity currentUser = teamAcl.requireMembership(me, teamId, TeamRole.OWNER);
            if (currentUser.getRole() != TeamRole.OWNER) {
                throw new ForbiddenException("Only owner can assign owner role");
            }
        }

        member.setRole(role);
        teamMemberRepository.save(member);
        
        log.info("Role of user {} in team {} changed to {}", memberUserId, teamId, role);
    }

    @Override
    @Transactional
    public void removeMember(Long me, Long teamId, Long memberUserId) {
        log.info("Removing user {} from team {} by user {}", memberUserId, teamId, me);
        
        TeamMemberEntity member = teamMemberRepository.findByTeamIdAndUserId(teamId, memberUserId)
                .orElseThrow(() -> new NotFoundException("Team member not found"));

        if (me.equals(memberUserId)) {
            if (member.getRole() == TeamRole.OWNER) {
                long ownerCount = teamMemberRepository.countByTeamIdAndRole(teamId, TeamRole.OWNER);
                if (ownerCount <= 1) {
                    throw new ValidationException("Cannot remove the last owner");
                }
            }
        } else {
            teamAcl.requireMembership(me, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        }

        teamMemberRepository.delete(member);
        
        log.info("User {} removed from team {}", memberUserId, teamId);
    }
}


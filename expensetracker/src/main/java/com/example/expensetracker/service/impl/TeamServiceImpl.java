package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.TeamEntity;
import com.example.expensetracker.entity.TeamMemberEntity;
import com.example.expensetracker.entity.UserEntity;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.repository.TeamMemberRepository;
import com.example.expensetracker.repository.TeamRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.TeamService;
import com.example.expensetracker.util.TeamAcl;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl extends BaseService implements TeamService {

    private static final Logger logger = LogManager.getLogger(TeamServiceImpl.class);

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final TeamAcl teamAcl;

    @Override
    @Transactional
    public TeamDto createTeam(Long me, CreateTeamDto dto) {
        logger.info("Creating team '{}' for user {}", dto.getName(), me);
        
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
        
        logger.info("Team '{}' created with id {}", team.getName(), team.getId());
        
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamDto> listMyTeams(Long me) {
        logger.debug("Listing teams for user {}", me);
        
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
        logger.debug("Getting team {} for user {}", teamId, me);
        
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
        logger.info("Adding user {} to team {} with role {} by user {}", dto.getUserId(), teamId, dto.getRole(), me);
        
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
        
        logger.info("User {} added to team {} with role {}", dto.getUserId(), teamId, dto.getRole());
    }

    @Override
    @Transactional
    public void changeRole(Long me, Long teamId, Long memberUserId, TeamRole role) {
        logger.info("Changing role of user {} in team {} to {} by user {}", memberUserId, teamId, role, me);
        
        TeamMemberEntity member = teamMemberRepository.findByTeamIdAndUserId(teamId, memberUserId)
                .orElseThrow(() -> new NotFoundException("Team member not found"));

        if (role == TeamRole.OWNER && member.getRole() != TeamRole.OWNER) {
            teamAcl.requireMembership(me, teamId, TeamRole.OWNER);
        } else {
            teamAcl.requireMembership(me, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        }

        if (member.getRole() == TeamRole.OWNER && role != TeamRole.OWNER) {
            long ownerCount = teamMemberRepository.countByTeamIdAndRole(teamId, TeamRole.OWNER);
            if (ownerCount <= 1) {
                throw new ValidationException("Cannot change role of the last owner");
            }
        }

        member.setRole(role);
        teamMemberRepository.save(member);
        
        logger.info("Role of user {} in team {} changed to {}", memberUserId, teamId, role);
    }

    @Override
    @Transactional
    public void removeMember(Long me, Long teamId, Long memberUserId) {
        logger.info("Removing user {} from team {} by user {}", memberUserId, teamId, me);
        
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
        
        logger.info("User {} removed from team {}", memberUserId, teamId);
    }

    @Override
    @Transactional
    public TeamDto updateTeamName(Long me, Long teamId, UpdateTeamNameDto dto) {
        logger.info("Updating team {} name to '{}' by user {}", teamId, dto.getName(), me);

        teamAcl.requireMembership(me, teamId, TeamRole.OWNER, TeamRole.ADMIN);
        
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));
        
        team.setName(dto.getName());
        team = teamRepository.save(team);
        
        logger.info("Team {} name updated to '{}'", teamId, team.getName());
        
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .build();
    }

    @Override
    @Transactional
    public void deleteTeam(Long me, Long teamId) {
        logger.info("Deleting team {} by user {}", teamId, me);
        
        teamAcl.requireMembership(me, teamId, TeamRole.OWNER);
        
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));
        if (!team.getOwner().getId().equals(me)) {
            throw new ValidationException("Only team owner can delete the team");
        }
        
        teamRepository.delete(team);
        
        logger.info("Team {} deleted by user {}", teamId, me);
    }
}


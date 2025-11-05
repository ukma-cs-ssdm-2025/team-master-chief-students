package com.example.expensetracker.service;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.enums.TeamRole;

import java.util.List;

public interface TeamService {
    TeamDto createTeam(Long me, CreateTeamDto dto);
    
    List<TeamDto> listMyTeams(Long me);
    
    TeamDetailsDto getTeam(Long me, Long teamId);
    
    void addMember(Long me, Long teamId, AddMemberDto dto);
    
    void changeRole(Long me, Long teamId, Long memberUserId, TeamRole role);
    
    void removeMember(Long me, Long teamId, Long memberUserId);
}


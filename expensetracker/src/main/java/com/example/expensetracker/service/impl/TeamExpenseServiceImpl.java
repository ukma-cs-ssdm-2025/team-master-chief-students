package com.example.expensetracker.service.impl;

import com.example.expensetracker.dto.CreateExpenseDto;
import com.example.expensetracker.dto.CursorPageResponse;
import com.example.expensetracker.dto.ExpenseDto;
import com.example.expensetracker.entity.CategoryEntity;
import com.example.expensetracker.entity.ExpenseEntity;
import com.example.expensetracker.entity.TeamEntity;
import com.example.expensetracker.enums.ShareMode;
import com.example.expensetracker.enums.TeamRole;
import com.example.expensetracker.exception.ForbiddenException;
import com.example.expensetracker.exception.NotFoundException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.mapper.ExpenseMapper;
import com.example.expensetracker.repository.CategoryRepository;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.TeamRepository;
import com.example.expensetracker.service.BaseService;
import com.example.expensetracker.service.TeamExpenseService;
import com.example.expensetracker.util.CursorUtil;
import com.example.expensetracker.util.TeamAcl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeamExpenseServiceImpl extends BaseService implements TeamExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final TeamRepository teamRepository;
    private final CategoryRepository categoryRepository;
    private final TeamAcl teamAcl;

    @Override
    @Transactional(readOnly = true)
    public CursorPageResponse<ExpenseDto> listTeamExpenses(Long userId, Long teamId, String cursor, int limit) {
        log.debug("Listing team expenses for user {} in team {} with cursor: {}", userId, teamId, cursor);
        
        teamAcl.requireMembership(userId, teamId);

        int pageSize = Math.min(Math.max(limit, 1), 100);

        List<ExpenseEntity> expenses;
        
        if (cursor != null && !cursor.isBlank()) {
            try {
                var cursorInfoOpt = CursorUtil.decodeCursor(cursor);
                if (cursorInfoOpt.isPresent()) {
                    var cursorInfo = cursorInfoOpt.get();
                    Instant cursorCreatedAt = cursorInfo.getCreatedAt();
                    Long cursorId = cursorInfo.getId();
                    
                    expenses = expenseRepository.findByTeamIdWithCursor(
                            teamId,
                            cursorCreatedAt,
                            cursorId,
                            PageRequest.of(0, pageSize + 1)
                    );
                } else {
                    expenses = expenseRepository.findByTeamIdOrdered(
                            teamId,
                            PageRequest.of(0, pageSize + 1)
                    );
                }
            } catch (ValidationException e) {
                throw new ValidationException("Invalid cursor: " + e.getMessage());
            }
        } else {
            expenses = expenseRepository.findByTeamIdOrdered(
                    teamId,
                    PageRequest.of(0, pageSize + 1)
            );
        }

        boolean hasNext = expenses.size() > pageSize;
        if (hasNext) {
            expenses = expenses.subList(0, pageSize);
        }

        List<ExpenseDto> expenseDtos = expenses.stream()
                .map(expenseMapper::toDto)
                .collect(Collectors.toList());

        String nextCursor = null;
        if (hasNext && !expenses.isEmpty()) {
            ExpenseEntity lastExpense = expenses.get(expenses.size() - 1);
            nextCursor = CursorUtil.encodeCursor(lastExpense.getCreatedAt(), lastExpense.getId());
        }

        return CursorPageResponse.of(expenseDtos, nextCursor, hasNext);
    }

    @Override
    @Transactional
    public ExpenseDto createInTeam(Long me, Long teamId, CreateExpenseDto dto) {
        log.info("Creating expense in team {} by user {}", teamId, me);
        
        teamAcl.requireMembership(me, teamId, TeamRole.MEMBER, TeamRole.ADMIN, TeamRole.OWNER);
        
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));
        
        var currentUser = getAuthenticatedUser();
        
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));
        
        ExpenseEntity expense = ExpenseEntity.builder()
                .user(currentUser)
                .category(category)
                .team(team)
                .amount(dto.getAmount())
                .description(dto.getDescription())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .build();
        
        expense = expenseRepository.save(expense);
        
        log.info("Expense {} created in team {}", expense.getId(), teamId);
        
        return expenseMapper.toDto(expense);
    }

    @Override
    @Transactional
    public ExpenseDto sharePersonalToTeam(Long me, Long expenseId, Long teamId, ShareMode mode) {
        log.info("Sharing expense {} to team {} with mode {} by user {}", expenseId, teamId, mode, me);
        
        ExpenseEntity expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new NotFoundException("Expense not found"));
        
        if (!expense.getUser().getId().equals(me)) {
            throw new ForbiddenException("You can only share your own expenses");
        }
        
        if (expense.getTeam() != null) {
            throw new ValidationException("Expense is already shared with a team");
        }
        
        teamAcl.requireMembership(me, teamId);
        
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));
        
        if (mode == ShareMode.MOVE) {
            expense.setTeam(team);
            expense = expenseRepository.save(expense);
            log.info("Expense {} moved to team {}", expenseId, teamId);
        } else if (mode == ShareMode.COPY_REFERENCE) {
            ExpenseEntity teamExpense = ExpenseEntity.builder()
                    .user(expense.getUser())
                    .category(expense.getCategory())
                    .team(team)
                    .amount(expense.getAmount())
                    .description(expense.getDescription())
                    .date(expense.getDate())
                    .createdAt(Instant.now())
                    .build();
            
            teamExpense = expenseRepository.save(teamExpense);
            log.info("Expense {} copied to team {} as expense {}", expenseId, teamId, teamExpense.getId());
            
            return expenseMapper.toDto(teamExpense);
        }
        
        return expenseMapper.toDto(expense);
    }
}


package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.ManagerOption;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TeamMemberResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.UpdateMemberRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Users;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.TaskRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.UsersRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeamService {

  private final UsersRepository usersRepository;
  private final TaskRepository taskRepository;
  private final HierarchyService hierarchy;

  /** All potential managers for the public registration picker. */
  @Transactional(readOnly = true)
  public List<ManagerOption> listManagers() {
    return usersRepository.findAll().stream()
        .map(u -> new ManagerOption(u.getUsername(), u.getFullName()))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<TeamMemberResponse> getReports(String managerUsername) {
    requireManager(managerUsername);
    return hierarchy.descendants(managerUsername).stream().map(this::toMember).toList();
  }

  @Transactional
  public TeamMemberResponse addMember(String managerUsername, String memberUsername) {
    Users manager = requireManager(managerUsername);
    Users member = requireUser(memberUsername);

    if (member.getUsername().equals(manager.getUsername())) {
      throw new IllegalArgumentException("You cannot add yourself.");
    }
    // Adding an ancestor as your report would create a cycle.
    if (hierarchy.isManagerOf(memberUsername, managerUsername)) {
      throw new IllegalArgumentException("That user is above you in the hierarchy.");
    }
    member.setManager(manager);
    return toMember(usersRepository.save(member));
  }

  @Transactional
  public TeamMemberResponse updateMember(
      String managerUsername, String memberUsername, UpdateMemberRequest request) {
    requireManager(managerUsername);
    if (!hierarchy.isManagerOf(managerUsername, memberUsername)) {
      throw new AccessDeniedException("That user is not in your team.");
    }
    Users member = requireUser(memberUsername);

    if (request.getOrgRole() != null) {
      member.setOrgRole(request.getOrgRole());
    }
    if (request.getManagerUsername() != null) {
      Users newManager = requireUser(request.getManagerUsername());
      boolean allowed =
          newManager.getUsername().equals(managerUsername)
              || hierarchy.isManagerOf(managerUsername, newManager.getUsername());
      if (!allowed) {
        throw new AccessDeniedException("New manager must be within your team.");
      }
      // Prevent cycles: the new manager cannot be the member or one of the member's descendants.
      if (newManager.getUsername().equals(memberUsername)
          || hierarchy.isManagerOf(memberUsername, newManager.getUsername())) {
        throw new IllegalArgumentException("That reporting change would create a cycle.");
      }
      member.setManager(newManager);
    }
    return toMember(usersRepository.save(member));
  }

  private Users requireManager(String username) {
    Users user = requireUser(username);
    if (!user.getOrgRole().canManageTeam()) {
      throw new AccessDeniedException("Only managers and team leads can manage a team.");
    }
    return user;
  }

  private Users requireUser(String username) {
    return usersRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
  }

  private TeamMemberResponse toMember(Users user) {
    TeamMemberResponse dto = new TeamMemberResponse();
    dto.setId(user.getId());
    dto.setUsername(user.getUsername());
    dto.setFullName(user.getFullName());
    dto.setOrgRole(user.getOrgRole());
    dto.setAvatarUrl(user.getAvatarUrl());
    dto.setManagerUsername(user.getManager() != null ? user.getManager().getUsername() : null);
    dto.setActiveTasks(
        taskRepository.countByAssigneeUsernameAndStatusNot(user.getUsername(), Task.Status.DONE));
    return dto;
  }
}

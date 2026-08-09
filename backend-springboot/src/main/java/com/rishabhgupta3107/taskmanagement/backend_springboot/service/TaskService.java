package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.mapper.TaskMapper;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Users;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.TaskRepository;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tasks are scoped by assignee. A user sees and edits tasks assigned to them; a manager may
 * additionally view (read-only) the tasks of anyone in their reporting tree, and may create/assign
 * tasks down to their reports.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepository;
  private final UsersRepository usersRepository;
  private final HierarchyService hierarchy;

  @Transactional(readOnly = true)
  public Page<TaskResponse> getTasks(String username, Pageable pageable) {
    return taskRepository.findByAssigneeUsername(username, pageable).map(TaskMapper::toResponse);
  }

  /** A manager viewing a report's tasks (read-only). */
  @Transactional(readOnly = true)
  public Page<TaskResponse> getMemberTasks(String managerUsername, String memberUsername, Pageable pageable) {
    if (!memberUsername.equals(managerUsername)
        && !hierarchy.isManagerOf(managerUsername, memberUsername)) {
      throw new AccessDeniedException("That user is not in your team.");
    }
    return taskRepository.findByAssigneeUsername(memberUsername, pageable).map(TaskMapper::toResponse);
  }

  @Transactional(readOnly = true)
  public TaskResponse getTaskById(Long id, String username) {
    Task task = taskRepository.findById(id).orElseThrow(() -> notFound());
    if (!canView(task, username)) {
      throw notFound();
    }
    return TaskMapper.toResponse(task);
  }

  @Transactional
  public TaskResponse createTask(TaskRequest request, String username) {
    Users creator = requireUser(username);
    Users assignee = resolveAssignee(request.getAssigneeUsername(), creator, username);

    Task task = new Task();
    TaskMapper.applyToEntity(request, task);
    task.setOwner(creator);
    task.setAssignee(assignee);
    return TaskMapper.toResponse(taskRepository.save(task));
  }

  @Transactional
  public TaskResponse updateTask(Long id, TaskRequest request, String username) {
    // Only the assignee may edit a task.
    Task task =
        taskRepository.findByIdAndAssigneeUsername(id, username).orElseThrow(() -> notFound());
    TaskMapper.applyToEntity(request, task);
    return TaskMapper.toResponse(taskRepository.save(task));
  }

  @Transactional
  public void deleteTask(Long id, String username) {
    Task task =
        taskRepository.findByIdAndAssigneeUsername(id, username).orElseThrow(() -> notFound());
    taskRepository.delete(task);
  }

  @Transactional(readOnly = true)
  public List<TaskResponse> getTasksByStatus(String username, Task.Status status) {
    return taskRepository.findByAssigneeUsernameAndStatus(username, status).stream()
        .map(TaskMapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<TaskResponse> searchTasks(String username, String keyword) {
    return taskRepository.searchByAssignee(username, keyword).stream()
        .map(TaskMapper::toResponse)
        .toList();
  }

  // ----- helpers -----

  private Users resolveAssignee(String assigneeUsername, Users creator, String creatorName) {
    if (assigneeUsername == null
        || assigneeUsername.isBlank()
        || assigneeUsername.equals(creatorName)) {
      return creator;
    }
    if (!hierarchy.isManagerOf(creatorName, assigneeUsername)) {
      throw new AccessDeniedException("You can only assign tasks to your team members.");
    }
    return requireUser(assigneeUsername);
  }

  private boolean canView(Task task, String username) {
    String assignee = task.getAssignee() != null ? task.getAssignee().getUsername() : null;
    if (username.equals(assignee)) {
      return true;
    }
    return assignee != null && hierarchy.isManagerOf(username, assignee);
  }

  private Users requireUser(String username) {
    return usersRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
  }

  private EntityNotFoundException notFound() {
    return new EntityNotFoundException("Task not found");
  }
}

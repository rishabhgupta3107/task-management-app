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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * All operations are scoped to the authenticated user (owner). A user can never see or mutate
 * another user's tasks.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepository;
  private final UsersRepository usersRepository;

  @Transactional(readOnly = true)
  public Page<TaskResponse> getTasks(String username, Pageable pageable) {
    return taskRepository.findByOwnerUsername(username, pageable).map(TaskMapper::toResponse);
  }

  @Transactional(readOnly = true)
  public TaskResponse getTaskById(Long id, String username) {
    return TaskMapper.toResponse(requireOwnedTask(id, username));
  }

  @Transactional
  public TaskResponse createTask(TaskRequest request, String username) {
    Users owner =
        usersRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    Task task = new Task();
    TaskMapper.applyToEntity(request, task);
    task.setOwner(owner);
    return TaskMapper.toResponse(taskRepository.save(task));
  }

  @Transactional
  public TaskResponse updateTask(Long id, TaskRequest request, String username) {
    Task task = requireOwnedTask(id, username);
    TaskMapper.applyToEntity(request, task);
    return TaskMapper.toResponse(taskRepository.save(task));
  }

  @Transactional
  public void deleteTask(Long id, String username) {
    Task task = requireOwnedTask(id, username);
    taskRepository.delete(task);
  }

  @Transactional(readOnly = true)
  public List<TaskResponse> getTasksByStatus(String username, Task.Status status) {
    return taskRepository.findByOwnerUsernameAndStatus(username, status).stream()
        .map(TaskMapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<TaskResponse> searchTasks(String username, String keyword) {
    return taskRepository
        .findByOwnerUsernameAndTitleContainingIgnoreCaseOrOwnerUsernameAndDescriptionContainingIgnoreCase(
            username, keyword, username, keyword)
        .stream()
        .map(TaskMapper::toResponse)
        .toList();
  }

  private Task requireOwnedTask(Long id, String username) {
    return taskRepository
        .findByIdAndOwnerUsername(id, username)
        .orElseThrow(() -> new EntityNotFoundException("Task not found"));
  }
}

package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TaskService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

  private final TaskService taskService;

  @GetMapping
  public Page<TaskResponse> getAllTasks(
      Principal principal, @PageableDefault(size = 20) Pageable pageable) {
    return taskService.getTasks(principal.getName(), pageable);
  }

  @GetMapping("/member/{username}")
  public Page<TaskResponse> getMemberTasks(
      @PathVariable String username,
      Principal principal,
      @PageableDefault(size = 20) Pageable pageable) {
    return taskService.getMemberTasks(principal.getName(), username, pageable);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id, Principal principal) {
    return ResponseEntity.ok(taskService.getTaskById(id, principal.getName()));
  }

  @PostMapping
  public ResponseEntity<TaskResponse> createTask(
      @Valid @RequestBody TaskRequest task, Principal principal) {
    TaskResponse created = taskService.createTask(task, principal.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskResponse> updateTask(
      @PathVariable Long id, @Valid @RequestBody TaskRequest task, Principal principal) {
    return ResponseEntity.ok(taskService.updateTask(id, task, principal.getName()));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id, Principal principal) {
    taskService.deleteTask(id, principal.getName());
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/status/{status}")
  public List<TaskResponse> getTasksByStatus(
      @PathVariable Task.Status status, Principal principal) {
    return taskService.getTasksByStatus(principal.getName(), status);
  }

  @GetMapping("/search")
  public List<TaskResponse> searchTasks(@RequestParam String keyword, Principal principal) {
    return taskService.searchTasks(principal.getName(), keyword);
  }
}

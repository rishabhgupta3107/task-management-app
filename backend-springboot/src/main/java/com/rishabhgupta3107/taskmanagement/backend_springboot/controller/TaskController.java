package com.rishabhgupta3107.taskmanagement.backend_springboot.controller;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.service.TaskService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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
public class TaskController {

  @Autowired private TaskService taskService;

  @GetMapping
  public List<Task> getAllTasks() {
    return taskService.getAllTasks();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
    Task task = taskService.getTaskById(id);
    return ResponseEntity.ok(task);
  }

  @PostMapping
  public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
    Task createdTask = taskService.createTask(task);
    return ResponseEntity.ok(createdTask);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
    Task updatedTask = taskService.updateTask(id, task);
    return ResponseEntity.ok(updatedTask);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
    taskService.deleteTask(id);
    return ResponseEntity.noContent().build();
  }

  // Endpoint for getting tasks by status
  @GetMapping("/status/{status}")
  public List<Task> getTasksByStatus(@PathVariable Task.Status status) {
    return taskService.getTasksByStatus(status);
  }

  // Endpoint for searching tasks by keyword
  @GetMapping("/search")
  public List<Task> searchTasks(@RequestParam String keyword) {
    return taskService.searchTasks(keyword);
  }
}

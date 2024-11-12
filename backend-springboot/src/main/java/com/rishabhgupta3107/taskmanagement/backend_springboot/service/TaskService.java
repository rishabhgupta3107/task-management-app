package com.rishabhgupta3107.taskmanagement.backend_springboot.service;

import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import com.rishabhgupta3107.taskmanagement.backend_springboot.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

  @Autowired private TaskRepository taskRepository;

  public List<Task> getAllTasks() {
    return taskRepository.findAll();
  }

  public Task getTaskById(Long id) {
    return taskRepository
        .findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Task not found"));
  }

  public Task createTask(Task task) {
    return taskRepository.save(task);
  }

  public Task updateTask(Long id, Task task) {
    if (taskRepository.existsById(id)) {
      task.setId(id);
      return taskRepository.save(task);
    } else {
      throw new EntityNotFoundException("Task not found");
    }
  }

  public void deleteTask(Long id) {
    if (taskRepository.existsById(id)) {
      taskRepository.deleteById(id);
    } else {
      throw new EntityNotFoundException("Task not found");
    }
  }

  // Custom methods to handle task status management and search functionality
  public List<Task> getTasksByStatus(Task.Status status) {
    return taskRepository.findByStatus(status);
  }

  public List<Task> searchTasks(String keyword) {
    return taskRepository.findByTitleContainingOrDescriptionContaining(keyword, keyword);
  }
}

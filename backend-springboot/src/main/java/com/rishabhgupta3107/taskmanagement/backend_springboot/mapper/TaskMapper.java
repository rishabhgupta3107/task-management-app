package com.rishabhgupta3107.taskmanagement.backend_springboot.mapper;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;

/** Maps between the Task entity and its DTOs. Keeps the persistence model off the wire. */
public final class TaskMapper {

  private TaskMapper() {}

  public static TaskResponse toResponse(Task task) {
    TaskResponse response = new TaskResponse();
    response.setId(task.getId());
    response.setTitle(task.getTitle());
    response.setDescription(task.getDescription());
    response.setStatus(task.getStatus());
    response.setPriority(task.getPriority());
    response.setDueDate(task.getDueDate());
    return response;
  }

  /** Copies mutable fields from a request onto an existing (or new) entity. */
  public static void applyToEntity(TaskRequest request, Task task) {
    task.setTitle(request.getTitle());
    task.setDescription(request.getDescription());
    task.setStatus(request.getStatus());
    task.setPriority(request.getPriority());
    task.setDueDate(request.getDueDate());
  }
}

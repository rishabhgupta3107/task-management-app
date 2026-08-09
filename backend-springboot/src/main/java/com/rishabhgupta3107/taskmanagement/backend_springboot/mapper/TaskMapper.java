package com.rishabhgupta3107.taskmanagement.backend_springboot.mapper;

import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.SubtaskDto;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskRequest;
import com.rishabhgupta3107.taskmanagement.backend_springboot.dto.TaskResponse;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Subtask;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

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
    response.setTags(new LinkedHashSet<>(task.getTags()));
    response.setSubtasks(toSubtaskDtos(task.getSubtasks()));
    response.setCreatedAt(task.getCreatedAt());
    response.setUpdatedAt(task.getUpdatedAt());
    return response;
  }

  /** Copies mutable fields from a request onto an existing (or new) entity. */
  public static void applyToEntity(TaskRequest request, Task task) {
    task.setTitle(request.getTitle());
    task.setDescription(request.getDescription());
    task.setStatus(request.getStatus());
    task.setPriority(request.getPriority());
    task.setDueDate(request.getDueDate());

    task.getTags().clear();
    if (request.getTags() != null) {
      task.getTags().addAll(request.getTags());
    }

    task.getSubtasks().clear();
    if (request.getSubtasks() != null) {
      for (SubtaskDto dto : request.getSubtasks()) {
        task.getSubtasks().add(new Subtask(dto.getTitle(), dto.isDone()));
      }
    }
  }

  private static List<SubtaskDto> toSubtaskDtos(List<Subtask> subtasks) {
    List<SubtaskDto> dtos = new ArrayList<>();
    if (subtasks != null) {
      for (Subtask s : subtasks) {
        SubtaskDto dto = new SubtaskDto();
        dto.setTitle(s.getTitle());
        dto.setDone(s.isDone());
        dtos.add(dto);
      }
    }
    return dtos;
  }
}

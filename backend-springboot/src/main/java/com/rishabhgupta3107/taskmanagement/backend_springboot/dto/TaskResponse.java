package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

/** Outbound representation of a task. Never exposes the owning user entity. */
@Getter
@Setter
public class TaskResponse {

  private Long id;
  private String title;
  private String description;
  private Task.Status status;
  private Task.Priority priority;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dueDate;

  private Set<String> tags = new LinkedHashSet<>();
  private List<SubtaskDto> subtasks = new ArrayList<>();
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}

package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.rishabhgupta3107.taskmanagement.backend_springboot.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

/** Inbound payload for creating/updating a task. Deliberately excludes id and owner. */
@Getter
@Setter
public class TaskRequest {

  @NotBlank(message = "Title is mandatory.")
  @Size(max = 100, message = "Title must be at most 100 characters.")
  private String title;

  @NotBlank(message = "Description is mandatory.")
  @Size(max = 1000, message = "Description must be at most 1000 characters.")
  private String description;

  @NotNull(message = "Status is mandatory.")
  private Task.Status status;

  @NotNull(message = "Priority is mandatory.")
  private Task.Priority priority;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dueDate;
}

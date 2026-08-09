package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubtaskDto {

  @NotBlank(message = "Subtask title is required.")
  @Size(max = 200, message = "Subtask title must be at most 200 characters.")
  private String title;

  private boolean done;
}

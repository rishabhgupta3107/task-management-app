package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMemberRequest {

  @NotBlank(message = "Username is required.")
  private String username;
}

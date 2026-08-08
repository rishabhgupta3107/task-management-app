package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/** Inbound payload for self-service registration. */
@Getter
@Setter
public class RegisterRequest {

  @NotBlank(message = "Username is mandatory.")
  @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
  private String username;

  @NotBlank(message = "Password is mandatory.")
  @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters.")
  private String password;
}

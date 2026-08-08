package com.rishabhgupta3107.taskmanagement.backend_springboot.security;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class AuthenticationRequest {

  @NotBlank(message = "Username is mandatory.")
  private String username;

  @NotBlank(message = "Password is mandatory.")
  private String password;

  public AuthenticationRequest(String username, String password) {
    this.username = username;
    this.password = password;
  }
}

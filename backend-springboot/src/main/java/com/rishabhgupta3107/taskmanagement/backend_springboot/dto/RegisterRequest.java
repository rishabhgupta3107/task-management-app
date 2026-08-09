package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

/** Inbound payload for self-service registration. Profile fields are optional. */
@Getter
@Setter
public class RegisterRequest {

  @NotBlank(message = "Username is mandatory.")
  @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
  private String username;

  @NotBlank(message = "Password is mandatory.")
  @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters.")
  private String password;

  @Size(max = 100, message = "Name must be at most 100 characters.")
  private String fullName;

  @Email(message = "Enter a valid email address.")
  @Size(max = 150)
  private String email;

  @Past(message = "Date of birth must be in the past.")
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dob;

  @Size(max = 500, message = "Avatar URL must be at most 500 characters.")
  private String avatarUrl;

  /** Optional: the username of the manager this person reports to. */
  private String managerUsername;
}

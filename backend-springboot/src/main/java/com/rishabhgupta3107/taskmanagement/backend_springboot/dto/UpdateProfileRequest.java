package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

/** Inbound payload for updating the authenticated user's profile. */
@Getter
@Setter
public class UpdateProfileRequest {

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

  @Size(max = 100, message = "Title must be at most 100 characters.")
  private String title;

  @Size(max = 500, message = "Bio must be at most 500 characters.")
  private String bio;

  @Size(max = 64)
  private String timezone;
}

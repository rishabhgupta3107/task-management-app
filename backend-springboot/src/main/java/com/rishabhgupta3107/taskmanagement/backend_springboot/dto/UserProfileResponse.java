package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/** Outbound representation of the authenticated user's profile. */
@Getter
@Setter
public class UserProfileResponse {

  private String username;
  private String fullName;
  private String email;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dob;

  /** Derived from dob (null when dob is not set). */
  private Integer age;

  private String avatarUrl;
  private String title;
  private String bio;
  private String timezone;
  private LocalDateTime createdAt;
}

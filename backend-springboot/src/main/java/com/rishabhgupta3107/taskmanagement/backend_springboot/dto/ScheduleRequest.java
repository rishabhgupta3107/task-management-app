package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleRequest {

  /** NONE, DAILY, WEEKLY, MONTHLY. */
  private String frequency;

  @Email(message = "Enter a valid recipient email.")
  private String recipient;
}

package com.rishabhgupta3107.taskmanagement.backend_springboot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDashboardRequest {

  @NotBlank(message = "Dashboard name is required.")
  @Size(max = 120)
  private String name;

  /** One of: BLANK, SEO, PAID_ADS, SOCIAL, EMAIL. Seeds starter widgets. */
  private String template;
}
